import axiosClient from "./axiosClient";
import type { User } from "../types";

export const userService = {
  async getAll(page = 1, limit = 10): Promise<User[]> {
    const res = await axiosClient.get(`/users?page=${page}&limit=${limit}`);
    return res.data.data;
  },

  async create(payload: {
    name: string;
    email: string;
    balance?: number;
  }): Promise<User> {
    const res = await axiosClient.post("/users", payload);
    return res.data.data;
  },

  async remove(id: number): Promise<void> {
    await axiosClient.delete(`/users/${id}`);
  },
};
