/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-24 15:32:05
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-24 15:44:09
 * @FilePath: \GEM\apps\user\src\role-privilege\role-privilege.mysql.entity.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RolePrivilege {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: null })
  systemId?: number;

  @Column()
  roleId: number;

  @Column()
  privilegeId: number;
}
