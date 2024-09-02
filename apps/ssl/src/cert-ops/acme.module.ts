import { Module } from "@nestjs/common"
import { AcmeProviders } from "./acme.providers"
import { CertService } from "./acme.service"
import { CertController } from "./acme.controller"
@Module({
    providers: [CertService, ...AcmeProviders],
    controllers: [CertController],
    exports: [CertService]
})
export class CertMoudle { }