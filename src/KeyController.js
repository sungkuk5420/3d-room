export class KeyController {
	constructor() {
		this.keys = [];

		window.addEventListener('keydown', event => {
			this.keys[event.code] = true;
			// console.log(this.keys);
		});

		window.addEventListener('keyup', event => {
			delete this.keys[event.code];
			// console.log(this.keys);
		});
	}
}