import { UserRolesDecorator } from '@App/modules/auth/decorators/roles.decorator';
import { JwtGuard } from '@App/modules/auth/guard/jwt.guard';
import { RoleGuard } from '@App/modules/auth/guard/role.guard';
import { CreateBookDto } from '@App/modules/books/dto/create-book.dto';
import { BookService } from '@App/modules/books/books.service';
import { UserRole } from '@App/modules/users/enums/role.enum';
import { SuccessClass } from '@App/shared/classes/success.class';

import {
	Controller,
	Get,
	Post,
	Delete,
	Param,
	Body,
	HttpCode,
	Query,
	UseGuards,
} from '@nestjs/common';

import { PaginationDto } from '@App/shared/dto/pagination.dto';

@Controller({ path: 'books', version: '1' })
export class BookController {
	constructor(private readonly bookService: BookService) {}

	@UserRolesDecorator(UserRole.ADMIN, UserRole.USER)
	@UseGuards(RoleGuard)
	@UseGuards(JwtGuard)
	@HttpCode(200)
	@Get()
	async findAllPaginated(
		@Query() paginationDto: PaginationDto,
	): Promise<SuccessClass> {
		const [books, count] = await this.bookService.list(paginationDto);

		const pagination = {
			page: paginationDto.page,
			limit: paginationDto.limit,
			count,
		};

		return new SuccessClass({ books, pagination });
	}

	@UserRolesDecorator(UserRole.ADMIN)
	@UseGuards(RoleGuard)
	@UseGuards(JwtGuard)
	@Post()
	async create(@Body() createBookDto: CreateBookDto) {
		const result = await this.bookService.create(createBookDto);

		return new SuccessClass(result, 'Book Created Successfully');
	}

	@UserRolesDecorator(UserRole.ADMIN)
	@UseGuards(RoleGuard)
	@UseGuards(JwtGuard)
	@HttpCode(200)
	@Delete(':id')
	async remove(@Param('id') id: string): Promise<SuccessClass> {
		await this.bookService.remove(+id);

		return new SuccessClass({}, 'Book deleted successfully');
	}

	@UserRolesDecorator(UserRole.ADMIN, UserRole.USER)
	@UseGuards(RoleGuard)
	@UseGuards(JwtGuard)
	@HttpCode(200)
	@Get('/top-five')
	async getTopBooks() {
		return await this.bookService.getTopFiveBooks();
	}
}
