export interface CertificateMonitoring {
	id: number;
	hostname: string;
	port: number;
	ipType: 'IPv4' | 'IPv6';
	ipAddress: string;
	status: 'valid' | 'expired' | 'expiring_soon' | 'invalid' | 'unknown';
	validFrom: string;
	validTo: string;
	daysUntilExpiry: number;
	issuer: string;
	subject: string;
	serialNumber: string;
	keyStrength: number;
	san: string;
	lastChecked: string;
}
export type AddCertificateMonitor = {
	domain: string;
	notes?: string;
};
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
export type Accout = {
	domain: string;
	email: string;
	encryptionType: EncryptionType;
	certificateAuthority: CertificateAuthority;
};
export interface Order {
	id: number;
	orderUrl: string;
	status: string;
	expires: string;
	finalizeUrl: string;
	identifiers: Identifier[];
}

export interface Identifier {
	type: string;
	value: string;
	token: string;
	url: string;
	dns: string;
	privateKey: string;
	certificate: string;
}

export type AccoutItem = {
	id: number;
	email: string;
	accountKey: string;
	encryptionType: string;
	domain: string;
	certificateAuthority: string;
	orders: Order[];
};
export type AccoutList = AccoutItem[];

export type CertificateRenewal = {
	email: string;
	domain: string;
	renewalDaysBeforeExpiry: number;
};
