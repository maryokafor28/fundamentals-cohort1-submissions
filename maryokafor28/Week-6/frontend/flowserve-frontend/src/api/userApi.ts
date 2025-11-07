import { apiClient } from "./config";
import type { User } from "../types";

export const userApi = {
  // ✅ Get all users (matches backend response)
  getUsers: async (page = 1, limit = 20) => {
    const response = await apiClient<{
      status: string;
      data: User[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>("/api/users", {
      method: "GET",
      params: { page, limit },
    });

    return {
      users: response.data,
      pagination: response.pagination,
    };
  },

  // ✅ Get single user by ID
  getUser: async (id: string) => {
    const response = await apiClient<{ status: string; data: User }>(
      `/api/users/${id}`,
      { method: "GET" }
    );

    return response.data;
  },

  // ✅ Create user
  createUser: async (data: { name: string; email: string }) => {
    const response = await apiClient<{ status: string; data: User }>(
      "/api/users",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    return response.data;
  },

  // ✅ Update user
  updateUser: async (id: string, data: { name?: string; email?: string }) => {
    const response = await apiClient<{ status: string; data: User }>(
      `/api/users/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

    return response.data;
  },

  // ✅ Delete user (safe against empty JSON)
  deleteUser: async (id: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/users/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    //  Try reading text safely before parsing
    const text = await response.text();
    const data = text ? JSON.parse(text) : { message: "User deleted" };

    if (!response.ok) throw new Error(data.error || "Failed to delete user");

    return data.message;
  },
};
