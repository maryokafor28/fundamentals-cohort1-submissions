import { legacyService } from "./legacy.service";
import { getCache, setCache } from "../utils/cache.util";
import { PaymentTransformer } from "../transformers/payment.transformer";
import { LegacyError } from "../errors/LegacyError";

const CACHE_NAMESPACE = "payments";

class PaymentService {
  /**
   * Fetch all payments
   */
  async getAllPayments() {
    const cacheKey = `${CACHE_NAMESPACE}:all`;
    const cached = getCache(cacheKey);

    if (cached) {
      console.log(`✅ Cache hit: ${cacheKey}`);
      return cached;
    }

    try {
      const legacyData = await legacyService.fetchPayments();
      const transformed = legacyData.map(PaymentTransformer.toModern);

      setCache(cacheKey, transformed);

      return transformed;
    } catch (error) {
      if (error instanceof LegacyError) {
        throw error;
      }

      console.error("❌ Unexpected error in getAllPayments:", error);
      throw new Error(
        `Failed to fetch payments: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Fetch a payment by ID
   */
  async getPaymentById(id: string | number) {
    const cacheKey = `${CACHE_NAMESPACE}:${id}`;
    const cached = getCache(cacheKey);

    if (cached) {
      console.log(`✅ Cache hit: ${cacheKey}`);
      return cached;
    }

    try {
      const legacyData = await legacyService.fetchPaymentById(id);
      const transformed = PaymentTransformer.toModern(legacyData);

      setCache(cacheKey, transformed);

      return transformed;
    } catch (error) {
      if (error instanceof LegacyError) {
        throw error;
      }

      console.error(`❌ Unexpected error in getPaymentById(${id}):`, error);
      throw new Error(
        `Failed to fetch payment ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export const paymentService = new PaymentService();
