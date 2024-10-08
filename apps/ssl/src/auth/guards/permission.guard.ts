import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../microservices/user.service';
import { IS_PUBLIC_KEY } from '@app/common';

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private userService: UserService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const loginAuth = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		if (loginAuth) return true;

		const request = context.switchToHttp().getRequest();
		const user: IPayloadUser = request.user;
		const codes = await this.userService.getUser(user);
		return codes;
	}
}
