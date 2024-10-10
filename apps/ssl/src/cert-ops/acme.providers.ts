import { AcmeAccount } from './acme.account.mysql.entity';
import { AcmeOrder } from './acme.order.mysql.entity';
export const AcmeProviders = [
	{
		provide: 'ORDER_REPOSITORY',
		useFactory: (AppDataSource) => AppDataSource.getRepository(AcmeOrder),
		inject: ['MYSQL_DATA_SOURCE']
	},
	{
		provide: 'ACCOUNT_REPOSITORY',
		useFactory: (AppDataSource) => AppDataSource.getRepository(AcmeAccount),
		inject: ['MYSQL_DATA_SOURCE']
	}
];
