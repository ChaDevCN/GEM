/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-24 16:03:06
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-25 11:49:43
 * @FilePath: \GEM\apps\user\src\user\user.dto.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */

import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	IsOptional,
	IsEmail,
	IsEnum,
	MinLength
} from 'class-validator';
import { UserStatus } from './user.mysql.entity';

export class DisableUserDto {
	@IsNotEmpty()
	@ApiProperty({ example: 1, description: '用户ID' })
	userId: number;

	@IsNotEmpty()
	@ApiProperty({ example: 1, description: '用户状态', enum: UserStatus })
	status: number;
}

export class GetRolesByIdDto {
	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	@ApiProperty({ example: 1, description: '用户ID' })
	userId: number;

	@ApiProperty({ example: 2, description: '系统ID' })
	systemId?: number;
}

export interface IBathRole {
	systemId: number;
	roleIds: number[];
}

export class SetRolesDto {
	@IsNotEmpty()
	@ApiProperty({ example: 1, description: '用户ID' })
	userId: number;

	@IsNotEmpty()
	@ApiProperty({ example: 2, description: '系统id角色集合' })
	bathRoles: IBathRole[];
}

export class GetPrivilegeListDto {
	@ApiProperty({ example: 1, description: '用户ID' })
	@IsNotEmpty()
	userId: number;

	@IsNotEmpty()
	@ApiProperty({ example: '2', description: '系统ID' })
	systemId: number;
}

export class UserListWithPaginationDto {
	@ApiProperty({ example: '', description: '查询关键词' })
	keyword?: string;

	@ApiProperty({ example: { pageSize: 10, currentPage: 1 } })
	page?: PaginationParams;
}

export class GithubUserInfo {
	accessToken?: string;
	email?: string;
	avatarUrl?: string;
	avatar_url?: string;
	avatarThumb?: string;
	avatarBig?: string;
	avatarMiddle?: string;
	mobile?: string;
	enName?: string;
	name?: string;
}
export class CreateUserDto {
	@ApiProperty({ description: '用户的姓名' })
	@IsString()
	name: string;

	@ApiProperty({ description: '密码' })
	@MinLength(8, { message: '密码长度不能少于8位' })
	@IsString()
	password: string;

	@ApiProperty({ description: '电话' })
	@IsOptional()
	@IsString()
	phone?: string;

	@ApiProperty({ description: '用户名' })
	@MinLength(8, { message: '账号长度不能少于8位' })
	@IsString()
	username: string;

	@ApiProperty({ description: '邮箱' })
	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	avatarUrl?: string;

	@IsOptional()
	@IsString()
	avatarThumb?: string;

	@IsOptional()
	@IsString()
	avatarBig?: string;

	@IsOptional()
	@IsString()
	avatarMiddle?: string;

	@IsOptional()
	@IsString()
	mobile?: string;

	@IsOptional()
	@IsString()
	enName?: string;

	@IsOptional()
	@IsString()
	feishuUnionId?: string;

	@IsOptional()
	@IsString()
	feishuUserId?: string;

	@IsOptional()
	@IsString()
	departmentName?: string;

	@IsOptional()
	@IsString()
	departmentId?: string;

	@IsOptional()
	@IsEnum(UserStatus)
	status?: UserStatus;
}
