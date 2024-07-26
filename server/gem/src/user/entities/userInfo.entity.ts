import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '姓名',
    length: 100,
    nullable: true,
  })
  nickName: string;

  @Column({
    comment: '邮箱',
    length: 50,
    nullable: true,
  })
  email: string;

  @Column({
    comment: '生日',
    type: 'date',
    nullable: true,
  })
  birthday: Date;

  @Column({
    comment: '是否冻结',
    default: false,
  })
  isFrozen: boolean;

  @Column({
    comment: '头像',
    length: 100,
    nullable: true,
  })
  headPic: string;

  @Column({
    comment: '联系电话',
    length: 20,
    nullable: true,
  })
  phone: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
