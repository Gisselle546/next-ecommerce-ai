import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    // For mock mode, we'll use test keys or skip real Stripe initialization
    const secretKey = this.configService.get<string>('stripe.secretKey');
    
    if (secretKey && secretKey !== 'mock') {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-12-15.clover',
      });
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>,
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const secretKey = this.configService.get<string>('stripe.secretKey');

    // Mock mode - return fake payment intent
    if (!secretKey || secretKey === 'mock') {
      return {
        clientSecret: `mock_secret_${Date.now()}`,
        paymentIntentId: `pi_mock_${Date.now()}`,
      };
    }

    // Real Stripe mode
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret || '',
      paymentIntentId: paymentIntent.id,
    };
  }

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    const secretKey = this.configService.get<string>('stripe.secretKey');

    // Mock mode - always successful
    if (!secretKey || secretKey === 'mock') {
      return true;
    }

    // Real Stripe mode
    const paymentIntent = await this.stripe.paymentIntents.retrieve(
      paymentIntentId,
    );

    return paymentIntent.status === 'succeeded';
  }

  async cancelPayment(paymentIntentId: string): Promise<void> {
    const secretKey = this.configService.get<string>('stripe.secretKey');

    if (!secretKey || secretKey === 'mock') {
      return; // No-op for mock
    }

    await this.stripe.paymentIntents.cancel(paymentIntentId);
  }
}
