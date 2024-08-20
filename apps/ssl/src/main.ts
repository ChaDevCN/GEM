declare const module: any;
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { TransformInterceptor } from '@app/comm/interceptors/transform.interceptor';
import { AllExceptionsFilter } from '@app/comm/exceptions/base.exception.filter';
import { HttpExceptionFilter } from '@app/comm/exceptions/http.exception.filter';
import { generateDocument } from './doc';
import { SslModule } from './ssl.module';

async function bootstrap() {
  const app = await NestFactory.create(SslModule);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  generateDocument(app);
  await app.listen(40002);
}
bootstrap();
