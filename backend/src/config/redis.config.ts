import { registerAs } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

export default registerAs(
  'redis',
  (): CacheModuleOptions => ({
    store: redisStore as any,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    ttl: 60 * 60, // 1 hour default TTL (in seconds)
    max: 100, // Maximum number of items in cache
    db: parseInt(process.env.REDIS_DB!, 10) || 0,
  }),
);

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB!, 10) || 0,
};
