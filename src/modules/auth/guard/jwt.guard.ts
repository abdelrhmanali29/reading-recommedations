import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';
import { UsersService } from '@App/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@App/modules/users/entities/user.entity';

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UsersService,
		private readonly configService: ConfigService,
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = this.getRequest<IncomingMessage & { user?: User }>(context);

		try {
			const token = this.getToken(request);

			const decodedToken = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get('auth').jwtSecret,
			});

			const { sub: userId } = decodedToken;

			const foundUser = await this.userService.findOneById(+userId);

			request['user'] = foundUser;
			return true;
		} catch (e) {
			throw new UnauthorizedException();
		}
	}
	protected getRequest<T>(context: ExecutionContext): T {
		return context.switchToHttp().getRequest();
	}
	protected getToken(request: {
		headers: Record<string, string | string[]>;
	}): string {
		const authorization = request.headers['authorization'];

		if (!authorization || Array.isArray(authorization)) {
			throw new Error('Invalid Authorization Header');
		}
		const [, token] = authorization.split(' ');
		return token;
	}
}
