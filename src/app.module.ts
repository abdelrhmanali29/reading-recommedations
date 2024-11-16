import { typeOrmModuleOptions } from '@App/config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger, Module } from '@nestjs/common';
import { AppController } from '@App/app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { validate } from '@App/config/env.validation';
import { AppService } from '@App/app.service';
import { configuration } from '@App/config/configuration';
import { AuthModule } from '@App/modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '@App/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { BookModule } from '@App/modules/books/books.module';
import { ReadingModule } from '@App/modules/readings/readings.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
			validate,
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60,
				limit: 10,
			},
		]),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],

			useFactory: () => ({
				...typeOrmModuleOptions,
			}),
		}),
		AuthModule,
		UsersModule,
		JwtModule,
		BookModule,
		ReadingModule,
	],
	controllers: [AppController],
	providers: [AppService, Logger],
})
export class AppModule {}
