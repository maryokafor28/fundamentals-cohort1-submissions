// User type
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Transaction status - use const instead of enum
export const TransactionStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;

// Create a type from the const
export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

// Transaction type
export interface Transaction {
  id: string;
  amount: string;
  description?: string;
  status: TransactionStatus;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  createdAt: string;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Error type
export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}
