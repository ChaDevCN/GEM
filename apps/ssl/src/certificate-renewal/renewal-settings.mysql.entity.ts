import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { SslCertificate } from './ssl-certificate.mysql.entity';

@Entity()
export class RenewalSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => SslCertificate, { onDelete: 'CASCADE' })
  @JoinColumn()
  certificate: SslCertificate;

  @Column({ default: 30, comment: '提前多少天续费' })
  renewalDaysBeforeExpiry: number;

  @Column({ default: true, comment: '是否发送续费通知' })
  sendNotification: boolean;

  @Column({ default: true, comment: '是否自动续费' })
  autoRenew: boolean;
}
