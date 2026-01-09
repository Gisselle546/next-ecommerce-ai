import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { TokenResponse } from './interfaces/jwt-payload.interface';
import { User } from '../users/entities/user.entity';
import { randomBytes, createHash, randomUUID } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

// TTL constants in milliseconds (cache-manager v5 uses ms)
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 604800000

/**
 * SHA-256 hash helper - used to store tokens securely
 * Never store raw tokens in Redis/DB
 */
function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Generate verification token (store hash in DB, send raw to user)
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenHash = sha256(verificationToken);

    // Create user with hashed token
    await this.usersService.create({
      ...registerDto,
      verificationToken: verificationTokenHash,
    });

    // NOTE: Send `verificationToken` (raw) to user via email
    // The DB only stores the hash for security

    // TODO: Queue verification email
    // await this.emailQueue.sendVerificationEmail(user.email, verificationToken);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    // Hash the provided token to compare against stored hash
    const tokenHash = sha256(verifyEmailDto.token);
    const user = await this.usersService.findByVerificationToken(tokenHash);

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Update user
    await this.usersService.update(user.id, {
      isVerified: true,
      verificationToken: null,
    });

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async login(loginDto: LoginDto): Promise<TokenResponse> {
    // Find user
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    // Check if user is active (not banned)
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account has been deactivated. Please contact support.',
      );
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Store HASH of refresh token in Redis (never store raw token)
    await this.cacheManager.set(
      `refresh_token_hash:${user.id}`,
      sha256(tokens.refreshToken),
      SEVEN_DAYS_MS,
    );

    return tokens;
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    // Verify the refresh token JWT signature
    let payload: { sub: string; jti?: string };
    try {
      payload = await this.jwtService.verifyAsync<{
        sub: string;
        jti?: string;
      }>(refreshToken, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const userId = payload.sub;

    // Get stored refresh token HASH from Redis and compare
    const storedHash = await this.cacheManager.get<string>(
      `refresh_token_hash:${userId}`,
    );

    if (!storedHash || storedHash !== sha256(refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Find user
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if user is still active
    if (!user.isActive) {
      // Remove the refresh token from Redis for banned users
      await this.cacheManager.del(`refresh_token:${userId}`);
      throw new UnauthorizedException('Account has been deactivated');
    }

    // Check if user is still verified
    if (!user.isVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    // Generate new tokens (rotation)
    const tokens = await this.generateTokens(user);

    // Update refresh token HASH in Redis (rotation)
    await this.cacheManager.set(
      `refresh_token_hash:${user.id}`,
      sha256(tokens.refreshToken),
      SEVEN_DAYS_MS,
    );

    return tokens;
  }

  async logout(userId: string): Promise<{ message: string }> {
    // Remove refresh token hash from Redis
    await this.cacheManager.del(`refresh_token_hash:${userId}`);

    return { message: 'Logged out successfully' };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);

    // Don't reveal if user exists or not
    if (!user) {
      return {
        message: 'If an account exists, a password reset email has been sent.',
      };
    }

    // Generate reset token (store hash in DB, send raw to user)
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = sha256(resetToken);
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    // Save HASHED reset token
    await this.usersService.update(user.id, {
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: resetExpires,
    });

    // NOTE: Send `resetToken` (raw) to user via email
    // The DB only stores the hash for security

    // TODO: Queue password reset email
    // await this.emailQueue.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: 'If an account exists, a password reset email has been sent.',
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    // Hash the provided token to compare against stored hash
    const tokenHash = sha256(resetPasswordDto.token);
    const user = await this.usersService.findByResetToken(tokenHash);

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Update password
    await this.usersService.update(user.id, {
      password: resetPasswordDto.newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    // Invalidate all refresh tokens
    await this.cacheManager.del(`refresh_token_hash:${user.id}`);

    return { message: 'Password reset successfully. Please log in.' };
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async generateTokens(user: User): Promise<TokenResponse> {
    // Access token includes role for authorization checks
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Refresh token is minimal - only sub + jti for revocation
    const refreshPayload = {
      sub: user.id,
      jti: randomUUID(), // Unique token ID for tracking/revocation
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
        expiresIn: this.configService.getOrThrow('jwt.accessExpiration'),
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.configService.getOrThrow('jwt.refreshExpiration'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
