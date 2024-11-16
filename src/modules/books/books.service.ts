import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '@App/modules/books/entities/books.entity';
import { CreateBookDto } from '@App/modules/books/dto/create-book.dto';
import { PaginationDto } from '@App/shared/dto/pagination.dto';
import { ReadingInterval } from '@App/modules/readings/entities/readings.entity';

@Injectable()
export class BookService {
	constructor(
		@InjectRepository(Book)
		private readonly bookRepository: Repository<Book>,

		@InjectRepository(ReadingInterval)
		private readonly readingRepository: Repository<ReadingInterval>,
	) {}

	async create(bookData: CreateBookDto): Promise<Book> {
		return await this.bookRepository.save(bookData);
	}

	async list(paginationDto: PaginationDto): Promise<[Book[], number]> {
		const { page = 1, limit = 10 } = paginationDto;
		const skip = (page - 1) * limit;

		const [books, count] = await this.bookRepository.findAndCount({
			take: limit,
			skip,
		});

		return [books, count];
	}

	async remove(id: number): Promise<void> {
		await this.bookRepository.delete(id);
	}

	async getTopFiveBooks() {
		const booksWithUniquePages = await this.readingRepository
			.createQueryBuilder('readingInterval')
			.select('readingInterval.bookId', 'bookId')
			.addSelect(
				'SUM(readingInterval.endPage - readingInterval.startPage + 1)',
				'uniqueReadPages',
			)
			.groupBy('readingInterval.bookId')
			.orderBy('"uniqueReadPages"', 'DESC')
			.limit(5)
			.getRawMany();

		const topBooks = await Promise.all(
			booksWithUniquePages.map(async ({ bookId, uniqueReadPages }) => {
				const book = await this.bookRepository.findOne({
					where: { id: bookId },
					select: ['id', 'name', 'numOfPages'],
				});
				if (!book) return null;

				return {
					bookId: book.id,
					bookName: book.name,
					numOfPages: book.numOfPages,
					numOfReadPages: parseInt(uniqueReadPages),
				};
			}),
		);

		return topBooks.filter((book) => book !== null);
	}
}
