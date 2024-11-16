import { HttpExceptionFilter } from '@App/shared/filters/http-exception.filter';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
	imports: [HttpExceptionFilter],
	exports: [HttpExceptionFilter],
	controllers: [],
	providers: [HttpExceptionFilter],
})
export class SharedModule {}
