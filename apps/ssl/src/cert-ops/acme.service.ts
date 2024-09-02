import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import * as  acme from "acme-client";
import { AcmeOrder } from "./acme.order.mysql.entity";
import { CreateAccountDto } from "./acme.dto";
import { AcmeAccount, EncryptionType } from "./acme.account.mysql.entity";
import { BusinessException, getEnv } from "@app/comm";
const isProd = getEnv();
@Injectable()
export class CertService {
    constructor(
        @Inject('ORDER_REPOSITORY') private acmeOrderRepository: Repository<AcmeOrder>,
        @Inject('ACCOUNT_REPOSITORY') private acmeAccountRepository: Repository<AcmeAccount>
    ) { }
    async createAccount(createAccountDto: CreateAccountDto) {
        let savedAccount: AcmeAccount;
        let savedOrder: AcmeOrder;

        const queryRunner = this.acmeAccountRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 生成私钥
            const accountKey = await acme.forge.createPrivateKey(EncryptionType[createAccountDto.encryptionType]);


            const directoryUrl = isProd ? acme.directory.letsencrypt.production : acme.directory.letsencrypt.staging;

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

            // 构建 AcmeOrder 实体
            const order = new AcmeOrder();
            order.account = savedAccount;
            order.orderUrl = acmeOrder.url;
            order.status = acmeOrder.status;
            order.expires = new Date(acmeOrder.expires);
            order.finalizeUrl = acmeOrder.finalize;
            order.identifiers = acmeOrder.identifiers;

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
            relations: ["orders"]
        });
    }
}