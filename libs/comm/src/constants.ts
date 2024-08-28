import { SetMetadata } from '@nestjs/common';

export const IS_STREAM_KEY = 'isStream';

export const IsStream = () => SetMetadata(IS_STREAM_KEY, true);

export const jwtConstants = {
  secret: 'yx-yyds',
  expiresIn: '15s',
  ignoreExpiration: true,
};

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
