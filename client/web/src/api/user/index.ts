/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-24 23:54:51
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-25 20:47:01
 * @FilePath: \GEM\client\web\src\api\user\index.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */
import request from '../request';
import { Login } from '@/type';

export const login = async <T>(data: Login) =>
	await request<T>({
		method: 'post',
		url: '/api/v1/auth/login',
		data
	});

export const getUserInfo = async () => {
	await request({
		method: 'post',
		url: '/api/v1/user/profile'
	});
};
