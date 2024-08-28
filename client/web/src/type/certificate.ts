export interface CertificateMonitoring {
    id: number;
    hostname: string;
    port: number;
    ipType: 'IPv4' | 'IPv6';
    ipAddress: string;
    status: 'valid' | 'expired' | 'expiring_soon' | 'invalid' | 'unknown';
    validFrom: string;
    validTo: string;
    daysUntilExpiry: number;
    issuer: string;
    subject: string;
    serialNumber: string;
    keyStrength: number;
    san: string;
    lastChecked: string;
}
export type AddCertificateMonitor = {
    domain: string
    notes?: string
}