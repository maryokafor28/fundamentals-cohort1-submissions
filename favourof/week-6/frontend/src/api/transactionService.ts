import axiosClient from "./axiosClient";
import type { Transaction } from "../types";

export const transactionService = {
  async getAll(page = 1, limit = 10): Promise<Transaction[]> {
    const res = await axiosClient.get(
      `/transactions?page=${page}&limit=${limit}`
    );
    return res.data.data;
  },

  async create(payload: {
    userId: number;
    type: "credit" | "debit";
    amount: number;
    description?: string;
  }): Promise<Transaction> {
    const res = await axiosClient.post("/transactions", payload);
    return res.data.data;
  },
};
