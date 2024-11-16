import { UserRole } from '@App/modules/users/enums/role.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	@IsEnum(UserRole)
	role: UserRole;
}
