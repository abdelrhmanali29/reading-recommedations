import { Controller, Get } from '@nestjs/common';
import { AppService } from '@App/app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	checkHealth(): string {
		return this.appService.checkHealth();
	}
}