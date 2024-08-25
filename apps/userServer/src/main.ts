import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter, HttpExceptionFilter } from '@app/comm';

import { generateDocument } from './doc';
import { UserCenterModule } from './user-center.module';

async function bootstrap() {
  const app = await NestFactory.create(UserCenterModule);

  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe());

  generateDocument(app);

  // await app.startAllMicroservices();

  await app.listen(40001);
}
bootstrap();
