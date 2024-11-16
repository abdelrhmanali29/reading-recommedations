import { plainToInstance } from 'class-transformer';
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsString,
	validateSync,
} from 'class-validator';

enum Environment {
	DEVELOPMENT = 'development',
	TEST = 'test',
	STAGING = 'staging',
	PRODUCTION = 'production',
}

class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment;

	@IsNumber()
	SERVER_PORT: number;

	@IsNotEmpty()
	@IsString()
	JWT_ACCESS_SECRET: string;

	@IsNotEmpty()
	@IsNumber()
	JWT_EXPIRES_IN: number;

	@IsNotEmpty()
	@IsString()
	SALT: string;
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	});
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}
