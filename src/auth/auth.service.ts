import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Signup
  async signup(signupDto: SignupDto): Promise<{
    message: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  }> {
    const { name, email, password } = signupDto;

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user: Partial<User> = {
      name,
      email,
      password: hashedPassword,
    };

    const savedUser = await this.userService.create(user as any);

    return {
      message: 'Signup successful',
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
      },
    };
  }

  // Login
  async login(loginDto: LoginDto): Promise<{
    message: string;
    access_token: string;
    expires_in: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  }> {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare plain password with hashed password from DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // Generate token
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      access_token: token,
      expires_in: '10s', // token expires in 1 hour
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}