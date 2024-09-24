
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

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
    @Post('account/:id')
    async verifyDnsChallenge(@Param('id', ParseIntPipe) id: number) {
        return this.certService.verifyDns01Challenge(id)
    }
    @Delete('account/:id')
    async deleteAccount(@Param('id', ParseIntPipe) id: number) {
        return this.certService.deleteAccount(id)
    }
}
