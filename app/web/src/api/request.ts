import axios from 'axios';
import axiosRetry from 'axios-retry';
import { type AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
const whiteRetry = new Set(['ECONNABORTED', undefined, 0]);

const serviceAxios = axios.create({
    baseURL: '',
    timeout: 15 * 1000,
    withCredentials: false,
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
        console.log('全局请求拦截器: 成功');
        return config;
    },
    (err: AxiosError) => {
        console.log('全局请求拦截器: 处理请求错误');
        return Promise.reject(err);
    }
);

serviceAxios.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log('全局响应拦截器: 成功');
        return response;
    },
    (err: AxiosError) => {
        console.log('全局响应拦截器: 处理响应错误');
        return Promise.reject(err);
    }
);

function createRequest(service: AxiosInstance) {
    return function <T>(config: AxiosRequestConfig): Promise<T> {
        return service(config);
    };
}

export default createRequest(serviceAxios);
