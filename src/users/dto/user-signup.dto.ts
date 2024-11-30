import { IsNotEmpty, IsString } from 'class-validator';
import { UserSigninDto } from './user-signin.dto';

export class UserSignupDto extends UserSigninDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name should be string' })
  name: string;
}
