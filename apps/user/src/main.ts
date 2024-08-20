declare const module: any;
import { NestFactory } from '@nestjs/core';
import { VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { TransformInterceptor ,AllExceptionsFilter,HttpExceptionFilter} from '@app/comm';

import { generateDocument } from './doc';
import { UserCenterModule } from './user-center.module';

async function bootstrap() {
  const app = await NestFactory.create(UserCenterModule);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [VERSION_NEUTRAL, '1', '2'],
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  generateDocument(app);
  await app.listen(40001);
}
bootstrap();
