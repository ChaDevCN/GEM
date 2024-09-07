import { SslCertificate } from "./ssl-certificate.mysql.entity"
import { RenewalSettings } from "./renewal-settings.mysql.entity"

export const CertificateProvider = [
    {
        provide: 'CERTIFICATE_REPOSITORY',
        useFactory: (AppDataSource) => AppDataSource.getRepository(SslCertificate),
        inject: ['MYSQL_DATA_SOURCE'],
    },
    {
        provide: 'RENEWAL_SETTINGS_REPOSITORY',
        useFactory: (AppDataSource) => AppDataSource.getRepository(RenewalSettings),
        inject: ['MYSQL_DATA_SOURCE'],
    }
]