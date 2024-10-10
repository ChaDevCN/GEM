import { Module } from '@nestjs/common';
import { CertificateMonitoringController } from './monitor.controller';
import { CertificateMonitoringService } from './monitor.service';
import { MonitorProviders } from './monitor.providers';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	controllers: [CertificateMonitoringController],
	providers: [CertificateMonitoringService, ...MonitorProviders],
	exports: [CertificateMonitoringService],
	imports: [ScheduleModule.forRoot()]
})
export class MonitorModule {}
