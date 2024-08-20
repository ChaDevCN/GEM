import { Test, TestingModule } from '@nestjs/testing';
import { SslController } from './ssl.controller';
import { SslService } from './ssl.service';

describe('SslController', () => {
  let sslController: SslController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SslController],
      providers: [SslService],
    }).compile();

    sslController = app.get<SslController>(SslController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(sslController.getHello()).toBe('Hello World!');
    });
  });
});
