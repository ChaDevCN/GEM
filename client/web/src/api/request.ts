/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-20 22:44:53
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-25 20:52:38
 * @FilePath: \GEM\client\web\src\api\request.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */

import axios from 'axios';
import axiosRetry from 'axios-retry';

import {
	type AxiosInstance,
	InternalAxiosRequestConfig,
	AxiosRequestConfig,
	AxiosResponse,
	AxiosError
} from 'axios';
import { type RequestResponse } from '@/type';
import { message } from 'antd';
const whiteRetry = new Set(['ECONNABORTED', undefined, 0]);

const serviceAxios = axios.create({
	baseURL: '',
	timeout: 15 * 1000,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json;charset=utf-8'
	},
	validateStatus() {
		return true;
	}
});

axiosRetry(serviceAxios, {
	retries: 2,
	shouldResetTimeout: true,
	retryDelay: (retryCount) => {
		return retryCount * 10000;
	},
	retryCondition: (err) => {
		const { code, message } = err;
		return whiteRetry.has(<string>code) || message.includes('timeout');
	}
});

serviceAxios.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		return config;
	},
	(err: AxiosError) => {
		return Promise.reject(err);
	}
);

serviceAxios.interceptors.response.use(
	(response: AxiosResponse) => {
		switch (response.data.status) {
			case 200:
			case 201:
				return response.data
			case 10002:
				message.error('信息有误，请重新登录')
				return response.data
			default:
				message.error(response.data.message)
				return response.data
		}
	},
	(err: AxiosError) => {
		return Promise.reject(err);
	}
);

function createRequest(service: AxiosInstance) {
	return function <T>(config: AxiosRequestConfig): Promise<RequestResponse<T>> {
		return service(config);
	};
}

export default createRequest(serviceAxios);
