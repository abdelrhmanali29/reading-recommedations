import {
	BadRequestException,
	Injectable,
	NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { UsersService } from '@App/modules/users/users.service';

@Injectable()
export class RegisterMiddleware implements NestMiddleware {
	constructor(private readonly userService: UsersService) {}
	async use(req: Request, res: Response, next: (...args: any[]) => any) {
		try {
			const user = await this.userService.findOneByUsername(req.body.username);

			if (user) {
				throw new BadRequestException('User already exist');
			}

			next();
		} catch (error) {
			throw error;
		}
	}
}
