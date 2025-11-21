import { legacyService } from "./legacy.service";
import { getCache, setCache } from "../utils/cache.util";
import { CustomerTransformer } from "../transformers/customer.transformer";
import { LegacyError } from "../errors/LegacyError";

const CACHE_NAMESPACE = "customers";

class CustomerService {
  /**
   * Fetch all customers
   */
  async getAllCustomers() {
    const cacheKey = `${CACHE_NAMESPACE}:all`;
    const cached = getCache(cacheKey);
    if (cached) {
      console.log(`✅ Cache hit: ${cacheKey}`);
      return cached;
    }

    try {
      const legacyData = await legacyService.fetchCustomers();
      const transformed = legacyData.map(CustomerTransformer.toModern);

      // Cache the transformed data
      setCache(cacheKey, transformed);

      return transformed;
    } catch (error) {
      if (error instanceof LegacyError) {
        throw error; // propagate legacy-specific errors
      }
      console.error("❌ Unexpected error in getAllCustomers:", error);
      throw new Error(
        `Failed to fetch customers: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Fetch a single customer by ID
   */
  async getCustomerById(id: string | number) {
    const cacheKey = `${CACHE_NAMESPACE}:${id}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    try {
      const legacyData = await legacyService.fetchCustomerById(id);
      const transformed = CustomerTransformer.toModern(legacyData);

      // Cache the transformed data
      setCache(cacheKey, transformed);

      return transformed;
    } catch (error) {
      if (error instanceof LegacyError) {
        throw error;
      }
      throw new Error(`Failed to fetch customer with id ${id}`);
    }
  }
}

export const customerService = new CustomerService();
