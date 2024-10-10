/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-24 22:23:37
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-24 22:23:55
 * @FilePath: \GEM\apps\user\src\user\oauth.service.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */
import { Injectable } from '@nestjs/common';
import { getGoogleUser } from '@app/common';

@Injectable()
export class OAuthService {
	async getGoogleUserToken(code: string) {
		const res: any = await getGoogleUser({ code });
		return res;
	}
}
