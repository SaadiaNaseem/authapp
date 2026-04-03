import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Valid email is required' })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}