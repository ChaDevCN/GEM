import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: '用户名长度为8-50位' })
  @Length(8, 50)
  username: string;

  @IsNotEmpty()
  @Length(8, 50)
  password: string;

  @IsEmail({}, { message: '无效的电子邮件地址' })
  @IsNotEmpty({ message: '电子邮件不能为空' })
  @Length(10, 100, { message: '电子邮件必须在10到100字符之间' })
  email: string;

  @IsNotEmpty({ message: '昵称长度为2-10位' })
  @Length(2, 10)
  nickName: string;
}
