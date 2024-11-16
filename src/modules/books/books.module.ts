import { Book } from '@App/modules/books/entities/books.entity';
import { BookController } from '@App/modules/books/books.controller';
import { BookService } from '@App/modules/books/books.service';
import { UsersModule } from '@App/modules/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingInterval } from '@App/modules/readings/entities/readings.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Book]),
		TypeOrmModule.forFeature([ReadingInterval]),
		JwtModule,
		UsersModule,
	],
	providers: [BookService],
	controllers: [BookController],
})
export class BookModule {}
