/*
 * @Author: Charlie <charlie.l1u@outlook.com>
 * @Date: 2024-08-24 22:19:36
 * @LastEditors: Charlie <charlie.l1u@outlook.com>
 * @LastEditTime: 2024-08-25 20:58:04
 * @FilePath: \GEM\apps\userServer\src\auth\auth.controller.ts
 * @Description: Willing to work myself to death, just to outperform others.
 */
import { Controller, Post, UseGuards, Res, Get } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '@app/comm';
import { PayloadUser, getEnv } from '@app/common';
import { LocalGuard } from './guards/local.guard';
import { GoogleGuard } from './guards/google.guard';

@ApiTags('用户认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get('/test')
  @Public()
  test() {
    return 123;
  }

  @ApiOperation({
    summary: '用户密码登录',
  })
  @Public()
  @UseGuards(LocalGuard)
  @Post('/login')
  async UserLogin(
    @PayloadUser() user: IPayloadUser,
    @Res({ passthrough: true }) response,
  ) {
    const { access_token } = await this.authService.login(user);
    const isProd = getEnv();

    response.cookie('jwt', access_token, {
      path: '/',
      httpOnly: true,
      domain: isProd === 'prod' ? '.ig-space.com' : undefined,
    });

    return { userInfo: user, access_token };
  }

  @ApiOperation({
    summary: 'Google OAUTH 授权',
  })
  @Public()
  @UseGuards(GoogleGuard)
  @Get('/oauth/google')
  @ApiQuery({ name: 'code', description: '授权回调 code' })
  async OAuthGoogle(
    @PayloadUser() user: IPayloadUser,
    @Res({ passthrough: true }) response,
  ) {
    const { access_token } = await this.authService.login(user);

    response.cookie('jwt', access_token, {
      path: '/',
      httpOnly: true,
      domain: '.ig-space.com',
    });

    return access_token;
  }

  @ApiOperation({
    summary: '登出',
    description: '服务器端清除 jwt cookies',
  })
  @Post('logout')
  async logout(@Res({ passthrough: true }) response) {
    response.setCookie('jwt', '');
    return {};
  }

  @ApiOperation({
    summary: '解密 token 包含的信息',
    description: '解密 token 包含的信息',
  })
  @Get('/token/info')
  async getTokenInfo(@PayloadUser() user: IPayloadUser) {
    return user;
  }
}
