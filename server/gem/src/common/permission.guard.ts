import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Permission } from 'src/user/entities/permission.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request?.user) {
      return true;
    }
    const roles = await this.userService.findRolesByIds(
      request.user.roles.map((item) => item.id),
    );

    const permissions: Permission[] = roles.reduce((total, current) => {
      total.push(...current.permissions);
      return total;
    }, []);

    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>('require-permission', [
        context.getClass(),
        context.getHandler(),
      ]) || [];

    for (let i = 0; i < requiredPermissions.length; i++) {
      const curPermission = requiredPermissions[i];
      const found = permissions.find((item) => item.name === curPermission);
      if (!found) {
        throw new HttpException('您没有访问该接口的权限', HttpStatus.FORBIDDEN);
      }
    }

    return true;
  }
}
