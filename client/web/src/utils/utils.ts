import { TOKEN_KEY } from '@/utils';

export const setToken = (token: string) => {
	localStorage.setItem(TOKEN_KEY, `Bearer ${token}`);
};

export const getToken = () => {
	return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
	localStorage.removeItem(TOKEN_KEY);
};
