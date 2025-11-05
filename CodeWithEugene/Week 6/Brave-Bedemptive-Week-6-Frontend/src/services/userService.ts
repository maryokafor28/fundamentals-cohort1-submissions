import api from './api';
import { User, CreateUserDto, UpdateUserDto, ApiResponse, PaginatedResponse } from '../types';

class UserService {
  private baseUrl = '/users';

  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const response = await api.get(this.baseUrl, {
      params: { page, limit },
    });
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const response = await api.post(this.baseUrl, data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const response = await api.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    totalBalance: number;
    averageBalance: number;
  }> {
    const response = await api.get(`${this.baseUrl}/stats`);
    return response.data;
  }
}

export default new UserService();
