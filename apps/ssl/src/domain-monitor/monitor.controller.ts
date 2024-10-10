import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Param,
	Request,
	ParseIntPipe,
	NotFoundException
} from '@nestjs/common';
import { CertificateMonitoringService } from './monitor.service';
import {
	CreateCertificateMonitoringDto,
	UpdateCheckIntervalDto
} from './monitor.dto';
import { CertificateMonitoring } from './monitor.mysql.entity';
import { BUSINESS_ERROR_CODE, BusinessException } from '@app/comm';

@Controller('certificate-monitoring')
export class CertificateMonitoringController {
	constructor(
		private readonly certificateService: CertificateMonitoringService
	) {}

	@Post()
	async create(
		@Body() createDto: CreateCertificateMonitoringDto,
		@Request() req
	): Promise<CertificateMonitoring> {
		try {
			return this.certificateService.createFromDomain(createDto, req.user);
		} catch (error) {
			console.log(error);

			throw new BusinessException({
				code: BUSINESS_ERROR_CODE.COMMON,
				message: '服务器忙。'
			});
		}
	}

	@Get()
	async findAll(): Promise<CertificateMonitoring[]> {
		return this.certificateService.getAll();
	}

	@Get(':id')
	async findOne(
		@Param('id', ParseIntPipe) id: number
	): Promise<CertificateMonitoring> {
		const certificate = await this.certificateService.findOne(id);
		if (!certificate) {
			throw new NotFoundException(
				`Certificate monitoring record with ID ${id} not found`
			);
		}
		return certificate;
	}

	@Patch(':id/check-interval')
	async updateCheckInterval(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateDto: UpdateCheckIntervalDto
	): Promise<CertificateMonitoring> {
		const updatedCertificate =
			await this.certificateService.updateCheckInterval(
				id,
				updateDto.newInterval
			);
		if (!updatedCertificate) {
			throw new NotFoundException(
				`Certificate monitoring record with ID ${id} not found`
			);
		}
		return updatedCertificate;
	}
	@Patch(':id')
	async updateTime(@Param('id', ParseIntPipe) id: number) {
		return this.certificateService.update(id);
	}

	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
		const result = await this.certificateService.remove(id);
		if (!result) {
			throw new NotFoundException(
				`Certificate monitoring record with ID ${id} not found`
			);
		}
	}

	// @Process('checkValidity')
	// async checkValidity(job: Job<{ certificateId: number }>) {
	//     const { certificateId } = job.data;
	//     await this.certificateService.checkValidity(certificateId);
	// }
}
