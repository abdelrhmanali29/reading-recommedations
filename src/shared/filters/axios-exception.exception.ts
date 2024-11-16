import { HttpException, HttpStatus } from '@nestjs/common';

export class AxiosException extends HttpException {
	constructor(message: string, errors: any, status: HttpStatus) {
		super({ message, errors }, status);
	}
}
