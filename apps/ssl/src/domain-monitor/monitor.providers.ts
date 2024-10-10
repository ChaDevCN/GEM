import { CertificateMonitoring } from './monitor.mysql.entity';

export const MonitorProviders = [
	{
		provide: 'MONITOR_REPOSITORY',
		useFactory: (AppDataSource) =>
			AppDataSource.getRepository(CertificateMonitoring),
		inject: ['MYSQL_DATA_SOURCE']
	}
];
