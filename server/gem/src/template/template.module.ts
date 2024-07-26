import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateController } from './template.controller';
import { Client } from './entities/template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
