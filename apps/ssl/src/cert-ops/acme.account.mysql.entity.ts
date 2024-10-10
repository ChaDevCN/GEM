import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AcmeOrder } from './acme.order.mysql.entity';

export enum EncryptionType {
	RSA = 'RSA',
	ECDSA_P256 = 'P-256',
	ECDSA_P384 = 'P-384',
	ECDSA_P521 = 'P-521'
}

export enum CertificateAuthority {
	LetsEncrypt = 'LetsEncrypt',
	BuyPass = 'BuyPass',
	ZeroSSL = 'ZeroSSL'
}
@Entity()
export class AcmeAccount {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column('longtext')
	accountKey: string;

	@Column({
		type: 'enum',
		enum: EncryptionType,
		default: EncryptionType.RSA
	})
	encryptionType: EncryptionType;

	@Column()
	domain: string;

	@Column({
		type: 'enum',
		enum: CertificateAuthority,
		default: CertificateAuthority.LetsEncrypt
	})
	certificateAuthority: CertificateAuthority;

	@OneToMany(() => AcmeOrder, (order) => order.account)
	orders: AcmeOrder[];
}
