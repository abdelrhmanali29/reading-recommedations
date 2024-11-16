export class SuccessClass {
	constructor(
		public data?: object,
		public message?: string,
	) {
		this.data = data || {};
		this.message = message || 'Operation Succeed';
	}
}
