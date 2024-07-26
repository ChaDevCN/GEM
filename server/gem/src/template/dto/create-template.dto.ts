import { IsNotEmpty } from 'class-validator';

export class CreateTemplateDto {
  @IsNotEmpty({ message: '客户名不能为空' })
  clientName: string; // 客户名

  @IsNotEmpty({ message: '测试域名不能为空' })
  testDomain: string; // 测试域名

  @IsNotEmpty({ message: '前端不能为空' })
  frontendLead: string; // 前端负责人
}
