import axios, { AxiosInstance, AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import config from '../config';
import logger from '../config/logger';
import { LegacyPayment, LegacyCustomer, LegacyApiError } from '../types';
import { legacyApiCircuitBreaker } from '../utils/circuitBreaker';
import { retry } from '../utils/retry';
import { cacheService } from './cacheServices';

/**
 * Legacy API Service
 * 
 * Handles all communication with the legacy system
 * Implements:
 * - Retry logic with exponential backoff
 * - Circuit breaker pattern
 * - Caching for performance
 * - Comprehensive error handling
 * 
 * Using JSONPlaceholder as mock legacy API:
 * - /posts -> payments
 * - /users -> customers
 */
class LegacyApiService {
  private client: AxiosInstance;
  private readonly CACHE_PREFIX = 'legacy';

  constructor() {
    // Initialize axios client with default config
    this.client = axios.create({
      baseURL: config.legacyApi.baseUrl,
      timeout: config.legacyApi.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LegacyBridge/2.0',
      },
    });

    // Configure axios-retry for automatic retries
    axiosRetry(this.client, {
      retries: config.legacyApi.retryAttempts,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        // Retry on network errors or 5xx responses
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response?.status ? error.response.status >= 500 : false)
        );
      },
      onRetry: (retryCount, error, requestConfig) => {
        logger.warn(
          `Retry attempt ${retryCount} for ${requestConfig.url}`,
          { error: error.message }
        );
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Legacy API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Legacy API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(
          `Legacy API Response: ${response.status} ${response.config.url}`
        );
        return response;
      },
      (error) => {
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch all payments from legacy API
   * 
   * @param useCache - Whether to use cache (default: true)
   * @returns Array of legacy payments
   */
  async fetchPayments(useCache: boolean = true): Promise<LegacyPayment[]> {
    const cacheKey = 'payments:all';

    // Try cache first
    if (useCache) {
      const cached = await cacheService.get<LegacyPayment[]>(cacheKey, {
        prefix: this.CACHE_PREFIX,
      });

      if (cached) {
        logger.info('Payments fetched from cache');
        return cached;
      }
    }

    // Fetch from legacy API with circuit breaker
    const payments = await legacyApiCircuitBreaker.execute(
      async () => {
        logger.info('Fetching payments from legacy API');
        const response = await this.client.get<LegacyPayment[]>('/posts');
        return response.data;
      },
      () => {
        logger.warn('Circuit breaker open, returning empty payments');
        return [];
      }
    );

    // Cache the results
    if (payments.length > 0) {
      await cacheService.set(cacheKey, payments, {
        prefix: this.CACHE_PREFIX,
        ttl: 300, // 5 minutes
      });
    }

    return payments;
  }

  /**
   * Fetch single payment by ID
   */
  async fetchPaymentById(id: number, useCache: boolean = true): Promise<LegacyPayment | null> {
    const cacheKey = `payment:${id}`;

    if (useCache) {
      const cached = await cacheService.get<LegacyPayment>(cacheKey, {
        prefix: this.CACHE_PREFIX,
      });

      if (cached) {
        logger.info(`Payment ${id} fetched from cache`);
        return cached;
      }
    }

    try {
      const payment = await legacyApiCircuitBreaker.execute(async () => {
        logger.info(`Fetching payment ${id} from legacy API`);
        const response = await this.client.get<LegacyPayment>(`/posts/${id}`);
        return response.data;
      });

      if (payment) {
        await cacheService.set(cacheKey, payment, {
          prefix: this.CACHE_PREFIX,
          ttl: 600, // 10 minutes
        });
      }

      return payment;
    } catch (error) {
      logger.error(`Failed to fetch payment ${id}`, error);
      return null;
    }
  }

  /**
   * Fetch all customers from legacy API
   */
  async fetchCustomers(useCache: boolean = true): Promise<LegacyCustomer[]> {
    const cacheKey = 'customers:all';

    if (useCache) {
      const cached = await cacheService.get<LegacyCustomer[]>(cacheKey, {
        prefix: this.CACHE_PREFIX,
      });

      if (cached) {
        logger.info('Customers fetched from cache');
        return cached;
      }
    }

    const customers = await legacyApiCircuitBreaker.execute(
      async () => {
        logger.info('Fetching customers from legacy API');
        const response = await this.client.get<LegacyCustomer[]>('/users');
        return response.data;
      },
      () => {
        logger.warn('Circuit breaker open, returning empty customers');
        return [];
      }
    );

    if (customers.length > 0) {
      await cacheService.set(cacheKey, customers, {
        prefix: this.CACHE_PREFIX,
        ttl: 600, // 10 minutes (customers change less frequently)
      });
    }

    return customers;
  }

  /**
   * Fetch single customer by ID
   */
  async fetchCustomerById(id: number, useCache: boolean = true): Promise<LegacyCustomer | null> {
    const cacheKey = `customer:${id}`;

    if (useCache) {
      const cached = await cacheService.get<LegacyCustomer>(cacheKey, {
        prefix: this.CACHE_PREFIX,
      });

      if (cached) {
        logger.info(`Customer ${id} fetched from cache`);
        return cached;
      }
    }

    try {
      const customer = await legacyApiCircuitBreaker.execute(async () => {
        logger.info(`Fetching customer ${id} from legacy API`);
        const response = await this.client.get<LegacyCustomer>(`/users/${id}`);
        return response.data;
      });

      if (customer) {
        await cacheService.set(cacheKey, customer, {
          prefix: this.CACHE_PREFIX,
          ttl: 600,
        });
      }

      return customer;
    } catch (error) {
      logger.error(`Failed to fetch customer ${id}`, error);
      return null;
    }
  }

  /**
   * Fetch payments by customer ID
   */
  async fetchPaymentsByCustomerId(customerId: number): Promise<LegacyPayment[]> {
    const cacheKey = `payments:customer:${customerId}`;

    const cached = await cacheService.get<LegacyPayment[]>(cacheKey, {
      prefix: this.CACHE_PREFIX,
    });

    if (cached) {
      return cached;
    }

    try {
      const payments = await legacyApiCircuitBreaker.execute(async () => {
        const response = await this.client.get<LegacyPayment[]>('/posts', {
          params: { userId: customerId },
        });
        return response.data;
      });

      if (payments.length > 0) {
        await cacheService.set(cacheKey, payments, {
          prefix: this.CACHE_PREFIX,
          ttl: 300,
        });
      }

      return payments;
    } catch (error) {
      logger.error(`Failed to fetch payments for customer ${customerId}`, error);
      return [];
    }
  }

  /**
   * Health check for legacy API
   */
  async healthCheck(): Promise<{ status: 'up' | 'down'; responseTime: number }> {
    const startTime = Date.now();

    try {
      await this.client.get('/posts/1', { timeout: 5000 });
      const responseTime = Date.now() - startTime;

      logger.debug(`Legacy API health check: UP (${responseTime}ms)`);
      return { status: 'up', responseTime };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error('Legacy API health check: DOWN', error);
      return { status: 'down', responseTime };
    }
  }

  /**
   * Clear all cached legacy data
   */
  async clearCache(): Promise<void> {
    await cacheService.clearPrefix(this.CACHE_PREFIX);
    logger.info('Legacy API cache cleared');
  }

  /**
   * Handle and transform API errors
   */
  private handleApiError(error: AxiosError): void {
    if (error.response) {
      // Server responded with error status
      logger.error('Legacy API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });

      throw new LegacyApiError(
        `Legacy API returned ${error.response.status}`,
        error.response.status,
        'LEGACY_API_ERROR',
        error.response.data
      );
    } else if (error.request) {
      // Request made but no response
      logger.error('Legacy API No Response:', {
        url: error.config?.url,
        message: error.message,
      });

      throw new LegacyApiError(
        'Legacy API did not respond',
        503,
        'LEGACY_API_NO_RESPONSE',
        { message: error.message }
      );
    } else {
      // Request setup error
      logger.error('Legacy API Request Setup Error:', error.message);

      throw new LegacyApiError(
        'Failed to setup request to Legacy API',
        500,
        'LEGACY_API_REQUEST_ERROR',
        { message: error.message }
      );
    }
  }
}

// Export singleton instance
export const legacyApiService = new LegacyApiService();