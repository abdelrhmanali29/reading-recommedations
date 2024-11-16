import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

import { UserRole } from './enums/role.enum';

jest.mock('crypto', () => ({
	...jest.requireActual('crypto'),
	pbkdf2Sync: jest.fn(() => Buffer.from('6861736865645f70617373776f7264')),
}));

describe('UsersService', () => {
	let usersService: UsersService;
	let userRepository: jest.Mocked<Repository<User>>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						save: jest.fn(),
						findOne: jest.fn(),
					},
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((key: string) => {
							if (key === 'app') {
								return { salt: 'test_salt' };
							}
						}),
					},
				},
			],
		}).compile();

		usersService = module.get<UsersService>(UsersService);
		userRepository = module.get(getRepositoryToken(User));
	});

	it('should be defined', () => {
		expect(usersService).toBeDefined();
	});

	describe('create', () => {
		it('should hash the password and create a user', async () => {
			const createUserDto: CreateUserDto = {
				username: 'testuser',
				password: 'plainpassword',
				role: UserRole.USER,
			};
			const savedUser = {
				id: 1,
				username: 'testuser',
				password: '6861736865645f70617373776f7264',
				role: UserRole.USER,
			} as User;

			userRepository.save.mockResolvedValue(savedUser);

			const result = await usersService.create(createUserDto);

			expect(result).toEqual(savedUser);
		});
	});
});
