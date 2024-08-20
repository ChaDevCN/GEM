import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import {
  TransformInterceptor,
  AllExceptionsFilter,
  HttpExceptionFilter,
} from '@app/comm';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { generateDocument } from './doc';
import { UserCenterModule } from './user-center.module';

async function bootstrap() {
  const app = await NestFactory.create(UserCenterModule);

  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  app.setGlobalPrefix('api');
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.TCP,
      options: {
        port: 4100,
        host: '0.0.0.0',
      },
    },
    {
      inheritAppConfig: true, // 继承 app 配置
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new TransformInterceptor());

  generateDocument(app);

  await app.startAllMicroservices();

  await app.listen(40001);
}
bootstrap();
