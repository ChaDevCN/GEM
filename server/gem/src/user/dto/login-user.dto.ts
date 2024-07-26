import { IsNotEmpty, Length } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @Length(6, 50)
  username: string;

  @IsNotEmpty()
  @Length(8, 50)
  password: string;
}
