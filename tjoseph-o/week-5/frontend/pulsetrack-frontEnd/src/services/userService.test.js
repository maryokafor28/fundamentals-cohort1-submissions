import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as userService from './userService';
import api from '../utils/api';

vi.mock('../utils/api');

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should fetch all users', async () => {
      const mockUsers = {
        data: {
          success: true,
          data: [
            { _id: '1', name: 'John Doe', email: 'john@example.com' },
            { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
          ],
        },
      };

      api.get.mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      expect(api.get).toHaveBeenCalledWith('/users');
      expect(result.data).toEqual(mockUsers.data.data);
    });

    it('should handle errors when fetching users', async () => {
      const mockError = new Error('Network Error');
      api.get.mockRejectedValue(mockError);

      await expect(userService.getUsers()).rejects.toThrow('Network Error');
    });
  });

  describe('getUser', () => {
    it('should fetch a single user by id', async () => {
      const mockUser = {
        data: {
          success: true,
          data: { _id: '1', name: 'John Doe', email: 'john@example.com' },
        },
      };

      api.get.mockResolvedValue(mockUser);

      const result = await userService.getUser('1');

      expect(api.get).toHaveBeenCalledWith('/users/1');
      expect(result.data).toEqual(mockUser.data.data);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'New User', email: 'new@example.com' };
      const mockResponse = {
        data: {
          success: true,
          data: { _id: '3', ...newUser },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await userService.createUser(newUser);

      expect(api.post).toHaveBeenCalledWith('/users', newUser);
      expect(result.data).toEqual(mockResponse.data.data);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateData = { name: 'Updated Name' };
      const mockResponse = {
        data: {
          success: true,
          data: { _id: '1', name: 'Updated Name', email: 'john@example.com' },
        },
      };

      api.put.mockResolvedValue(mockResponse);

      const result = await userService.updateUser('1', updateData);

      expect(api.put).toHaveBeenCalledWith('/users/1', updateData);
      expect(result.data).toEqual(mockResponse.data.data);
    });
  });



  describe('deleteUser', () => {
  it('should delete a user', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'User deleted successfully',
      },
    };

    api.delete.mockResolvedValue(mockResponse);

    const result = await userService.deleteUser('1');

    expect(api.delete).toHaveBeenCalledWith('/users/1');
    expect(result.success).toBe(true);
  });
});
});