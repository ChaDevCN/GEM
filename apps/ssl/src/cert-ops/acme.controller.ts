
import { Body, Controller, Get, Post } from '@nestjs/common';

import { CertService } from './acme.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './acme.dto';

@ApiTags('SSL证书')
@Controller('cert')
export class CertController {
    constructor(private readonly certService: CertService) { }

    @Post('account')
    async createAccount(@Body() createAccountDto: CreateAccountDto) {
        return this.certService.createAccount(createAccountDto);
    }
    @Get('account')
    async getAccount() {
        return this.certService.getAccount();

    }
}
