import { Post, Body, Controller, HttpCode } from '@nestjs/common';
import { AuthService } from '@App/modules/auth/auth.service';
import { LoginDto } from '@App/modules/auth/dto/index.dto';
import { SuccessClass } from '@App/shared/classes/success.class';
import { RegisterDto } from '@App/modules/auth/dto/register.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(200)
	@Post('/register')
	async register(@Body() registerDto: RegisterDto): Promise<SuccessClass> {
		await this.authService.register(registerDto);
		return new SuccessClass({}, 'Registration  Completed Successfully');
	}

	@HttpCode(200)
	@Post('/login')
	async login(@Body() loginDto: LoginDto): Promise<SuccessClass> {
		const userToken = await this.authService.login(loginDto);
		return new SuccessClass(userToken);
	}
}
