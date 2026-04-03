import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer token
      ignoreExpiration: false, // expired token reject karega
      secretOrKey: process.env.JWT_SECRET || 'topSecretKey',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}