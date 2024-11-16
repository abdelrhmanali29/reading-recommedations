import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { ErrorClass } from '@App/shared/classes/error.class';
import { TypeORMError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let errors = [];
		let message = 'UNKNOWN ERROR';

		if (exception instanceof HttpException) {
			status = exception.getStatus();

			errors = Array.isArray(exception.getResponse()['message'])
				? [...exception.getResponse()['message']]
				: [exception.getResponse()['message']];

			message = errors[0];
		} else if (exception instanceof TypeORMError) {
			status = HttpStatus.BAD_REQUEST;

			message = exception['message'];

			errors.push('Bad request');
		} else if (exception instanceof Error) {
			status = HttpStatus.BAD_REQUEST;

			message = exception['message'];
			errors.push(message);
		} else {
			errors.push(message);
		}

		this.logger.error(exception);

		response.status(status).send(new ErrorClass(errors, message));
	}
}
