/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-24 15:32:15
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-24 15:43:32
 * @FilePath: \GEM\apps\user\src\role-privilege\role-privilege.module.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */

import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { RolePrivilegeService } from './role-privilege.service';
import { rolePrivilegeProviders } from './user-privilege.providers';

@Module({
  providers: [RolePrivilegeService, ...rolePrivilegeProviders],
  imports: [DatabaseModule],
  exports: [RolePrivilegeService],
})
export class RolePrivilegeModule {}
