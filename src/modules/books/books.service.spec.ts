import { Test, TestingModule } from '@nestjs/testing';

import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from '@App/modules/books/entities/books.entity';
import { ReadingInterval } from '@App/modules/readings/entities/readings.entity';
import { CreateBookDto } from '@App/modules/books/dto/create-book.dto';
import { PaginationDto } from '@App/shared/dto/pagination.dto';
import { BookService } from '@App/modules/books/books.service';

describe('BookService', () => {
	let bookService: BookService;
	let bookRepository: Repository<Book>;
	let readingRepository: Repository<ReadingInterval>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BookService,
				{
					provide: getRepositoryToken(Book),
					useClass: Repository,
				},
				{
					provide: getRepositoryToken(ReadingInterval),
					useClass: Repository,
				},
			],
		}).compile();

		bookService = module.get<BookService>(BookService);
		bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
		readingRepository = module.get<Repository<ReadingInterval>>(
			getRepositoryToken(ReadingInterval),
		);
	});

	it('should be defined', () => {
		expect(bookService).toBeDefined();
	});

	describe('create', () => {
		it('should create a book', async () => {
			const createBookDto: CreateBookDto = {
				name: 'Test Book',
				numOfPages: 100,
			};
			const savedBook = { id: 1, ...createBookDto } as Book;

			jest.spyOn(bookRepository, 'save').mockResolvedValue(savedBook);

			const result = await bookService.create(createBookDto);

			expect(bookRepository.save).toHaveBeenCalledWith(createBookDto);
			expect(result).toEqual(savedBook);
		});
	});

	describe('list', () => {
		it('should return a paginated list of books', async () => {
			const books = [{ id: 1, name: 'Book 1', numOfPages: 100 } as Book];
			jest.spyOn(bookRepository, 'findAndCount').mockResolvedValue([books, 1]);

			const paginationDto: PaginationDto = { page: 1, limit: 10 };
			const result = await bookService.list(paginationDto);

			expect(bookRepository.findAndCount).toHaveBeenCalledWith({
				take: 10,
				skip: 0,
			});
			expect(result).toEqual([books, 1]);
		});
	});

	describe('remove', () => {
		it('should remove a book by id', async () => {
			const bookId = 1;

			jest.spyOn(bookRepository, 'delete').mockResolvedValue(undefined);

			await bookService.remove(bookId);

			expect(bookRepository.delete).toHaveBeenCalledWith(bookId);
		});
	});

	describe('getTopFiveBooks', () => {
		it('should return top 5 books with unique read pages', async () => {
			const readingData = [
				{ bookId: 1, uniqueReadPages: '50' },
				{ bookId: 2, uniqueReadPages: '40' },
			];
			const books = [
				{ id: 1, name: 'Book 1', numOfPages: 100 },
				{ id: 2, name: 'Book 2', numOfPages: 200 },
			] as Book[];

			jest.spyOn(readingRepository, 'createQueryBuilder').mockReturnValueOnce({
				select: jest.fn().mockReturnThis(),
				addSelect: jest.fn().mockReturnThis(),
				groupBy: jest.fn().mockReturnThis(),
				orderBy: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnThis(),
				getRawMany: jest.fn().mockResolvedValue(readingData),
			} as any);

			jest
				.spyOn(bookRepository, 'findOne')
				.mockImplementation(({ where: { id } }: any) =>
					Promise.resolve(books.find((b) => b.id === id)),
				);

			const result = await bookService.getTopFiveBooks();

			expect(readingRepository.createQueryBuilder).toHaveBeenCalledWith(
				'readingInterval',
			);
			expect(bookRepository.findOne).toHaveBeenCalledTimes(2);
			expect(result).toEqual([
				{
					bookId: 1,
					bookName: 'Book 1',
					numOfPages: 100,
					numOfReadPages: 50,
				},
				{
					bookId: 2,
					bookName: 'Book 2',
					numOfPages: 200,
					numOfReadPages: 40,
				},
			]);
		});
	});
});
