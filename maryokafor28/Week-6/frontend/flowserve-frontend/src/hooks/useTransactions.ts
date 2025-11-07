import { useState, useEffect } from "react";
import { transactionApi } from "../api/transactionApi";
import type { Transaction } from "../types";
import { type TransactionStatus } from "../types";

export const useTransactions = (userId?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<
    TransactionStatus | undefined
  >();

  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await transactionApi.getTransactions(
          page,
          10,
          selectedStatus,
          userId
        );
        setTransactions(response.data);
        setTotalPages(response.totalPages);
        setTotal(response.total);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch transactions";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, selectedStatus, userId]);

  const refetch = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await transactionApi.getTransactions(
        page,
        10,
        selectedStatus,
        userId
      );
      setTransactions(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch transactions";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    loading,
    error,
    page,
    setPage,
    totalPages,
    total,
    selectedStatus,
    setSelectedStatus,
    refetch,
  };
};
