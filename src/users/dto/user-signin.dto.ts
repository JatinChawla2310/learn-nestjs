import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserSigninDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(5, { message: 'Password minimum character should be 5' })
  password: string;
}
