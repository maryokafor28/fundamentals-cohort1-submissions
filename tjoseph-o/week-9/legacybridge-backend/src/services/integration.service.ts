import { LegacyApiClient } from './legacyApi.service';
import { TransformationService } from './transformation.service';
import { CacheFactory, CacheService } from './cache.service';
import { ModernPayment, ModernCustomer } from '../types';
import { logger } from '../utils/logger';

export class IntegrationService {
  private legacyApiClient: LegacyApiClient;
  private transformationService: TransformationService;
  private cache: CacheService;

  constructor() {
    this.legacyApiClient = new LegacyApiClient();
    this.transformationService = new TransformationService();
    this.cache = CacheFactory.getInstance();
  }

  /**
   * Get all payments in modern format with caching
   */
  async getModernPayments(): Promise<{ data: ModernPayment[]; cached: boolean }> {
    const cacheKey = 'payments:all';

    try {
      // Try cache first
      const cachedData = await this.cache.get(cacheKey);
      if (cachedData) {
        logger.info('Returning cached payments');
        return {
          data: JSON.parse(cachedData),
          cached: true,
        };
      }

      // Fetch from legacy API
      logger.info('Fetching payments from legacy API');
      const legacyPayments = await this.legacyApiClient.getPayments();

      // Transform to modern format
      const modernPayments = this.transformationService.transformPayments(legacyPayments);

      // Cache the result
      await this.cache.set(cacheKey, JSON.stringify(modernPayments));

      return {
        data: modernPayments,
        cached: false,
      };
    } catch (error) {
      logger.error('Error fetching modern payments', error);
      throw error;
    }
  }

  /**
   * Get single payment by ID in modern format with caching
   */
  async getModernPaymentById(id: number): Promise<{ data: ModernPayment; cached: boolean }> {
    const cacheKey = `payment:${id}`;

    try {
      // Try cache first
      const cachedData = await this.cache.get(cacheKey);
      if (cachedData) {
        logger.info(`Returning cached payment ${id}`);
        return {
          data: JSON.parse(cachedData),
          cached: true,
        };
      }

      // Fetch from legacy API
      logger.info(`Fetching payment ${id} from legacy API`);
      const legacyPayment = await this.legacyApiClient.getPaymentById(id);

      // Transform to modern format
      const modernPayment = this.transformationService.transformPayment(legacyPayment);

      // Cache the result
      await this.cache.set(cacheKey, JSON.stringify(modernPayment));

      return {
        data: modernPayment,
        cached: false,
      };
    } catch (error) {
      logger.error(`Error fetching modern payment ${id}`, error);
      throw error;
    }
  }

  /**
   * Get all customers in modern format with caching
   */
  async getModernCustomers(): Promise<{ data: ModernCustomer[]; cached: boolean }> {
    const cacheKey = 'customers:all';

    try {
      // Try cache first
      const cachedData = await this.cache.get(cacheKey);
      if (cachedData) {
        logger.info('Returning cached customers');
        return {
          data: JSON.parse(cachedData),
          cached: true,
        };
      }

      // Fetch from legacy API
      logger.info('Fetching customers from legacy API');
      const legacyCustomers = await this.legacyApiClient.getCustomers();

      // Transform to modern format
      const modernCustomers = this.transformationService.transformCustomers(legacyCustomers);

      // Cache the result
      await this.cache.set(cacheKey, JSON.stringify(modernCustomers));

      return {
        data: modernCustomers,
        cached: false,
      };
    } catch (error) {
      logger.error('Error fetching modern customers', error);
      throw error;
    }
  }

  /**
   * Get single customer by ID in modern format with caching
   */
  async getModernCustomerById(id: number): Promise<{ data: ModernCustomer; cached: boolean }> {
    const cacheKey = `customer:${id}`;

    try {
      // Try cache first
      const cachedData = await this.cache.get(cacheKey);
      if (cachedData) {
        logger.info(`Returning cached customer ${id}`);
        return {
          data: JSON.parse(cachedData),
          cached: true,
        };
      }

      // Fetch from legacy API
      logger.info(`Fetching customer ${id} from legacy API`);
      const legacyCustomer = await this.legacyApiClient.getCustomerById(id);

      // Transform to modern format
      const modernCustomer = this.transformationService.transformCustomer(legacyCustomer);

      // Cache the result
      await this.cache.set(cacheKey, JSON.stringify(modernCustomer));

      return {
        data: modernCustomer,
        cached: false,
      };
    } catch (error) {
      logger.error(`Error fetching modern customer ${id}`, error);
      throw error;
    }
  }

  /**
   * Get payments for a specific customer with caching
   */
  async getModernPaymentsByCustomerId(
    customerId: number
  ): Promise<{ data: ModernPayment[]; cached: boolean }> {
    const cacheKey = `payments:customer:${customerId}`;

    try {
      // Try cache first
      const cachedData = await this.cache.get(cacheKey);
      if (cachedData) {
        logger.info(`Returning cached payments for customer ${customerId}`);
        return {
          data: JSON.parse(cachedData),
          cached: true,
        };
      }

      // Fetch from legacy API
      logger.info(`Fetching payments for customer ${customerId} from legacy API`);
      const legacyPayments = await this.legacyApiClient.getPaymentsByCustomerId(customerId);

      // Transform to modern format
      const modernPayments = this.transformationService.transformPayments(legacyPayments);

      // Cache the result
      await this.cache.set(cacheKey, JSON.stringify(modernPayments));

      return {
        data: modernPayments,
        cached: false,
      };
    } catch (error) {
      logger.error(`Error fetching modern payments for customer ${customerId}`, error);
      throw error;
    }
  }

  /**
   * Clear all cache
   */
  async clearCache(): Promise<void> {
    logger.info('Clearing all cache');
    await this.cache.clear();
  }
}