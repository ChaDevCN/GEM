import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.mysql.entity';
import { UserService } from '../user/user.service';
import { OAuthService } from '../user/oauth.service';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private oAuthService: OAuthService
	) {}

	async validateLocalUser({ username, password }): Promise<IPayloadUser> {
		const user: User = await this.userService.findUserByLocal({
			username,
			password
		});

		if (!user) return null;

		return {
			userId: user.id,
			username: user.username,
			name: user.name,
			email: user.email
		};
	}

	async validateGoogleUser(code: string): Promise<IPayloadUser> {
		const userInfo = await this.getGoogleOAuthToken(code);

		// 同步信息
		const user: User = await this.userService.createOrUpdateByOAoth({
			...userInfo,
			avatarUrl: userInfo.picture
		});

		return {
			userId: user.id,
			username: user.name,
			name: user.name,
			email: user.email
		};
	}

	async login(user: IPayloadUser) {
		return {
			access_token: this.jwtService.sign(user)
		};
	}

	async getGoogleOAuthToken(code: string) {
		const oauth = await this.oAuthService.getGoogleUserToken(code);
		return oauth;
	}
}
