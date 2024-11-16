import {
	Module,
	MiddlewareConsumer,
	RequestMethod,
	forwardRef,
} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '@App/modules/auth/auth.service';
import { User } from '@App/modules/users/entities/user.entity';
import { AuthController } from '@App/modules/auth/auth.controller';
import { RegisterMiddleware } from '@App/modules/auth/middleware/register.middleware';
import { LoginMiddleware } from '@App/modules/auth/middleware/login.middleware';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@App/modules/users/users.module';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: async (config: ConfigService) => ({
				secret: config.get('auth').jwtSecret,
				signOptions: { expiresIn: `${config.get('auth').jwtExpiresIn}s` },
			}),
			inject: [ConfigService],
		}),
		TypeOrmModule.forFeature([User]),
		HttpModule,
		JwtModule,
		forwardRef(() => UsersModule),
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(RegisterMiddleware)
			.forRoutes({ path: 'v1/auth/register', method: RequestMethod.POST });

		consumer
			.apply(LoginMiddleware)
			.forRoutes({ path: 'v1/auth/login', method: RequestMethod.POST });
	}
}
