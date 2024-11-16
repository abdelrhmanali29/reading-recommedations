import { UserProfile } from '@App/modules/auth/interfaces/user-profile.interface';
import { Injectable, BadRequestException } from '@nestjs/common';
import { LoginDto } from '@App/modules/auth/dto/index.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { pbkdf2Sync } from 'crypto';

import { plainToClass } from 'class-transformer';

import { RegisterDto } from '@App/modules/auth/dto/register.dto';
import { UserResponse } from '@App/modules/users/dto/user-response.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly userService: UsersService,
	) {}

	async createAccessToken(id: number): Promise<string> {
		return await this.jwtService.signAsync({ sub: id });
	}

	async login(loginDto: LoginDto): Promise<UserProfile> {
		try {
			const { password } = loginDto;

			const salt = this.configService.get('app').salt;
			const expiresIn = this.configService.get('auth').jwtExpiresIn;
			const userPasswordHash = pbkdf2Sync(
				password,
				salt,
				1000,
				64,
				'sha256',
			).toString(`hex`);

			const passwordMatch = userPasswordHash === loginDto.user.password;

			if (!passwordMatch) throw new BadRequestException('Invalid Credentials');

			return {
				user: plainToClass(UserResponse, loginDto.user),
				accessToken: await this.createAccessToken(loginDto.user.id),
				expiresIn,
			};
		} catch (error) {
			throw error;
		}
	}

	async register(registerDto: RegisterDto): Promise<void> {
		try {
			await this.userService.create(registerDto);

			return;
		} catch (error) {
			throw error;
		}
	}
}
