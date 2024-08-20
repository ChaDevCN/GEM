import { Controller, Get } from '@nestjs/common';
import { SslService } from './ssl.service';

@Controller()
export class SslController {
  constructor(private readonly sslService: SslService) {}

  @Get()
  getHello(): string {
    return this.sslService.getHello();
  }
}
