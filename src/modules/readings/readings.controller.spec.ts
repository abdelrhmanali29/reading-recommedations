import { Test, TestingModule } from '@nestjs/testing';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';
import { JwtGuard } from '@App/modules/auth/guard/jwt.guard';
import { RoleGuard } from '@App/modules/auth/guard/role.guard';
import { UserRole } from '@App/modules/users/enums/role.enum';
import { CreateReadingDto } from './dto/create-reading.dto';
import { SuccessClass } from '@App/shared/classes/success.class';
import { ReadingInterval } from '@App/modules/readings/entities/readings.entity';

describe('ReadingsController', () => {
	let readingsController: ReadingsController;
	let readingsService: ReadingsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ReadingsController],
			providers: [
				{
					provide: ReadingsService,
					useValue: {
						createInterval: jest.fn(),
					},
				},
			],
		})
			.overrideGuard(JwtGuard)
			.useValue({ canActivate: jest.fn().mockReturnValue(true) })
			.overrideGuard(RoleGuard)
			.useValue({
				canActivate: jest.fn().mockImplementation((context) => {
					const request = context.switchToHttp().getRequest();
					request.user = { id: 1, role: UserRole.USER };
					return true;
				}),
			})
			.compile();

		readingsController = module.get<ReadingsController>(ReadingsController);
		readingsService = module.get<ReadingsService>(ReadingsService);
	});

	it('should be defined', () => {
		expect(readingsController).toBeDefined();
	});

	describe('create', () => {
		it('should create a reading interval and return success response', async () => {
			const createReadingDto = {
				startPage: 1,
				endPage: 10,
				bookId: 1,
			} as CreateReadingDto;

			const request = {
				user: { id: 1, role: UserRole.USER },
			};

			const readingInterval = {
				id: 1,
				startPage: createReadingDto.startPage,
				endPage: createReadingDto.endPage,
				book: { id: createReadingDto.bookId },
				user: request.user,
			} as ReadingInterval;

			jest
				.spyOn(readingsService, 'createInterval')
				.mockResolvedValue(readingInterval);

			const result = await readingsController.create(createReadingDto, request);

			expect(readingsService.createInterval).toHaveBeenCalledWith({
				...createReadingDto,
				user: request.user,
			});
			expect(result).toEqual(
				new SuccessClass(
					readingInterval,
					'Reading Interval Added Successfully',
				),
			);
		});

		it('should throw an error if service fails', async () => {
			const createReadingDto = {
				startPage: 1,
				endPage: 10,
				bookId: 1,
			} as CreateReadingDto;

			const request = {
				user: { id: 1, role: UserRole.USER },
			};

			jest
				.spyOn(readingsService, 'createInterval')
				.mockRejectedValue(new Error('Service Error'));

			await expect(
				readingsController.create(createReadingDto, request),
			).rejects.toThrow('Service Error');
		});
	});
});
