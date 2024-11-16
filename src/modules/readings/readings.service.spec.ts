import { Test, TestingModule } from '@nestjs/testing';
import { ReadingsService } from './readings.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReadingInterval } from './entities/readings.entity';
import { Book } from '../books/entities/books.entity';
import { CreateReadingDto } from './dto/create-reading.dto';
import { BadRequestException } from '@nestjs/common';

describe('ReadingsService', () => {
	let readingsService: ReadingsService;
	let readingIntervalRepository: jest.Mocked<Repository<ReadingInterval>>;
	let bookRepository: jest.Mocked<Repository<Book>>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReadingsService,
				{
					provide: getRepositoryToken(ReadingInterval),
					useValue: {
						create: jest.fn(),
						save: jest.fn(),
					},
				},
				{
					provide: getRepositoryToken(Book),
					useValue: {
						findOne: jest.fn(),
					},
				},
			],
		}).compile();

		readingsService = module.get<ReadingsService>(ReadingsService);
		readingIntervalRepository = module.get(
			getRepositoryToken(ReadingInterval),
		) as jest.Mocked<Repository<ReadingInterval>>;
		bookRepository = module.get(getRepositoryToken(Book)) as jest.Mocked<
			Repository<Book>
		>;
	});

	it('should be defined', () => {
		expect(readingsService).toBeDefined();
	});

	describe('createInterval', () => {
		it('should create a reading interval successfully', async () => {
			const book = { id: 1, numOfPages: 100 } as Book;
			const createReadingDto: CreateReadingDto = {
				startPage: 10,
				endPage: 20,
				bookId: 1,
				user: { id: 1 } as any,
			};

			const createdInterval = {
				id: 1,
				startPage: 10,
				endPage: 20,
				book: book,
				user: createReadingDto.user,
			} as ReadingInterval;

			bookRepository.findOne.mockResolvedValue(book);
			readingIntervalRepository.create.mockReturnValue(createdInterval);
			readingIntervalRepository.save.mockResolvedValue(createdInterval);

			const result = await readingsService.createInterval(createReadingDto);

			expect(bookRepository.findOne).toHaveBeenCalledWith({
				where: { id: createReadingDto.bookId },
			});
			expect(readingIntervalRepository.create).toHaveBeenCalledWith(
				createReadingDto,
			);
			expect(readingIntervalRepository.save).toHaveBeenCalledWith(
				createdInterval,
			);
			expect(result).toEqual(createdInterval);
		});

		it('should throw an error if endPage exceeds book pages', async () => {
			const book = { id: 1, numOfPages: 100 } as Book;
			const createReadingDto: CreateReadingDto = {
				startPage: 10,
				endPage: 120,
				bookId: 1,
				user: { id: 1 } as any,
			};

			bookRepository.findOne.mockResolvedValue(book);

			await expect(
				readingsService.createInterval(createReadingDto),
			).rejects.toThrow(
				new BadRequestException("Endpage can't be more than the book pages"),
			);

			expect(bookRepository.findOne).toHaveBeenCalledWith({
				where: { id: createReadingDto.bookId },
			});
			expect(readingIntervalRepository.create).not.toHaveBeenCalled();
			expect(readingIntervalRepository.save).not.toHaveBeenCalled();
		});

		it('should throw an error if the book is not found', async () => {
			const createReadingDto: CreateReadingDto = {
				startPage: 10,
				endPage: 20,
				bookId: 1,
				user: { id: 1 } as any,
			};

			bookRepository.findOne.mockResolvedValue(null);

			await expect(
				readingsService.createInterval(createReadingDto),
			).rejects.toThrow(
				new BadRequestException('Book with the given ID does not exist'),
			);

			expect(bookRepository.findOne).toHaveBeenCalledWith({
				where: { id: createReadingDto.bookId },
			});
			expect(readingIntervalRepository.create).not.toHaveBeenCalled();
			expect(readingIntervalRepository.save).not.toHaveBeenCalled();
		});
	});
});
