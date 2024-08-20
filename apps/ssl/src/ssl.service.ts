import { Injectable } from '@nestjs/common';

@Injectable()
export class SslService {
  getHello(): string {
    return 'Hello World!';
  }
}
