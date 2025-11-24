import { useQuery, UseQueryResult, QueryClient } from '@tanstack/react-query';
import apiClient, { getErrorMessage } from './api';
import {
  ApiResponse,
  PaginatedResponse,
  Payment,
  PaymentStats,
  Customer,
  PaymentFilters,
  CustomerFilters,
  HealthCheck,
} from '../types';

/**
 * React Query Configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ============ Query Keys ============

export const queryKeys = {
  payments: {
    all: ['payments'] as const,
    lists: () => [...queryKeys.payments.all, 'list'] as const,
    list: (filters: PaymentFilters) => [...queryKeys.payments.lists(), filters] as const,
    details: () => [...queryKeys.payments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.payments.details(), id] as const,
    stats: () => [...queryKeys.payments.all, 'stats'] as const,
  },
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters: CustomerFilters) => [...queryKeys.customers.lists(), filters] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
  },
  health: ['health'] as const,
};

// ============ Payment Queries ============

/**
 * Fetch paginated payments
 */
export function usePayments(filters: PaymentFilters = {}): UseQueryResult<PaginatedResponse<Payment>, Error> {
  return useQuery({
    queryKey: queryKeys.payments.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Payment>>('/api/v2/payments', {
        params: filters,
      });
      return data;
    },
  });
}

/**
 * Fetch single payment by ID
 */
export function usePayment(id: string | undefined): UseQueryResult<ApiResponse<Payment>, Error> {
  return useQuery({
    queryKey: queryKeys.payments.detail(id || ''),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Payment>>(`/api/v2/payments/${id}`);
      return data;
    },
    enabled: !!id, // Only run if ID exists
  });
}

/**
 * Fetch payment statistics
 */
export function usePaymentStats(): UseQueryResult<ApiResponse<PaymentStats>, Error> {
  return useQuery({
    queryKey: queryKeys.payments.stats(),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<PaymentStats>>('/api/v2/payments/stats');
      return data;
    },
    staleTime: 1000 * 60 * 2, // Stats can be slightly stale (2 minutes)
  });
}

// ============ Customer Queries ============

/**
 * Fetch paginated customers
 */
export function useCustomers(filters: CustomerFilters = {}): UseQueryResult<PaginatedResponse<Customer>, Error> {
  return useQuery({
    queryKey: queryKeys.customers.list(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Customer>>('/api/v2/customers', {
        params: filters,
      });
      return data;
    },
  });
}

/**
 * Fetch single customer by ID
 */
export function useCustomer(id: string | undefined): UseQueryResult<ApiResponse<Customer>, Error> {
  return useQuery({
    queryKey: queryKeys.customers.detail(id || ''),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Customer>>(`/api/v2/customers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

/**
 * Fetch customer's payments
 */
export function useCustomerPayments(
  customerId: string | undefined,
  filters: PaymentFilters = {}
): UseQueryResult<PaginatedResponse<Payment>, Error> {
  return useQuery({
    queryKey: [...queryKeys.customers.detail(customerId || ''), 'payments', filters],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Payment>>(
        `/api/v2/customers/${customerId}/payments`,
        { params: filters }
      );
      return data;
    },
    enabled: !!customerId,
  });
}

// ============ Health Check Query ============

/**
 * Fetch system health
 */
export function useHealth(): UseQueryResult<ApiResponse<HealthCheck>, Error> {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<HealthCheck>>('/health');
      return data;
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
}

// ============ Prefetch Utilities ============

/**
 * Prefetch payment details
 * Useful for hover states or predicted navigation
 */
export function prefetchPayment(id: string): void {
  queryClient.prefetchQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Payment>>(`/api/v2/payments/${id}`);
      return data;
    },
  });
}

/**
 * Prefetch customer details
 */
export function prefetchCustomer(id: string): void {
  queryClient.prefetchQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Customer>>(`/api/v2/customers/${id}`);
      return data;
    },
  });
}

// ============ Invalidation Utilities ============

/**
 * Invalidate all payment queries
 */
export function invalidatePayments(): void {
  queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
}

/**
 * Invalidate all customer queries
 */
export function invalidateCustomers(): void {
  queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
}