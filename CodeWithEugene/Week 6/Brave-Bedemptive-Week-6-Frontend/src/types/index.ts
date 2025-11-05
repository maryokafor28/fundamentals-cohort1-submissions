export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  status: 'pending' | 'successful' | 'failed';
  timestamp: string;
  user?: User;
}

export interface CreateUserDto {
  name: string;
  email: string;
  balance?: number;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  balance?: number;
}

export interface CreateTransactionDto {
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}
