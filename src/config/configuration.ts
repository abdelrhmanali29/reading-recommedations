export interface Configuration {
	app: AppSetting;
	postgresDatabase: PostgresDatabase;
	auth: Auth;
}

export interface AppSetting {
	env: string;
	port: number;
	salt: string;
}

export interface Auth {
	jwtSecret: string;
	jwtExpiresIn: number;
}

export interface PostgresDatabase {
	host: string;
	name?: string;
	database: string;
	username: string;
	password: string;
	ssl: boolean | PostgresDatabaseSSL;
}

export interface PostgresDatabaseSSL {
	rejectUnauthorized: boolean;
	ca: string;
	cert: string;
	key: string;
}

export const configuration = (): Configuration => {
	const defaultConfiguration: Configuration = {
		app: {
			env: process.env.NODE_ENV,
			port: parseInt(process.env.SERVER_PORT as string, 10) || 3000,
			salt: process.env.SALT,
		},
		postgresDatabase: {
			host: process.env.POSTGRES_HOST as string,
			database: process.env.POSTGRES_DATABASE as string,
			username: process.env.POSTGRES_USERNAME as string,
			password: process.env.POSTGRES_PASSWORD as string,
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
		},
		auth: {
			jwtSecret: process.env.JWT_ACCESS_SECRET,
			jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN),
		},
	};
	return defaultConfiguration;
};
