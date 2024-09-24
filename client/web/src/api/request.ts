
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
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	disableRetry?: boolean;
}
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
		const config = err.config as CustomAxiosRequestConfig
		if (config.disableRetry) {
			return false
		}
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
				return response.data
		}
	},
	(err: AxiosError) => {
		return Promise.reject(err);
	}
);

function createRequest(service: AxiosInstance) {
	return function <T>(config: CustomAxiosRequestConfig): Promise<RequestResponse<T>> {
		return service(config);
	};
}

export default createRequest(serviceAxios);
