import { Test, TestingModule } from '@nestjs/testing';

import { BookService } from './books.service';
import { JwtGuard } from '@App/modules/auth/guard/jwt.guard';
import { RoleGuard } from '@App/modules/auth/guard/role.guard';
import { CreateBookDto } from './dto/create-book.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { SuccessClass } from '../../shared/classes/success.class';
import { Book } from '@App/modules/books/entities/books.entity';
import { BookController } from '@App/modules/books/books.controller';

describe('BookController', () => {
	let bookController: BookController;
	let bookService: BookService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BookController],
			providers: [
				{
					provide: BookService,
					useValue: {
						create: jest.fn(),
						list: jest.fn(),
						remove: jest.fn(),
						getTopFiveBooks: jest.fn(),
					},
				},
			],
		})
			.overrideGuard(JwtGuard)
			.useValue({ canActivate: jest.fn().mockReturnValue(true) })
			.overrideGuard(RoleGuard)
			.useValue({ canActivate: jest.fn().mockReturnValue(true) })
			.compile();

		bookController = module.get<BookController>(BookController);
		bookService = module.get<BookService>(BookService);
	});

	it('should be defined', () => {
		expect(bookController).toBeDefined();
	});

	describe('findAllPaginated', () => {
		it('should return a paginated list of books', async () => {
			const books = [{ id: 1, name: 'Book 1', numOfPages: 100 }] as Book[];
			const count = 1;
			const paginationDto: PaginationDto = { page: 1, limit: 10 };

			jest.spyOn(bookService, 'list').mockResolvedValue([books, count]);

			const result = await bookController.findAllPaginated(paginationDto);

			expect(bookService.list).toHaveBeenCalledWith(paginationDto);
			expect(result).toEqual(
				new SuccessClass({
					books,
					pagination: {
						page: 1,
						limit: 10,
						count: 1,
					},
				}),
			);
		});
	});

	describe('create', () => {
		it('should create a book and return success message', async () => {
			const createBookDto: CreateBookDto = {
				name: 'New Book',
				numOfPages: 200,
			};
			const createdBook = { id: 1, ...createBookDto } as Book;

			jest.spyOn(bookService, 'create').mockResolvedValue(createdBook);

			const result = await bookController.create(createBookDto);

			expect(bookService.create).toHaveBeenCalledWith(createBookDto);
			expect(result).toEqual(
				new SuccessClass(createdBook, 'Book Created Successfully'),
			);
		});
	});

	describe('remove', () => {
		it('should remove a book by ID and return success message', async () => {
			const bookId = '1';

			jest.spyOn(bookService, 'remove').mockResolvedValue();

			const result = await bookController.remove(bookId);

			expect(bookService.remove).toHaveBeenCalledWith(1);
			expect(result).toEqual(new SuccessClass({}, 'Book deleted successfully'));
		});
	});

	describe('getTopBooks', () => {
		it('should return the top 5 books with unique read pages', async () => {
			const topBooks = [
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
			];

			jest.spyOn(bookService, 'getTopFiveBooks').mockResolvedValue(topBooks);

			const result = await bookController.getTopBooks();

			expect(bookService.getTopFiveBooks).toHaveBeenCalled();
			expect(result).toEqual(topBooks);
		});
	});
});
