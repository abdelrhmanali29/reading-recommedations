import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReadingDto } from '@App/modules/readings/dto/create-reading.dto';
import { ReadingInterval } from '@App/modules/readings/entities/readings.entity';
import { Book } from '@App/modules/books/entities/books.entity';

@Injectable()
export class ReadingsService {
	constructor(
		@InjectRepository(ReadingInterval)
		private readonly readingIntervalRepository: Repository<ReadingInterval>,

		@InjectRepository(Book)
		private readonly bookRepository: Repository<Book>,
	) {}

	async createInterval(
		createReadingDto: CreateReadingDto,
	): Promise<ReadingInterval> {
		const book = await this.bookRepository.findOne({
			where: { id: createReadingDto.bookId },
		});

		if (!book) {
			throw new BadRequestException('Book with the given ID does not exist');
		}

		if (createReadingDto.endPage > book.numOfPages)
			throw new BadRequestException(
				"Endpage can't be more than the book pages",
			);

		const interval = this.readingIntervalRepository.create(createReadingDto);
		interval.book = book;
		interval.user = createReadingDto.user;
		await this.readingIntervalRepository.save(interval);
		return interval;
	}
}
