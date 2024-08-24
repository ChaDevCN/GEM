import { Module, forwardRef } from '@nestjs/common';

import { DatabaseModule } from '@app/comm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProviders } from './user.providers';
@Module({
  controllers: [UserController],
  providers: [...UserProviders, UserService],
  imports: [forwardRef(() => DatabaseModule)],
  exports: [UserService],
})
export class UserModule {}
