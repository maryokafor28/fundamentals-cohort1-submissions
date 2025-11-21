import axios, { AxiosError, AxiosInstance } from "axios";
import { config } from "../config/env.config";
import { retry } from "../utils/retry.util";
import { LegacyError } from "../errors/LegacyError";

export class LegacyService {
  private baseURL = config.legacy.baseUrl;
  private timeout = config.legacy.timeout;

  public client: AxiosInstance;

  constructor(client?: AxiosInstance) {
    // If a mock client is passed (in unit tests), use it.
    // Otherwise create the real axios instance.
    this.client =
      client ??
      axios.create({
        baseURL: this.baseURL,
        timeout: this.timeout,
        headers: {
          Accept: "application/json",
        },
      });
  }

  private async request<T>(endpoint: string): Promise<T> {
    return retry<T>(
      async () => {
        try {
          const response = await this.client.get<T>(endpoint);
          return response.data;
        } catch (error) {
          const axiosErr = error as AxiosError;
          const message =
            axiosErr.response?.data ||
            axiosErr.message ||
            "Unknown Legacy API error";

          throw new LegacyError(
            `Legacy API Error (${endpoint}): ${JSON.stringify(message)}`
          );
        }
      },
      config.retry.maxAttempts,
      config.retry.delay
    );
  }

  async fetchPayments() {
    return this.request<any[]>("/posts");
  }

  async fetchPaymentById(id: string | number) {
    return this.request<any>(`/posts/${id}`);
  }

  async fetchCustomers() {
    return this.request<any[]>("/users");
  }

  async fetchCustomerById(id: string | number) {
    return this.request<any>(`/users/${id}`);
  }
}

export const legacyService = new LegacyService();
