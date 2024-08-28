
import { AddCertificateMonitor } from "@/type";
import request from "../request";

export const getCertificateMonitoringList = async <T>() =>
    await request<T>({
        method: 'get',
        url: '/api/v2/certificate-monitoring',
    })

export const addCertificateMonitoring = async (data: AddCertificateMonitor) =>
    await request({
        method: 'post',
        url: '/api/v2/certificate-monitoring',
        data
    })

export const updataTime = async (id: number) =>
    await request({
        method: 'patch',
        url: `/api/v2/certificate-monitoring/${id}`
    })
