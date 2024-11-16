import { LoginDto } from '@App/modules/auth/dto/login.dto';
import { UserRole } from '@App/modules/users/enums/role.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

export class RegisterDto extends OmitType(LoginDto, ['user'] as const) {
	@IsNotEmpty()
	@IsEnum(UserRole)
	role: UserRole;
}
