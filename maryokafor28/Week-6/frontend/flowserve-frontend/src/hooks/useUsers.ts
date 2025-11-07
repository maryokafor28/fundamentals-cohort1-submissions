import { useState, useEffect } from "react";
import { userApi } from "../api/userApi";
import type { User } from "../types";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userApi.getUsers(page);
        setUsers(response.users);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch users";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.getUsers(page);
      setUsers(response.users);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    page,
    setPage,
    totalPages,
    refetch,
  };
};
