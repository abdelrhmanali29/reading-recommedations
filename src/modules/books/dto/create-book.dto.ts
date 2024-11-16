import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateBookDto {
	@IsOptional()
	@IsString()
	name: string;

	@IsOptional()
	@IsNumber()
	numOfPages: number;
}
