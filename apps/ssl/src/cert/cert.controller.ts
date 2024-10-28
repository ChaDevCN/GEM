import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('证书申请')
@Controller('applycert')
export class CertController {}
