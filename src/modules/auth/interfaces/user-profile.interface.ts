import { UserResponse } from '@App/modules/users/dto/user-response.dto';

export interface UserProfile {
	user: UserResponse;
	accessToken: string;
	expiresIn: number;
}
