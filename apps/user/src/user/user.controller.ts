import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { PayloadUser } from '@app/comm';
@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '用户信息',
  })
  @Post('/prpfile')
  profile(@PayloadUser() user: IPayloadUser) {
    return this.userService.profile(user.userId);
  }

  @ApiOperation({
    summary: '测试',
  })
  @Get('/')
  get() {
    return '123';
  }
}
