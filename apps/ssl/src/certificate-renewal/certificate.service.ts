import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import acme from 'acme-client';

import fs from 'fs'
import path from 'path'

import { BusinessException, getEnv, isFileExisted, NGINX_PATH, SSL_PATH, ACME_PATH } from "@app/comm";
import { CreateCertificateDto } from "./certificate.dto";

import { SslCertificate } from "./ssl-certificate.mysql.entity";
import { RenewalSettings } from "./renewal-settings.mysql.entity";

const isProd = getEnv()

@Injectable()
export class CertificateService {
    constructor(
        @Inject('CERTIFICATE_REPOSITORY')
        private certificateRepository: Repository<SslCertificate>,
        @Inject('RENEWAL_SETTINGS_REPOSITORY')
        private renewalSettingsRepository: Repository<RenewalSettings>
    ) { }
    async createCertificate(createCertificateDto: CreateCertificateDto) {
        const { domain, email, autoRenew, renewalDaysBeforeExpiry } = createCertificateDto;

        const existingCert = await this.certificateRepository.findOne({ where: { domain } });
        if (existingCert) {
            throw new BusinessException('该域名已存在')
        }

        const ROOT_ACME_PATH = path.join(NGINX_PATH, ACME_PATH)

        // const ROOT_


    }
}