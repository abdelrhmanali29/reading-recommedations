import { Book } from '@App/modules/books/entities/books.entity';
import { User } from '@App/modules/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('reading_intervals')
export class ReadingInterval {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.readingIntervals)
	user: User;

	@ManyToOne(() => Book, (book) => book.readingIntervals)
	book: Book;

	@Column()
	startPage: number;

	@Column()
	endPage: number;
}
