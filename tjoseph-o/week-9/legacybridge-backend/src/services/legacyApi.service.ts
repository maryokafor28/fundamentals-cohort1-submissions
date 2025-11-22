import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import { LegacyApiError, LegacyPayment, LegacyCustomer } from '../types';

export class LegacyApiClient {
  private client: AxiosInstance;
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  constructor() {
    this.maxRetries = config.legacy.maxRetries;
    this.retryDelay = config.legacy.retryDelay;

    this.client = axios.create({
      baseURL: config.legacy.baseUrl,
      timeout: config.legacy.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Legacy API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Legacy API Request Error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`Legacy API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('Legacy API Response Error', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number = this.maxRetries
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries <= 0) {
        throw error;
      }

      const axiosError = error as AxiosError;
      
      // Retry on network errors or 5xx server errors
      const shouldRetry =
        !axiosError.response ||
        (axiosError.response.status >= 500 && axiosError.response.status < 600) ||
        axiosError.code === 'ECONNABORTED' ||
        axiosError.code === 'ETIMEDOUT';

      if (!shouldRetry) {
        throw error;
      }

      const delay = this.retryDelay * (this.maxRetries - retries + 1); // Exponential backoff
      logger.warn(`Retrying request in ${delay}ms. Retries left: ${retries - 1}`);
      
      await this.sleep(delay);
      return this.retryRequest(requestFn, retries - 1);
    }
  }

  async getPayments(): Promise<LegacyPayment[]> {
    try {
      const response = await this.retryRequest(() =>
        this.client.get<LegacyPayment[]>('/posts')
      );
      
      logger.info(`Fetched ${response.data.length} payments from legacy API`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new LegacyApiError(
        axiosError.response?.status || 500,
        'Failed to fetch payments from legacy API',
        error
      );
    }
  }

  async getPaymentById(id: number): Promise<LegacyPayment> {
    try {
      const response = await this.retryRequest(() =>
        this.client.get<LegacyPayment>(`/posts/${id}`)
      );
      
      logger.info(`Fetched payment ${id} from legacy API`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 404) {
        throw new LegacyApiError(404, `Payment ${id} not found`);
      }
      
      throw new LegacyApiError(
        axiosError.response?.status || 500,
        `Failed to fetch payment ${id} from legacy API`,
        error
      );
    }
  }

  async getCustomers(): Promise<LegacyCustomer[]> {
    try {
      const response = await this.retryRequest(() =>
        this.client.get<LegacyCustomer[]>('/users')
      );
      
      logger.info(`Fetched ${response.data.length} customers from legacy API`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new LegacyApiError(
        axiosError.response?.status || 500,
        'Failed to fetch customers from legacy API',
        error
      );
    }
  }

  async getCustomerById(id: number): Promise<LegacyCustomer> {
    try {
      const response = await this.retryRequest(() =>
        this.client.get<LegacyCustomer>(`/users/${id}`)
      );
      
      logger.info(`Fetched customer ${id} from legacy API`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 404) {
        throw new LegacyApiError(404, `Customer ${id} not found`);
      }
      
      throw new LegacyApiError(
        axiosError.response?.status || 500,
        `Failed to fetch customer ${id} from legacy API`,
        error
      );
    }
  }

  async getPaymentsByCustomerId(customerId: number): Promise<LegacyPayment[]> {
    try {
      const response = await this.retryRequest(() =>
        this.client.get<LegacyPayment[]>(`/posts?userId=${customerId}`)
      );
      
      logger.info(`Fetched ${response.data.length} payments for customer ${customerId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new LegacyApiError(
        axiosError.response?.status || 500,
        `Failed to fetch payments for customer ${customerId}`,
        error
      );
    }
  }
}