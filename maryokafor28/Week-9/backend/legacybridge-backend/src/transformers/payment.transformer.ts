import { LegacyPost } from "../types/legacy.types";
import { ModernPayment, PaymentStatus } from "../types/modern.types";

/**
 * Converts a legacy post object from JSONPlaceholder
 * into a modern payment object.
 */
export class PaymentTransformer {
  static toModern(legacy: LegacyPost): ModernPayment {
    // Simulate a payment status
    const statuses: PaymentStatus[] = ["pending", "completed", "failed"];
    const randomStatus = statuses[legacy.id % statuses.length];

    return {
      id: legacy.id,
      customerId: legacy.userId,
      amount: parseFloat((Math.random() * 1000).toFixed(2)), // Random amount
      currency: "Naira",
      status: randomStatus,
      description: legacy.title,
      createdAt: new Date().toISOString(),
    };
  }
}
