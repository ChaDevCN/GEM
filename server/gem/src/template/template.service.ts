import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Client } from './entities/template.entity';
@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}
  create(createTemplateDto: CreateTemplateDto) {
    return 'This action adds a new template';
  }
  async createTemplate(createClientDto: CreateTemplateDto): Promise<Client> {
    // const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(createClientDto);
  }
  findAll() {
    return `This action returns all template`;
  }

  findOne(id: number) {
    return `This action returns a #${id} template`;
  }

  update(id: number, updateTemplateDto: UpdateTemplateDto) {
    return `This action updates a #${id} template`;
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }
}
