import { Module } from "@nestjs/common";
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { DatabaseModule, getConfig, TransformInterceptor } from "@app/comm"
import { MicroservicesModule } from "./microservices/microservices.module";
import { AuthModule } from "./auth/auth.module";
import { PermissionGuard } from "./auth/guards/permission.guard";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { MonitorModule } from "./monitor/monitor.module"

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
        MicroservicesModule,
        AuthModule,
        DatabaseModule,
        MonitorModule
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
        {
            provide: APP_GUARD,
            useClass: PermissionGuard,
        },
    ]
})
export class SSLModule { }