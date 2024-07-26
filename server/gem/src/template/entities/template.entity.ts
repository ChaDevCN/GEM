import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, comment: '客户名' })
  clientName: string;

  @Column({ length: 100, comment: '前端' })
  frontendLead: string;

  @Column({ comment: '客服', nullable: true })
  customerServiceLead: string;

  @Column({ comment: '销售', nullable: true })
  salesLead: string;

  @Column({ comment: '分配日期', nullable: true })
  allocationDate: Date;

  @Column({ default: false, comment: '是否上线' })
  isOnline: boolean;

  @Column({
    type: 'enum',
    enum: ['未开始', '开发中', '已上线'],
    default: '未开始',
    comment: '状态',
  })
  projectStatus: string;

  @Column({ type: 'date', nullable: true, comment: '实际上线日期' })
  actualLaunchDate: Date;

  @Column({ length: 255, nullable: true, comment: '生产域名' })
  liveDomain: string;

  @Column({ length: 255, nullable: true, comment: '测试域名' })
  testDomain: string;
  @Column({ type: 'json', nullable: true })
  additionalInfo: any;
  @CreateDateColumn()
  createdDate: Date;
}
