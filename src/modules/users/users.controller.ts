import { Controller, Get, Param, HttpCode, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UsersService } from '@App/modules/users/users.service';
import { JwtGuard } from '@App/modules/auth/guard/jwt.guard';
import { SuccessClass } from '@App/shared/classes/success.class';
import { RoleGuard } from '@App/modules/auth/guard/role.guard';
import { UserRolesDecorator } from '@App/modules/auth/decorators/roles.decorator';
import { UserRole } from '@App/modules/users/enums/role.enum';

@Controller({ path: 'users', version: '1' })
@UseGuards(ThrottlerGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UserRolesDecorator(UserRole.ADMIN)
	@UseGuards(RoleGuard)
	@UseGuards(JwtGuard)
	@HttpCode(200)
	@Get(':id')
	async findOne(@Param('id') id: string): Promise<SuccessClass> {
		const user = await this.usersService.findOneById(+id);
		return new SuccessClass({ user });
	}
}
