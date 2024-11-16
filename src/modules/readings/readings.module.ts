import { UsersModule } from '@App/modules/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingInterval } from '@App/modules/readings/entities/readings.entity';
import { ReadingsService } from '@App/modules/readings/readings.service';
import { ReadingsController } from '@App/modules/readings/readings.controller';
import { Book } from '@App/modules/books/entities/books.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ReadingInterval]),
		TypeOrmModule.forFeature([Book]),
		JwtModule,
		UsersModule,
	],
	providers: [ReadingsService],
	controllers: [ReadingsController],
	exports: [TypeOrmModule.forFeature([ReadingInterval])],
})
export class ReadingModule {}
