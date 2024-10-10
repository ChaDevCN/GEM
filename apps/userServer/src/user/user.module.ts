/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-24 15:05:47
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-25 12:12:46
 * @FilePath: \GEM\apps\user\src\user\user.module.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */
import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProviders } from './user.providers';

import { DatabaseModule } from '@app/common';
import { RolePrivilegeModule } from '../role-privilege/role-privilege.module';
import { UserRoleModule } from '../user-role/user-role.module';
import { RoleModule } from '../role/role.module';
import { PrivilegeModule } from '../privilege/privilege.module';
import { OAuthService } from './oauth.service';

@Module({
	controllers: [UserController],
	providers: [...UserProviders, UserService, OAuthService],
	imports: [
		forwardRef(() => DatabaseModule),
		RolePrivilegeModule,
		UserRoleModule,
		RoleModule,
		PrivilegeModule
	],
	exports: [UserService, OAuthService]
})
export class UserModule {}
