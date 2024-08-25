/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-24 16:02:57
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-24 16:03:43
 * @FilePath: \GEM\apps\user\src\user-role\user-role.service.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserRole } from './user-role.mysql.entity';
import { IBathRole } from '../user/user.dto';

@Injectable()
export class UserRoleService {
  constructor(
    @Inject('USER_ROLE_REPOSITORY')
    private userRoleRepository: Repository<UserRole>,
  ) {}

  listByUserId(userId: number) {
    return this.userRoleRepository.find({
      where: {
        userId,
      },
    });
  }

  listByUserIdWithSys(userId: number, systemId: number) {
    return this.userRoleRepository.find({
      where: {
        systemId,
        userId,
      },
    });
  }

  deleteByUserId(userId: number, systemId: number) {
    return this.userRoleRepository.delete({
      userId,
      systemId,
    });
  }

  async setUserRoles(userId: number, bathRoles: IBathRole[]) {
    let userRoles: UserRole[] = [];

    for (const sys of bathRoles) {
      await this.deleteByUserId(userId, sys.systemId);
      userRoles = [
        ...userRoles,
        ...sys.roleIds.map((roleId) => {
          return {
            userId,
            roleId,
            systemId: sys.systemId,
          };
        }),
      ];
    }

    return await this.userRoleRepository.save(userRoles);
  }
}
