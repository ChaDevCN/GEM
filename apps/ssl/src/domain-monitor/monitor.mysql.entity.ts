import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { User } from 'apps/userServer/src/user/user.mysql.entity';

export enum IPType {
    IPv4 = 'IPv4',
    IPv6 = 'IPv6'
}

export enum CertificateStatus {
    VALID = 'valid',
    EXPIRED = 'expired',
    EXPIRING_SOON = 'expiring_soon',
    INVALID = 'invalid',
    UNKNOWN = 'unknown'
}

@Entity('certificate_monitoring')
export class CertificateMonitoring {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    hostname: string;

    @Column()
    port: number;

    @Column({
        type: 'enum',
        enum: IPType,
        default: IPType.IPv4
    })
    ipType: IPType;

    @Column()
    ipAddress: string;

    @Column({
        type: 'enum',
        enum: CertificateStatus,
        default: CertificateStatus.UNKNOWN
    })
    @Index()
    status: CertificateStatus;

    @Column()
    validFrom: Date;

    @Column()
    @Index()
    validTo: Date;

    @Column({
        type: 'int'
    })
    daysUntilExpiry: number;

    @Column()
    issuer: string;

    @Column()
    subject: string;

    @Column()
    serialNumber: string;

    @Column({ nullable: true })
    signatureAlgorithm: string;

    @Column({ nullable: true })
    keyStrength: number;

    @Column({ type: 'text', nullable: true })
    san: string;

    @Column()
    lastChecked: Date;

    @Column({ default: 86400 })
    checkInterval: number;

    @Column({ default: 30 })
    alertThreshold: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'createdBy' })
    creator: User;

    @Column()
    createdBy: number;

    @BeforeInsert()
    @BeforeUpdate()
    calculateDaysUntilExpiry() {
        const now = new Date();
        this.daysUntilExpiry = Math.ceil((this.validTo.getTime() - now.getTime()) / (1000 * 3600 * 24));
    }
}