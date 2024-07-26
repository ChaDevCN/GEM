import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';
import { AppModule } from './app.module';
import { Response } from './common/response';
import { HttpFilter } from './common/error';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // swagger
  const options = new DocumentBuilder()
    .setTitle('PetMed')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/image',
  });
  SwaggerModule.setup('/api-docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new Response());
  app.useGlobalFilters(new HttpFilter());
  await app.listen(8082);
}
bootstrap();
