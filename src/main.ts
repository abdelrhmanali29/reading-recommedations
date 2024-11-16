import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '@App/app.module';
import { HttpExceptionFilter } from '@App/shared/filters/http-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');

	app.enableVersioning({
		type: VersioningType.URI,
	});

	app.use(helmet());
	app.enableCors();
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);
	app.useGlobalFilters(new HttpExceptionFilter());

	const configService = app.get(ConfigService);

	const port = configService.get('app.port');
	await app.listen(port);
}
bootstrap();
