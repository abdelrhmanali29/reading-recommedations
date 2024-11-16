/* eslint-disable @typescript-eslint/no-var-requires */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserResponse } from '@App/modules/users/dto/user-response.dto';
import { UserRole } from '@App/modules/users/enums/role.enum';
import { LoginDto } from '@App/modules/auth/dto/login.dto';

jest.mock('crypto', () => {
	const actualCrypto = jest.requireActual('crypto');
	return {
		...actualCrypto,
		pbkdf2Sync: jest.fn(),
	};
});

describe('AuthService', () => {
	let authService: AuthService;
	let jwtService: JwtService;
	let usersService: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn().mockImplementation((key: string) => {
							if (key === 'app') return { salt: 'test_salt' };
							if (key === 'auth') return { jwtExpiresIn: 3600 };
						}),
					},
				},
				{
					provide: JwtService,
					useValue: {
						signAsync: jest.fn().mockResolvedValue('test_token'),
					},
				},
				{
					provide: UsersService,
					useValue: {
						create: jest.fn(),
					},
				},
			],
		}).compile();

		authService = module.get<AuthService>(AuthService);
		jwtService = module.get<JwtService>(JwtService);
		usersService = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(authService).toBeDefined();
	});

	describe('createAccessToken', () => {
		it('should return a JWT token', async () => {
			const token = await authService.createAccessToken(1);
			expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 1 });
			expect(token).toBe('test_token');
		});
	});

	describe('login', () => {
		it('should return user profile with access token on valid credentials', async () => {
			const loginDto = {
				password: 'test_password',
				username: 'test',
				user: {
					id: 1,
					password: 'test_hashed_password',
				},
			} as LoginDto;

			const { pbkdf2Sync } = require('crypto');
			pbkdf2Sync.mockReturnValue('test_hashed_password');

			const result = await authService.login(loginDto);

			expect(result).toEqual({
				user: plainToClass(UserResponse, loginDto.user),
				accessToken: 'test_token',
				expiresIn: 3600,
			});
		});

		it('should throw BadRequestException for invalid credentials', async () => {
			const loginDto = {
				password: 'test_password',
				username: 'test',
				user: {
					id: 1,
					password: 'different_hashed_password',
				},
			} as LoginDto;

			const { pbkdf2Sync } = require('crypto');
			pbkdf2Sync.mockReturnValue(Buffer.from('incorrect_hashed_password'));

			await expect(authService.login(loginDto)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe('register', () => {
		it('should call UsersService.create with correct data', async () => {
			const registerDto = {
				username: 'test',
				password: 'test_password',
				role: 'ADMIN' as UserRole,
			};

			await authService.register(registerDto);

			expect(usersService.create).toHaveBeenCalledWith(registerDto);
		});
	});
});
