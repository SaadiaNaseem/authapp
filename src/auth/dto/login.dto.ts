import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Valid email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}