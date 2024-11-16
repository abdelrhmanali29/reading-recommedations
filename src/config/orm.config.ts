import { DataSource } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: parseInt(<string>process.env.POSTGRES_PORT),
	username: process.env.POSTGRES_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
	entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
	synchronize: false,
	autoLoadEntities: true,
	ssl:
		process.env.SSL && process.env.SSL == 'true'
			? {
					rejectUnauthorized:
						process.env.REJECT_UNAUTHORIZED &&
						process.env.REJECT_UNAUTHORIZED == 'true',
					ca: process.env.CA,
					cert: process.env.CERT,
					key: process.env.KEY,
				}
			: false,
	logging: process.env.NODE_ENV === 'development',
	migrationsTableName: 'migrations',
	migrations: ['dist/migrations/*.js'],
};

export const OrmConfig = {
	...typeOrmModuleOptions,
};

export const dataSource = new DataSource({
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: parseInt(<string>process.env.POSTGRES_PORT),
	username: process.env.POSTGRES_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
	entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
	synchronize: false,
	ssl:
		process.env.SSL && process.env.SSL == 'true'
			? {
					rejectUnauthorized:
						process.env.REJECT_UNAUTHORIZED &&
						process.env.REJECT_UNAUTHORIZED == 'true',
					ca: process.env.CA,
					cert: process.env.CERT,
					key: process.env.KEY,
				}
			: false,
	logging: process.env.NODE_ENV === 'development',
	migrationsTableName: 'migrations',
	migrations: ['./migrations/*.ts'],
});

export default OrmConfig;
