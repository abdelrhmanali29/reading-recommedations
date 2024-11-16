import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtGuard } from '@App/modules/auth/guard/jwt.guard';
import { RoleGuard } from '@App/modules/auth/guard/role.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SuccessClass } from '@App/shared/classes/success.class';
import { UserRole } from './enums/role.enum';
import { NotFoundException } from '@nestjs/common';
import { User } from '@App/modules/users/entities/user.entity';

describe('UsersController', () => {
	let usersController: UsersController;
	let usersService: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{
					provide: UsersService,
					useValue: {
						findOneById: jest.fn(),
					},
				},
			],
		})
			.overrideGuard(JwtGuard)
			.useValue({ canActivate: jest.fn(() => true) })
			.overrideGuard(RoleGuard)
			.useValue({
				canActivate: jest.fn((context) => {
					const request = context.switchToHttp().getRequest();
					request.user = { id: 1, role: UserRole.ADMIN };
					return true;
				}),
			})
			.overrideGuard(ThrottlerGuard)
			.useValue({ canActivate: jest.fn(() => true) })
			.compile();

		usersController = module.get<UsersController>(UsersController);
		usersService = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(usersController).toBeDefined();
	});

	describe('findOne', () => {
		it('should return a user when found', async () => {
			const user = { id: 1, username: 'testuser', role: UserRole.USER } as User;
			jest.spyOn(usersService, 'findOneById').mockResolvedValue(user);

			const result = await usersController.findOne('1');

			expect(usersService.findOneById).toHaveBeenCalledWith(1);
			expect(result).toEqual(new SuccessClass({ user }));
		});

		it('should throw NotFoundException if the user is not found', async () => {
			jest
				.spyOn(usersService, 'findOneById')
				.mockRejectedValue(new NotFoundException('User not found'));

			await expect(usersController.findOne('999')).rejects.toThrow(
				new NotFoundException('User not found'),
			);

			expect(usersService.findOneById).toHaveBeenCalledWith(999);
		});
	});
});
