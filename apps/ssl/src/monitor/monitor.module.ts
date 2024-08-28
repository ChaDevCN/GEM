import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/comm';
import { CertificateMonitoringController } from "./monitor.controller"
import { CertificateMonitoringService } from "./monitor.service"
import { MonitorProviders } from "./monitor.providers"


@Module({
    controllers: [CertificateMonitoringController],
    providers: [CertificateMonitoringService, ...MonitorProviders],
    exports: [CertificateMonitoringService],

})
export class MonitorModule { }
