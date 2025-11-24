/**
 * Type definitions for LegacyBridge Frontend
 * Matches backend API responses
 */

// ============ API Response Types ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    timestamp: string;
    version: string;
    cached: boolean;
    processingTime?: number;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  metadata: {
    timestamp: string;
    version: string;
    cached: boolean;
  };
}

// ============ Payment Types ============

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface Payment {
  id: string;
  customerId: string;
  description: string;
  amount: number;
  status: PaymentStatus;
  currency: string;
  createdAt: string;
  metadata: {
    source: string;
    transformedAt: string;
  };
  customer?: Customer;
}

export interface PaymentStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  totalAmount: number;
  averageAmount: number;
  recentPayments: Payment[];
}

// ============ Customer Types ============

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: {
    city: string;
    zipCode: string;
  };
  company?: {
    name: string;
    tagline: string;
  };
  registeredAt: string;
  metadata: {
    source: string;
    legacyId: number;
  };
  paymentHistory?: {
    totalPayments: number;
    totalAmount: number;
    stats: {
      completed: number;
      pending: number;
      failed: number;
    };
    recentPayments: Payment[];
  };
}

// ============ Filter Types ============

export interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  customerId?: string;
  useCache?: boolean;
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  city?: string;
  useCache?: boolean;
}

// ============ Health Check Types ============

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    legacyApi: ServiceHealth;
    cache: ServiceHealth;
  };
  uptime: number;
}

export interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  message?: string;
  lastChecked: string;
}

// ============ Chart Data Types ============

export interface PaymentChartData {
  name: string;
  amount: number;
  count: number;
}

export interface StatusDistribution {
  status: PaymentStatus;
  count: number;
  percentage: number;
}