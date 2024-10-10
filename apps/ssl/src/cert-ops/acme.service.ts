import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import * as acme from 'acme-client';
import * as dns2 from 'dns2';

import { BUSINESS_ERROR_CODE, BusinessException, getEnv } from '@app/comm';

import { AcmeOrder } from './acme.order.mysql.entity';
import { CreateAccountDto } from './acme.dto';
import { AcmeAccount, EncryptionType } from './acme.account.mysql.entity';

const isProd = getEnv();

const directoryUrl = isProd
	? acme.directory.letsencrypt.production
	: acme.directory.letsencrypt.staging;
@Injectable()
export class CertService {
	constructor(
		@Inject('ORDER_REPOSITORY')
		private acmeOrderRepository: Repository<AcmeOrder>,
		@Inject('ACCOUNT_REPOSITORY')
		private acmeAccountRepository: Repository<AcmeAccount>
	) {}
	async createAccount(createAccountDto: CreateAccountDto) {
		let savedAccount: AcmeAccount;
		let savedOrder: AcmeOrder;

		const queryRunner =
			this.acmeAccountRepository.manager.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			// 生成私钥
			const accountKey = await acme.forge.createPrivateKey(
				EncryptionType[createAccountDto.encryptionType]
			);

			// 创建 ACME 客户端
			const client = new acme.Client({
				directoryUrl: directoryUrl,
				accountKey: accountKey
			});

			// 创建 ACME 账户
			await client.createAccount({
				termsOfServiceAgreed: true,
				contact: [`mailto:${createAccountDto.email}`]
			});

			// 创建 ACME 订单
			const acmeOrder = await client.createOrder({
				identifiers: [{ type: 'dns', value: createAccountDto.domain }]
			});
			// 构建 AcmeAccount 实体
			const account = new AcmeAccount();
			account.email = createAccountDto.email;
			if (Buffer.isBuffer(accountKey)) {
				account.accountKey = accountKey.toString('utf-8');
			} else {
				account.accountKey = accountKey;
			}
			account.encryptionType = createAccountDto.encryptionType;
			account.domain = createAccountDto.domain;
			account.certificateAuthority = createAccountDto.certificateAuthority;

			// 保存 AcmeAccount 实体
			savedAccount = await queryRunner.manager.save(AcmeAccount, account);
			const authorizations = await client.getAuthorizations(acmeOrder);
			const identifiers = await Promise.all(
				acmeOrder.identifiers.map(async (identifier) => {
					const auth = authorizations.find(
						(auth) => auth.identifier.value === identifier.value
					);
					if (auth) {
						const dnsChallenge = auth.challenges.find(
							(challenge) => challenge.type === 'dns-01'
						);
						if (dnsChallenge) {
							const dns =
								await client.getChallengeKeyAuthorization(dnsChallenge);
							return {
								type: identifier.type,
								value: identifier.value,
								token: dnsChallenge.token,
								url: dnsChallenge.url,
								dns
							};
						}
					}
					return {
						type: identifier.type,
						value: identifier.value
					};
				})
			);
			// 构建 AcmeOrder 实体
			const order = new AcmeOrder();
			order.account = savedAccount;
			order.orderUrl = acmeOrder.url;
			order.status = acmeOrder.status;
			order.expires = new Date(acmeOrder.expires);
			order.finalizeUrl = acmeOrder.finalize;
			order.identifiers = await identifiers;

			// 保存 AcmeOrder 实体
			savedOrder = await queryRunner.manager.save(AcmeOrder, order);

			// 提交事务
			await queryRunner.commitTransaction();

			return {
				order: savedOrder,
				account: savedAccount
			};
		} catch (error) {
			// 如果出现错误，回滚事务
			await queryRunner.rollbackTransaction();
			throw new BusinessException(JSON.stringify(error.message));
		} finally {
			// 释放查询执行器
			await queryRunner.release();
		}
	}
	async getAccount() {
		return await this.acmeAccountRepository.find({
			relations: ['orders']
		});
	}

	async finalizedOrder(order: AcmeOrder, retryCount: number = 0) {
		const MAX_RETRIES = 10;
		const RETRY_DELAY = 3000;
		const challenge = {
			type: 'dns-01',
			status: 'pending',
			url: order.identifiers[0].url,
			token: order.identifiers[0].token
		};

		const authz = {
			status: order.status as acme.Authorization['status'],
			identifier: {
				type: order.identifiers[0].type,
				value: order.identifiers[0].value
			},
			authorizations: [order.orderUrl],
			challenges: [challenge],
			finalize: order.finalizeUrl,
			url: order.orderUrl
		};
		try {
			const client = new acme.Client({
				directoryUrl,
				accountKey: order.account.accountKey
			});
			await client.createAccount({
				termsOfServiceAgreed: true,
				contact: [`mailto:${order.account.email}`]
			});
			const updatedOrder = await client.getOrder(authz as any);

			let finalOrder: acme.Order;
			let privateKey: string;
			// let csr: string;
			if (updatedOrder.status === 'pending') {
				const result = await client.completeChallenge(challenge as any);
				if (result.status === 'pending') {
					if (retryCount < MAX_RETRIES) {
						await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
						return this.finalizedOrder(order, retryCount + 1);
					} else {
						console.log('如果10次以后还没好，那么基本gg了');
					}
				}
			}
			if (updatedOrder.status === 'ready') {
				const [key, csrObj] = await acme.forge.createCsr({
					commonName: order.identifiers[0].value
				});
				privateKey = key.toString();
				// csr = csrObj.toString();
				finalOrder = await client.finalizeOrder(updatedOrder, csrObj);
			}
			if (updatedOrder.status === 'valid') {
				finalOrder = updatedOrder;
			}
			const certificate = await client.getCertificate(finalOrder);
			const updateData: Partial<AcmeOrder> = {
				status: finalOrder.status
			};
			if (order.identifiers && order.identifiers.length > 0) {
				updateData.identifiers = [
					{
						...order.identifiers[0],
						privateKey: privateKey,
						certificate: certificate
					}
				];
			}
			console.log(privateKey);

			await this.acmeOrderRepository.update(order.id, updateData);
		} catch (error) {
			await this.acmeOrderRepository.update(order.id, {
				status: 'error'
			});
			console.log(error);
		}
	}
	async verifyDns01Challenge(id: number) {
		const order = await this.acmeOrderRepository.findOne({
			where: {
				id
			},
			relations: ['account']
		});
		if (!order) {
			throw new BusinessException({
				code: BUSINESS_ERROR_CODE.COMMON,
				message: '不存在的id'
			});
		}
		const domain = order.identifiers[0].value;
		const expectedRecord = order.identifiers[0].dns;
		try {
			const txtRecordName = `_acme-challenge.${domain}`;

			const records = await this.resolveTxt(txtRecordName);
			const isDnsVerified = (records || []).includes(expectedRecord);
			console.log(expectedRecord, records);

			if (isDnsVerified) {
				this.finalizedOrder(order);
				this.acmeOrderRepository.update(id, {
					status: 'loading'
				});
			}
			return {
				status: isDnsVerified ? 'success' : 'error',
				message: isDnsVerified
					? 'dns-01验证成功,正在为您准备证书'
					: 'dns验证未通过'
			};
		} catch (error) {
			throw new BusinessException(`服务端错误， ${error.message}`);
		}
	}
	async getOrderById(id: number): Promise<AcmeOrder> {
		try {
			const order = await this.acmeOrderRepository.findOne({
				where: {
					id
				},
				relations: ['account']
			});
			if (!order) {
				throw new BusinessException({
					code: BUSINESS_ERROR_CODE.COMMON,
					message: '不存在的id'
				});
			}
			return order;
		} catch (error) {
			throw new BusinessException({
				code: BUSINESS_ERROR_CODE.COMMON,
				message: '查询失败'
			});
		}
	}
	async resolveTxt(name: string): Promise<string[]> {
		const dns = new dns2({
			nameServers: ['8.8.8.8', '1.1.1.1']
		});
		const result = await dns.resolve(name, 'TXT');

		return result.answers.map((item) => item.data);
	}
	async deleteAccount(accountId: number) {
		const queryRunner =
			this.acmeAccountRepository.manager.connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const account = await queryRunner.manager.findOne(AcmeAccount, {
				where: { id: accountId },
				relations: ['orders']
			});

			if (!account) {
				throw new BusinessException(
					`ACME Account with ID ${accountId} not found`
				);
			}

			if (account.orders && account.orders.length > 0) {
				await queryRunner.manager.remove(AcmeOrder, account.orders);
			}

			await queryRunner.manager.remove(AcmeAccount, account);

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new BusinessException(
				`Failed to delete ACME Account: ${error.message}`
			);
		} finally {
			await queryRunner.release();
		}
	}
}
