export type FieldType = {
	username?: string;
	password?: string;
	remember?: string;
};
export type Login = {
	username: string;
	password: string;
};
export interface Profile {
	userInfo: UserInfo;
	access_token: string;
}

export interface UserInfo {
	userId: number;
	username: string;
	name: string;
	email: string;
}
