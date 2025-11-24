import api from './api';

const transactionService = {
  async getAll(page = 1, limit = 10) {
    const response = await api.get(`/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  async getUserTransactions(userId, page = 1, limit = 10) {
    const response = await api.get(`/transactions/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  async create(transactionData) {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  }
};

export default transactionService;