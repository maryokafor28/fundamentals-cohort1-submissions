import { LegacyPayment, LegacyCustomer, ModernPayment, ModernCustomer } from '../types';
import logger from '../config/logger';

/**
 * Data Transformation Service
 * 
 * Transforms legacy data formats into modern, cleaned, and enhanced formats
 * Handles:
 * - Data structure modernization
 * - Field mapping and renaming
 * - Data enrichment
 * - Type conversion
 * - Validation and sanitization
 */
class TransformService {
  /**
   * Transform legacy payment to modern format
   * 
   * Legacy format (JSONPlaceholder post):
   * { id, userId, title, body }
   * 
   * Modern format:
   * { id, customerId, description, amount, status, currency, createdAt, metadata }
   */
  transformPayment(legacyPayment: LegacyPayment): ModernPayment {
    // Generate realistic mock amount based on ID (for demo purposes)
    const amount = this.generateMockAmount(legacyPayment.id);
    
    // Determine status based on various factors (for demo)
    const status = this.generatePaymentStatus(legacyPayment.id);

    const transformed: ModernPayment = {
      id: `PAY-${String(legacyPayment.id).padStart(6, '0')}`,
      customerId: `CUST-${String(legacyPayment.userId).padStart(6, '0')}`,
      description: this.cleanDescription(legacyPayment.title),
      amount: amount,
      status: status,
      currency: 'USD',
      createdAt: this.generateCreatedDate(legacyPayment.id),
      metadata: {
        source: 'legacy',
        transformedAt: new Date().toISOString(),
      },
    };

    logger.debug(`Transformed payment ${legacyPayment.id} to ${transformed.id}`);
    return transformed;
  }

  /**
   * Transform legacy customer to modern format
   */
  transformCustomer(legacyCustomer: LegacyCustomer): ModernCustomer {
    const transformed: ModernCustomer = {
      id: `CUST-${String(legacyCustomer.id).padStart(6, '0')}`,
      fullName: legacyCustomer.name,
      email: legacyCustomer.email.toLowerCase(),
      phone: this.formatPhoneNumber(legacyCustomer.phone),
      location: {
        city: legacyCustomer.address.city,
        zipCode: legacyCustomer.address.zipcode,
      },
      company: legacyCustomer.company ? {
        name: legacyCustomer.company.name,
        tagline: legacyCustomer.company.catchPhrase,
      } : undefined,
      registeredAt: this.generateRegistrationDate(legacyCustomer.id),
      metadata: {
        source: 'legacy',
        legacyId: legacyCustomer.id,
      },
    };

    logger.debug(`Transformed customer ${legacyCustomer.id} to ${transformed.id}`);
    return transformed;
  }

  /**
   * Transform multiple payments
   */
  transformPayments(legacyPayments: LegacyPayment[]): ModernPayment[] {
    logger.info(`Transforming ${legacyPayments.length} payments`);
    return legacyPayments.map(payment => this.transformPayment(payment));
  }

  /**
   * Transform multiple customers
   */
  transformCustomers(legacyCustomers: LegacyCustomer[]): ModernCustomer[] {
    logger.info(`Transforming ${legacyCustomers.length} customers`);
    return legacyCustomers.map(customer => this.transformCustomer(customer));
  }

  /**
   * Enrich payment with customer data
   */
  enrichPaymentWithCustomer(
    payment: ModernPayment,
    customer: ModernCustomer | null
  ): ModernPayment & { customer?: ModernCustomer } {
    if (!customer) {
      return payment;
    }

    return {
      ...payment,
      customer,
    };
  }

  /**
   * Calculate payment statistics
   */
  calculatePaymentStats(payments: ModernPayment[]): {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    totalAmount: number;
    averageAmount: number;
  } {
    const stats = {
      total: payments.length,
      completed: payments.filter(p => p.status === 'completed').length,
      pending: payments.filter(p => p.status === 'pending').length,
      failed: payments.filter(p => p.status === 'failed').length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      averageAmount: 0,
    };

    stats.averageAmount = stats.total > 0 ? stats.totalAmount / stats.total : 0;

    return stats;
  }

  // ============ Private Helper Methods ============

  /**
   * Clean and truncate description
   */
  private cleanDescription(title: string): string {
    // Capitalize first letter, clean whitespace
    const cleaned = title.trim().replace(/\s+/g, ' ');
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  /**
   * Generate mock amount for demo (deterministic based on ID)
   */
  private generateMockAmount(id: number): number {
    // Generate realistic amounts between $10 and $5000
    const seed = id * 137; // Use prime number for distribution
    const amount = (seed % 4990) + 10;
    return Math.round(amount * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Generate payment status (for demo)
   */
  private generatePaymentStatus(id: number): 'pending' | 'completed' | 'failed' {
    const rand = id % 10;
    if (rand === 0) return 'failed';
    if (rand <= 2) return 'pending';
    return 'completed';
  }

  /**
   * Format phone number to consistent format
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX if possible
    if (cleaned.length >= 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }
    
    return phone; // Return original if can't format
  }

  /**
   * Generate realistic created date (for demo)
   */
  private generateCreatedDate(id: number): string {
    // Generate dates within last 90 days
    const now = new Date();
    const daysAgo = id % 90;
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return date.toISOString();
  }

  /**
   * Generate realistic registration date (for demo)
   */
  private generateRegistrationDate(id: number): string {
    // Generate dates within last 2 years
    const now = new Date();
    const daysAgo = (id * 73) % 730; // 2 years
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return date.toISOString();
  }

  /**
   * Validate transformed payment
   */
  validatePayment(payment: ModernPayment): boolean {
    return (
      !!payment.id &&
      !!payment.customerId &&
      !!payment.description &&
      payment.amount > 0 &&
      ['pending', 'completed', 'failed'].includes(payment.status)
    );
  }

  /**
   * Validate transformed customer
   */
  validateCustomer(customer: ModernCustomer): boolean {
    return (
      !!customer.id &&
      !!customer.fullName &&
      !!customer.email &&
      !!customer.location.city
    );
  }
}

// Export singleton instance
export const transformService = new TransformService();