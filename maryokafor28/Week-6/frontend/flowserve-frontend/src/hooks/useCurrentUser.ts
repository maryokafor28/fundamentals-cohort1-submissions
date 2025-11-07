import { useState, useEffect, useCallback } from "react";
import { userApi } from "../api/userApi";
import { currentUserStorage } from "../utils/currentUser";
import type { User } from "../types";

export const useCurrentUser = (autoLoad: boolean = true) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const loadCurrentUser = useCallback(async () => {
    const userId = currentUserStorage.get();
    console.log("📦 Stored user ID on mount:", userId);

    if (!userId) {
      setCurrentUserState(null);
      setLoading(false);
      return;
    }

    console.log("📡 Fetching user from API:", `/api/users/${userId}`);

    setLoading(true);
    setError(null);

    try {
      const user = await userApi.getUser(userId);
      console.log("✅ User loaded:", user);
      setCurrentUserState(user);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load user";
      console.error("❌ Error loading user:", errorMessage);

      setError(errorMessage);
      currentUserStorage.remove();
      setCurrentUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const setCurrentUser = useCallback(
    async (userId: string) => {
      currentUserStorage.set(userId);
      await loadCurrentUser();
    },
    [loadCurrentUser]
  );

  const clearCurrentUser = useCallback(() => {
    currentUserStorage.remove();
    setCurrentUserState(null);
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadCurrentUser();
    }
  }, [autoLoad, loadCurrentUser]);

  return {
    currentUser,
    loading,
    error,
    setCurrentUser,
    clearCurrentUser,
    loadCurrentUser,
    isAuthenticated: currentUser !== null,
  };
};
