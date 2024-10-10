import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter, HttpExceptionFilter, getConfig } from '@app/comm';

import { generateDocument } from './doc';
import { UserCenterModule } from './user-center.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const { USER_MICROSERVICES } = getConfig();

async function bootstrap() {
	const app = await NestFactory.create(UserCenterModule);

	app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

	app.setGlobalPrefix('api');
	app.connectMicroservice<MicroserviceOptions>(
		{
			transport: Transport.TCP,
			options: USER_MICROSERVICES
		},
		{
			inheritAppConfig: true
		}
	);
	app.enableVersioning({
		type: VersioningType.URI
	});

	app.useGlobalPipes(new ValidationPipe());

	generateDocument(app);

	app.use(cookieParser());

	await app.startAllMicroservices();

	await app.listen(40001);
}
bootstrap();
