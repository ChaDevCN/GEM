import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@app/comm';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule { }
