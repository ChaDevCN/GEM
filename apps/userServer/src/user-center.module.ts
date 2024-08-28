/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-24 15:05:47
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-24 22:31:25
 * @FilePath: \GEM\apps\user\src\user-center.module.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */
import { Module } from '@nestjs/common';

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';
import { TransformInterceptor } from '@app/common';
import { getConfig } from '@app/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class UserCenterModule { }
