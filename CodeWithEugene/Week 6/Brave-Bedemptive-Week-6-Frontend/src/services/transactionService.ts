import api from './api';
import { Transaction, CreateTransactionDto, PaginatedResponse } from '../types';

class TransactionService {
  private baseUrl = '/transactions';

  async getTransactions(
    page = 1,
    limit = 10,
    userId?: string,
    type?: 'credit' | 'debit',
    status?: 'pending' | 'successful' | 'failed'
  ): Promise<PaginatedResponse<Transaction>> {
    const response = await api.get(this.baseUrl, {
      params: { page, limit, userId, type, status },
    });
    return response.data;
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createTransaction(data: CreateTransactionDto): Promise<Transaction> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const response = await api.get(`${this.baseUrl}/user/${userId}`);
    return response.data;
  }

  async getTransactionStats(): Promise<{
    totalTransactions: number;
    totalCredit: number;
    totalDebit: number;
    pendingCount: number;
    successfulCount: number;
    failedCount: number;
  }> {
    const response = await api.get(`${this.baseUrl}/stats`);
    return response.data;
  }
}

export default new TransactionService();
