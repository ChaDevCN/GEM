import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import throat from 'throat';

import { CertificateMonitoring, IPType, CertificateStatus } from './monitor.mysql.entity';
import * as tls from 'tls';
import * as dns from 'dns';
import { BUSINESS_ERROR_CODE, BusinessException } from '@app/comm';
import { CreateCertificateMonitoringDto } from './monitor.dto';
// const pLimit = require('p-limit')
@Injectable()
export class CertificateMonitoringService {
    constructor(
        @Inject('MONITOR_REPOSITORY')
        private certificateRepo: Repository<CertificateMonitoring>,
    ) { }

    async createFromDomain(createDto: CreateCertificateMonitoringDto, user: any): Promise<CertificateMonitoring> {

        const certInfo = await this.getCertificateInfo(createDto.domain);
        const ipInfo = await this.getIpInfo(createDto.domain);


        const newCertificate = new CertificateMonitoring();
        newCertificate.hostname = createDto.domain;
        newCertificate.notes = createDto.notes
        newCertificate.port = 443;
        newCertificate.ipType = ipInfo.family === 4 ? IPType.IPv4 : IPType.IPv6;
        newCertificate.ipAddress = ipInfo.address;
        newCertificate.status = this.calculateStatus(certInfo.validTo);
        newCertificate.validFrom = certInfo.validFrom;
        newCertificate.validTo = certInfo.validTo;
        newCertificate.issuer = certInfo.issuer;
        newCertificate.subject = certInfo.subject;
        newCertificate.serialNumber = certInfo.serialNumber;
        newCertificate.keyStrength = certInfo.keyStrength;
        newCertificate.san = certInfo.san;
        newCertificate.lastChecked = new Date();
        newCertificate.checkInterval = 86400;
        newCertificate.alertThreshold = 30;
        newCertificate.createdBy = user.userId;
        newCertificate.creator = user;
        return this.certificateRepo.save(newCertificate);
    }
    async update(id: number) {
        console.log(id);

        const existingCertificate = await this.certificateRepo.findOne({ where: { id } });
        console.log(existingCertificate);

        if (!existingCertificate) {
            throw (new BusinessException({
                message: '非法信息,更新失败',
                code: BUSINESS_ERROR_CODE.COMMON
            }))
        }
        const certInfo = await this.getCertificateInfo(existingCertificate.hostname);
        const ipInfo = await this.getIpInfo(existingCertificate.hostname);

        existingCertificate.ipType = ipInfo.family === 4 ? IPType.IPv4 : IPType.IPv6;
        existingCertificate.ipAddress = ipInfo.address;
        existingCertificate.validFrom = certInfo.validFrom;
        existingCertificate.validTo = certInfo.validTo;
        existingCertificate.issuer = certInfo.issuer;
        existingCertificate.lastChecked = new Date();
        existingCertificate.status = this.calculateStatus(certInfo.validTo);
        return this.certificateRepo.save(existingCertificate);
    }
    @Cron(CronExpression.EVERY_DAY_AT_2AM, {
        name: 'task',
        timeZone: 'Asia/shanghai'
    })
    async updateAllCertificates() {
        const certificates = await this.getAll();
        const concurrency = 10; // 设置最大并发数为10
        const limit = throat(concurrency);

        for (let i = 0; i < certificates.length; i += concurrency) {
            const batch = certificates.slice(i, i + concurrency);
            const updatePromises = batch.map(certificate =>
                limit(() => this.update(certificate.id))
            );
            await Promise.all(updatePromises);
            console.log(`Processed batch ${i / concurrency + 1}`);
        }

        console.log('All certificates have been processed.');
    }


    async getAll(): Promise<CertificateMonitoring[]> {
        return this.certificateRepo.find();
    }

    async findOne(id: number): Promise<CertificateMonitoring> {
        const certificate = await this.certificateRepo.findOne({ where: { id } });
        if (!certificate) {
            throw new NotFoundException(`Certificate monitoring record with ID ${id} not found`);
        }
        return certificate;
    }

    async updateCheckInterval(id: number, newInterval: number): Promise<CertificateMonitoring> {
        const certificate = await this.findOne(id);
        certificate.checkInterval = newInterval;
        return this.certificateRepo.save(certificate);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.certificateRepo.delete(id);
        return result.affected > 0;
    }

    private async getCertificateInfo(domain: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const socket = tls.connect({
                host: domain,
                port: 443,
                servername: domain,
            }, () => {
                const cert = socket.getPeerCertificate(true);
                socket.destroy();
                resolve({
                    validFrom: new Date(cert.valid_from),
                    validTo: new Date(cert.valid_to),
                    issuer: cert.issuer.CN || cert.issuer.O,
                    subject: cert.subject.CN,
                    serialNumber: cert.serialNumber,
                    keyStrength: (cert.pubkey as any)?.bits || 0,
                    san: cert.subjectaltname,
                });
            });
            socket.on('error', reject);
        });
    }

    private async getIpInfo(domain: string): Promise<dns.LookupAddress> {
        return new Promise((resolve, reject) => {
            dns.lookup(domain, (err, address, family) => {
                if (err) reject(err);
                else resolve({ address, family });
            });
        });
    }

    private calculateStatus(validTo: Date): CertificateStatus {
        const now = new Date();
        const daysUntilExpiry = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) {
            return CertificateStatus.EXPIRED;
        } else if (daysUntilExpiry <= 30) {
            return CertificateStatus.EXPIRING_SOON;
        } else {
            return CertificateStatus.VALID;
        }
    }
}