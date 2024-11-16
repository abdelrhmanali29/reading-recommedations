import { IsNotEmpty } from 'class-validator';
import { User } from '@App/modules/users/entities/user.entity';

export class LoginDto {
	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	user: User;
}
