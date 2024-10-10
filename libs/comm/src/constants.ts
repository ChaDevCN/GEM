import { SetMetadata } from '@nestjs/common';

export const IS_STREAM_KEY = 'isStream';

export const IsStream = () => SetMetadata(IS_STREAM_KEY, true);

export const jwtConstants = {
	secret: 'yx-yyds',
	expiresIn: '15s',
	ignoreExpiration: true
};

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const NGINX_PATH = `D:\\tools\\nginx-1.26.1`;

export const ACME_PATH = `acme-challenge`;

export const SSL_PATH = `ssl`;
