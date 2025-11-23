import {
  LegacyPayment,
  LegacyCustomer,
  ModernPayment,
  ModernCustomer,
  TransformationError,
} from '../types';
import { logger } from '../utils/logger';

export class TransformationService {
  /**
   * Transform legacy payment to modern payment format
   */
  transformPayment(legacyPayment: LegacyPayment): ModernPayment {
    try {
      // Simulate extracting amount from title/body (in real scenario, this would be structured)
      const amount = this.extractAmount(legacyPayment.title, legacyPayment.body);
      const status = this.determinePaymentStatus(legacyPayment.id);

      return {
        id: `PAY-${legacyPayment.id.toString().padStart(8, '0')}`,
        customerId: `CUST-${legacyPayment.userId.toString().padStart(8, '0')}`,
        transactionId: `TXN-${Date.now()}-${legacyPayment.id}`,
        amount,
        currency: 'USD',
        status,
        description: this.sanitizeDescription(legacyPayment.title),
        metadata: {
          source: 'legacy-system',
          processingTime: this.calculateProcessingTime(),
        },
        createdAt: this.generateTimestamp(legacyPayment.id),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Payment transformation error', { legacyPayment, error });
      throw new TransformationError('Failed to transform payment', legacyPayment);
    }
  }

  /**
   * Transform legacy customer to modern customer format
   */
  transformCustomer(legacyCustomer: LegacyCustomer): ModernCustomer {
    try {
      return {
        id: `CUST-${legacyCustomer.id.toString().padStart(8, '0')}`,
        fullName: legacyCustomer.name,
        email: legacyCustomer.email.toLowerCase(),
        phoneNumber: this.formatPhoneNumber(legacyCustomer.phone),
        address: {
          street: `${legacyCustomer.address.street}, ${legacyCustomer.address.suite}`,
          city: legacyCustomer.address.city,
          postalCode: legacyCustomer.address.zipcode,
          coordinates: {
            latitude: parseFloat(legacyCustomer.address.geo.lat),
            longitude: parseFloat(legacyCustomer.address.geo.lng),
          },
        },
        company: legacyCustomer.company
          ? {
              name: legacyCustomer.company.name,
              description: legacyCustomer.company.catchPhrase,
            }
          : undefined,
        metadata: {
          username: legacyCustomer.username,
          website: legacyCustomer.website || undefined,
          registeredAt: this.generateTimestamp(legacyCustomer.id),
        },
      };
    } catch (error) {
      logger.error('Customer transformation error', { legacyCustomer, error });
      throw new TransformationError('Failed to transform customer', legacyCustomer);
    }
  }

  /**
   * Transform multiple payments
   */
  transformPayments(legacyPayments: LegacyPayment[]): ModernPayment[] {
    return legacyPayments
      .map((payment) => {
        try {
          return this.transformPayment(payment);
        } catch (error) {
          logger.warn(`Skipping payment ${payment.id} due to transformation error`);
          return null;
        }
      })
      .filter((payment): payment is ModernPayment => payment !== null);
  }

  /**
   * Transform multiple customers
   */
  transformCustomers(legacyCustomers: LegacyCustomer[]): ModernCustomer[] {
    return legacyCustomers
      .map((customer) => {
        try {
          return this.transformCustomer(customer);
        } catch (error) {
          logger.warn(`Skipping customer ${customer.id} due to transformation error`);
          return null;
        }
      })
      .filter((customer): customer is ModernCustomer => customer !== null);
  }

  // Helper methods

  private extractAmount(title: string, body: string): number {
    // In real scenario, amount would be in a structured field
    // Here we simulate by using string length as a pseudo-random amount
    const baseAmount = (title.length + body.length) % 1000;
    return parseFloat((baseAmount + 10.99).toFixed(2));
  }

  private determinePaymentStatus(id: number): 'pending' | 'completed' | 'failed' {
    // Simulate status based on ID (in reality, this would come from data)
    const statuses: Array<'pending' | 'completed' | 'failed'> = [
      'completed',
      'completed',
      'completed',
      'pending',
      'failed',
    ];
    return statuses[id % statuses.length];
  }

  private sanitizeDescription(description: string): string {
    // Remove any potentially problematic characters
    return description
      .replace(/[<>]/g, '')
      .substring(0, 200)
      .trim();
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as international or keep original if already formatted
    if (cleaned.length === 10) {
      return `+1-${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    
    return phone;
  }

  private calculateProcessingTime(): number {
    // Simulate processing time (in ms)
    return Math.floor(Math.random() * 500) + 100;
  }

  private generateTimestamp(id: number): string {
    // Generate a pseudo-timestamp based on ID (older IDs = older dates)
    const now = Date.now();
    const daysAgo = (id % 365) * 24 * 60 * 60 * 1000;
    return new Date(now - daysAgo).toISOString();
  }
}