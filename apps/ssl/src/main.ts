import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter, HttpExceptionFilter } from '@app/comm';

import { generateDocument } from './doc';
import { SSLModule } from './ssl.module';

async function bootstrap() {
	const app = await NestFactory.create(SSLModule);

	app.enableVersioning({
		type: VersioningType.URI
	});

	app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

	app.setGlobalPrefix('api');

	app.use(cookieParser());

	generateDocument(app);

	await app.startAllMicroservices();

	
	await app.listen(40002);
}
bootstrap();
