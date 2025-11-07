import { apiClient } from "./config";
import type {
  Transaction,
  TransactionStatus,
  PaginatedResponse,
} from "../types";

export const transactionApi = {
  // Get all transactions with optional filters
  getTransactions: async (
    page = 1,
    limit = 10,
    status?: TransactionStatus,
    userId?: string // Add userId parameter
  ) => {
    return apiClient<PaginatedResponse<Transaction>>("/api/transactions", {
      method: "GET",
      params: {
        page,
        limit,
        status,
        ...(userId && { userId }), // Only add userId if it exists
      },
    });
  },

  // Create new transaction
  createTransaction: async (data: {
    amount: number;
    description?: string;
    senderId: string;
    receiverId: string;
  }) => {
    return apiClient<{ message: string; transaction: Transaction }>(
      "/api/transactions",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  // Update transaction status
  updateTransactionStatus: async (id: string, status: TransactionStatus) => {
    return apiClient<{ message: string; transaction: Transaction }>(
      `/api/transactions/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
  },
};
