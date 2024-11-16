import { Exclude } from 'class-transformer';

export class UserResponse {
	id: number;

	username: string;

	@Exclude()
	password: string;

	role: string;
}
