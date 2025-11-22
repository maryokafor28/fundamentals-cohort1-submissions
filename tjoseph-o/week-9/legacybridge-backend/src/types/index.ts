// Legacy API Response Types (simulating old PHP system structure)
export interface LegacyPayment {
  id: number;
  userId: number;
  title: string; // Using JSONPlaceholder 'posts' as payment mock
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

// Modern API Response Types (cleaned up structure)
export interface ModernPayment {
  id: string;
  customerId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  metadata: {
    source: string;
    processingTime: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ModernCustomer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  company?: {
    name: string;
    description: string;
  };
  metadata: {
    username: string;
    website?: string;
    registeredAt: string;
  };
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    cached?: boolean;
  };
}

// Error Types
export class LegacyApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'LegacyApiError';
  }
}

export class TransformationError extends Error {
  constructor(message: string, public data?: unknown) {
    super(message);
    this.name = 'TransformationError';
  }
}