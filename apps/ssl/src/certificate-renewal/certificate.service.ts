import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";


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
        console.log(createCertificateDto);

        const existingCert = await this.certificateRepository.findOne({ where: { domain } });
        if (existingCert) {
            throw new BusinessException('该域名已存在')
        }


    }
}