import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { RenewalSettings } from './renewal-settings.mysql.entity';

export enum CertificateStatus {
    VALID = 'valid',
    EXPIRED = 'expired',
    REVOKED = 'revoked',
}

@Entity()
export class SslCertificate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, comment: '证书绑定的域名' })
    domain: string;

    @Column({ type: 'text', nullable: true, comment: '证书内容' })
    certContent: string;

    @Column({ type: 'text', nullable: true, comment: '私钥内容' })
    keyContent: string;

    @Column({ type: 'datetime', comment: '证书的过期日期' })
    expirationDate: Date;

    @Column({
        type: 'enum',
        enum: CertificateStatus,
        default: CertificateStatus.VALID,
        comment: '证书的当前状态',
    })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


    @OneToOne(() => RenewalSettings, (settings) => settings.certificate)
    renewalSettings: RenewalSettings;
}
