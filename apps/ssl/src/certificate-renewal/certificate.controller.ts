import { Body, Controller, Post } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCertificateDto } from './certificate.dto';

@Controller('certificates')
export class CertificateController {
	constructor(private readonly certificateService: CertificateService) {}

	@Post('create')
	@ApiTags('续费证书')
	createCertificate(@Body() createCertificateDto: CreateCertificateDto) {
		return this.certificateService.createCertificate(createCertificateDto);
	}
}
