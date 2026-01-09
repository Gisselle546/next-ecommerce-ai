import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { JwtRefreshPayload } from '../interfaces/jwt-payload.interface';

/**
 * NOTE: This strategy is currently NOT USED.
 *
 * The /auth/refresh endpoint accepts refresh token in the request BODY,
 * and auth.service.ts manually verifies it with jwtService.verifyAsync().
 *
 * This strategy extracts from Bearer header, which doesn't match.
 *
 * Options to align:
 * - Option A: Switch to HttpOnly cookies (most secure for web apps)
 * - Option B: Keep body-based approach (current) - this file is unused
 * - Option C: Send refresh token as Bearer header and use this strategy
 *
 * Current implementation uses Option B (body + manual verify + hash comparison).
 * This file is kept for reference if you want to switch approaches.
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.refreshSecret'),
    });
  }

  async validate(payload: JwtRefreshPayload) {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    return user;
  }
}
