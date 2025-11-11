import { apiFetch } from "../lib/api";
import type { User } from "../lib/types";

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}

export const UserAPI = {
  getAll: async (): Promise<User[]> => {
    const res = await apiFetch<ApiResponse<User[]>>("/users");
    return res.data; // ✅ unwrap "data"
  },

  getById: async (id: string): Promise<User> => {
    const res = await apiFetch<ApiResponse<User>>(`/users/${id}`);
    return res.data;
  },

  create: async (data: Partial<User>): Promise<User> => {
    const res = await apiFetch<ApiResponse<User>>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const res = await apiFetch<ApiResponse<User>>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  delete: async (id: string): Promise<User> => {
    const res = await apiFetch<ApiResponse<User>>(`/users/${id}`, {
      method: "DELETE",
    });
    return res.data;
  },
};
