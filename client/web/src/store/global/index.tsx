import { makeAutoObservable } from 'mobx';

type Value = 'dark' | 'light' | 'auto';

class Global {
	constructor() {
		makeAutoObservable(this);
	}

	appearance: Value = 'auto';
	setTheme = (value: Value) => {
		this.appearance = value;
	};
}

const globalStore = new Global();
export { globalStore };
