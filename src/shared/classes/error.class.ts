export class ErrorClass {
	constructor(
		public errors: string[],
		public message: string,
	) {
		this.errors = errors;
		this.message = message;
	}
}
