import { registerAs } from '@nestjs/config';

const getRequiredEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export default registerAs('jwt', () => ({
  accessSecret: getRequiredEnvVar('JWT_ACCESS_SECRET'),
  refreshSecret: getRequiredEnvVar('JWT_REFRESH_SECRET'),
  accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));

export interface JwtConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpiration: string;
  refreshExpiration: string;
}
