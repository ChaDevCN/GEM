import letsEncrypt from '@/assets/image/lets-encrypt.png';
export const TOKEN_KEY = 'access_token';

export const certificateConfig = {
	supportedVendors: [
		{
			name: "Let's Encrypt",
			logo: letsEncrypt,
			url: 'https://letsencrypt.org/',
			description: '免费的自动化 SSL 证书服务'
		}
	],
	supportedEncryptionTypes: ['ECC', 'RSA']
};
