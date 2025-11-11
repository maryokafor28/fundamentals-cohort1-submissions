import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { UserAPI } from "@/services/userApi";
import type { User, UseUsersReturn } from "@/lib/types";

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //  Get current user from AuthContext
  const { user: currentUser } = useAuth();

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await UserAPI.getAll();
      setUsers(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(message);
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single user by ID
  const getUserById = useCallback(async (id: string): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      const user = await UserAPI.getById(id);
      return user;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load user";
      setError(message);
      console.error("Fetch user by ID error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Users should register via signup
  const createUser = async (): Promise<User> => {
    throw new Error("Please use the signup page to create a new account");
  };
  // Update user (only self)
  const updateUser = async (
    id: string,
    data: Partial<User>
  ): Promise<User | void> => {
    if (!currentUser || currentUser._id !== id) {
      const errorMsg = "You can only edit your own profile";
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      setLoading(true);
      setError(null);
      const updatedUser = await UserAPI.update(id, data);
      setUsers((prev) => prev.map((u) => (u._id === id ? updatedUser : u)));
      return updatedUser;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update user";
      setError(message);
      console.error("Update user error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete user (only self)
  const deleteUser = async (id: string): Promise<void> => {
    if (!currentUser || currentUser._id !== id) {
      const errorMsg = "You can only delete your own account";
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      setLoading(true);
      setError(null);
      await UserAPI.delete(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete user";
      setError(message);
      console.error("Delete user error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
}
