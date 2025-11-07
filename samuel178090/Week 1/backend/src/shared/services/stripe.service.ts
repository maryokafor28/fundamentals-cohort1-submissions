import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import appConfig from '../../config/config';

export interface CheckoutItem {
  productId: string;
  skuPriceId: string;
  quantity: number;
  price: number;
  productName: string;
  lifetime: boolean;
  validity: number;
}

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(appConfig.stripe.secret_key, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createCheckoutSession(
    items: CheckoutItem[],
    userId: string,
    customerEmail: string,
  ): Promise<{ url: string; sessionId: string }> {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.productName,
          metadata: {
            productId: item.productId,
            lifetime: item.lifetime.toString(),
            validity: item.validity.toString(),
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: appConfig.stripe.successUrl,
      cancel_url: appConfig.stripe.cancelUrl,
      customer_email: customerEmail,
      metadata: {
        userId,
        items: JSON.stringify(items),
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    return {
      url: session.url || '',
      sessionId: session.id,
    };
  }

  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }

  async constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
  ): Promise<Stripe.Event> {
    const webhookSecret: string = appConfig.stripe.webhookSecret;
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  async createProduct(name: string, description: string): Promise<Stripe.Product> {
    return await this.stripe.products.create({
      name,
      description,
    });
  }

  async createPrice(
    productId: string,
    unitAmount: number,
    currency: string = 'usd',
  ): Promise<Stripe.Price> {
    return await this.stripe.prices.create({
      product: productId,
      unit_amount: Math.round(unitAmount * 100),
      currency,
    });
  }

  async updateProduct(
    productId: string,
    updates: Partial<Stripe.ProductUpdateParams>,
  ): Promise<Stripe.Product> {
    return await this.stripe.products.update(productId, updates);
  }

  async deleteProduct(productId: string): Promise<Stripe.DeletedProduct> {
    return await this.stripe.products.del(productId);
  }
}