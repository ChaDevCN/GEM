import { Module, forwardRef } from '@nestjs/common';

import { DatabaseModule } from '@app/comm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [forwardRef(() => DatabaseModule)],
  exports: [UserService],
})
export class UserModule {}
