import { makeAutoObservable, autorun } from 'mobx';

import { UserInfo } from '@/type';

type Value = 'dark' | 'light' | 'auto';

class Global {
	appearance: Value = 'auto';
	userInfo: UserInfo | null = null;

	constructor() {
		makeAutoObservable(this);
		this.loadFromStorage();
		this.setupPersistence();
	}

	setTheme = (value: Value) => {
		this.appearance = value;
	};

	setUserInfo = (userInfo: UserInfo) => {
		this.userInfo = userInfo;
	};

	private loadFromStorage() {
		const storedData = localStorage.getItem('globalStore');
		if (storedData) {
			const parsedData = JSON.parse(storedData);
			this.appearance = parsedData.appearance || 'auto';
			this.userInfo = parsedData.userInfo || null;
		}
	}

	private setupPersistence() {
		autorun(() => {
			const dataToStore = {
				appearance: this.appearance,
				userInfo: this.userInfo
			};
			localStorage.setItem('globalStore', JSON.stringify(dataToStore));
		});
	}
}

const globalStore = new Global();
export { globalStore };
