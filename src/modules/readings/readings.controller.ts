import { UserRolesDecorator } from '@App/modules/auth/decorators/roles.decorator';
import { JwtGuard } from '@App/modules/auth/guard/jwt.guard';
import { RoleGuard } from '@App/modules/auth/guard/role.guard';
import { UserRole } from '@App/modules/users/enums/role.enum';
import { SuccessClass } from '@App/shared/classes/success.class';

import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';

import { ReadingsService } from '@App/modules/readings/readings.service';
import { CreateReadingDto } from '@App/modules/readings/dto/create-reading.dto';

@Controller({ path: 'readings', version: '1' })
export class ReadingsController {
	constructor(private readonly readingsService: ReadingsService) {}

	@UserRolesDecorator(UserRole.USER)
	@UseGuards(RoleGuard)
	@UseGuards(JwtGuard)
	@Post()
	async create(@Body() createReadingDto: CreateReadingDto, @Req() request) {
		createReadingDto.user = request.user;
		const result = await this.readingsService.createInterval(createReadingDto);

		return new SuccessClass(result, 'Reading Interval Added Successfully');
	}
}
