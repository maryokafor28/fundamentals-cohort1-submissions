/**
 * Type definitions for LegacyBridge Backend
 */

// ============ Legacy API Types ============

export interface LegacyPayment {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface LegacyCustomer {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// ============ Transformed/Modern Types ============

export interface ModernPayment {
  id: string;
  customerId: string;
  description: string;
  amount: number; // Derived or mocked for demo
  status: 'pending' | 'completed' | 'failed';
  currency: string;
  createdAt: string;
  metadata: {
    source: 'legacy';
    transformedAt: string;
  };
}

export interface ModernCustomer {
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
    source: 'legacy';
    legacyId: number;
  };
}

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
    processingTime: number;
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

// ============ Service Types ============

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

export interface RetryOptions {
  attempts: number;
  delay: number; // milliseconds
  backoff?: 'exponential' | 'linear';
}

export interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'closed' | 'open' | 'half-open';
}

// ============ Error Types ============

export class LegacyApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'LegacyApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class CacheError extends Error {
  constructor(message: string, public operation: string) {
    super(message);
    this.name = 'CacheError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// ============ Health Check Types ============

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    legacyApi: ServiceHealth;
    cache: ServiceHealth;
    database?: ServiceHealth;
  };
  uptime: number;
}

export interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  message?: string;
  lastChecked: string;
}