import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '@App/modules/auth/auth.service';
import { RegisterDto } from '@App/modules/auth/dto/register.dto';
import { LoginDto } from '@App/modules/auth/dto/index.dto';
import { SuccessClass } from '@App/shared/classes/success.class';
import { UserRole } from '@App/modules/users/enums/role.enum';
import { UserProfile } from '@App/modules/auth/interfaces/user-profile.interface';

describe('AuthController', () => {
	let authController: AuthController;
	let authService: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: {
						register: jest.fn(),
						login: jest.fn(),
					},
				},
			],
		}).compile();

		authController = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(authController).toBeDefined();
	});

	describe('register', () => {
		it('should call AuthService.register with correct data', async () => {
			const registerDto: RegisterDto = {
				username: 'testUser',
				password: 'testPassword',
				role: 'USER' as UserRole,
			};

			const result = await authController.register(registerDto);

			expect(authService.register).toHaveBeenCalledWith(registerDto);
			expect(result).toEqual(
				new SuccessClass({}, 'Registration  Completed Successfully'),
			);
		});

		it('should throw an error if AuthService.register fails', async () => {
			const registerDto: RegisterDto = {
				username: 'testUser',
				password: 'testPassword',
				role: 'USER' as UserRole,
			};

			jest
				.spyOn(authService, 'register')
				.mockRejectedValue(new Error('Registration Failed'));

			await expect(authController.register(registerDto)).rejects.toThrow(
				'Registration Failed',
			);
		});
	});

	describe('login', () => {
		it('should call AuthService.login with correct data and return SuccessClass', async () => {
			const loginDto = {
				username: 'testUser',
				password: 'testPassword',
			} as LoginDto;

			const mockToken = {
				accessToken: 'test_token',
				expiresIn: 3600,
			} as UserProfile;

			jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

			const result = await authController.login(loginDto);

			expect(authService.login).toHaveBeenCalledWith(loginDto);
			expect(result).toEqual(new SuccessClass(mockToken));
		});

		it('should throw an error if AuthService.login fails', async () => {
			const loginDto = {
				username: 'testUser',
				password: 'testPassword',
			} as LoginDto;

			jest
				.spyOn(authService, 'login')
				.mockRejectedValue(new Error('Login Failed'));

			await expect(authController.login(loginDto)).rejects.toThrow(
				'Login Failed',
			);
		});
	});
});
