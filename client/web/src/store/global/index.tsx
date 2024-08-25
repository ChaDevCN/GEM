import { makeAutoObservable } from 'mobx';
import { UserInfo } from "@/type"

type Value = 'dark' | 'light' | 'auto';

class Global {
	constructor() {
		makeAutoObservable(this);
	}

	appearance: Value = 'auto';
	userInfo: UserInfo | null = null

	setTheme = (value: Value) => {
		this.appearance = value;
	};

	setUserInfo = (userInfo: UserInfo) => {
		this.userInfo = userInfo
	}
}

const globalStore = new Global();
export { globalStore };
