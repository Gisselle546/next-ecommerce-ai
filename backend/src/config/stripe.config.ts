import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  currency: process.env.STRIPE_CURRENCY || 'usd',
  apiVersion: '2023-10-16' as const,
}));

export interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
  currency: string;
  apiVersion: string;
}
