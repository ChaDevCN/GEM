import { Module } from '@nestjs/common';
import { SslController } from './ssl.controller';
import { SslService } from './ssl.service';

@Module({
  imports: [],
  controllers: [SslController],
  providers: [SslService],
})
export class SslModule {}
