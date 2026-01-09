import { UserRole } from '../../users/entities/user.entity';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  jti: string; // token id (recommended)
}

export interface JwtRefreshPayload {
  sub: string; // user id
  jti: string; // token id (recommended)
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
