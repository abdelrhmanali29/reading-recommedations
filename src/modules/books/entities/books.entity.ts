import { ReadingInterval } from '@App/modules/readings/entities/readings.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('books')
export class Book {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	numOfPages: number;

	@OneToMany(() => ReadingInterval, (readingInterval) => readingInterval.book)
	readingIntervals: ReadingInterval[];
}
