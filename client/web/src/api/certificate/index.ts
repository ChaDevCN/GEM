import request from '../request';

import { Accout, AddCertificateMonitor, CertificateRenewal } from '@/type';

export const getCertificateMonitoringList = async <T>() =>
	await request<T>({
		method: 'get',
		url: '/api/v2/certificate-monitoring'
	});

export const addCertificateMonitoring = async (data: AddCertificateMonitor) =>
	await request({
		method: 'post',
		url: '/api/v2/certificate-monitoring',
		data
	});

export const updataTime = async (id: number) =>
	await request({
		method: 'patch',
		url: `/api/v2/certificate-monitoring/${id}`
	});

export const account = async (data: Accout) =>
	await request({
		method: 'post',
		url: '/api/v2/cert/account',
		data
	});

export const getAccount = async <T>() =>
	await request<T>({
		method: 'get',
		url: '/api/v2/cert/account'
	});

export const createCertificateRenewal = async (data: CertificateRenewal) =>
	await request({
		method: 'post',
		url: '/api/v2/certificates/create',
		data: {
			...data,
			autoRenew: true
		},
		timeout: 10 * 1000,
		disableRetry: true
	});

export const verifyDnsChallenge = async <T>(id: number) =>
	await request<T>({
		method: 'post',
		url: `/api/v2/cert/account/${id}`
	});

export const deleteAcmeAccount = async (id: number) =>
	await request({
		method: 'delete',
		url: `/api/v2/cert/account/${id}`
	});
