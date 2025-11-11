// src/context/AuthProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "@/api/authApi";
import { refreshAccessToken, logoutUser } from "@/api/tokenApi";

type User = { id: string; email: string; role: "user" | "admin" };
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  ready: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await refreshAccessToken();
        if (res?.user) setUser(res.user);
      } catch {
        setUser(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // ✅ Login with proper error handling
  const login = async (email: string, password: string) => {
    try {
      const res = await loginUser({ email, password });

      console.log("Login response in AuthProvider:", res); // Debug

      // ✅ Only set user if we got valid user data
      if (res?.user) {
        setUser(res.user);
      } else {
        throw new Error("Login failed - no user data received");
      }
    } catch (error) {
      // ✅ Clear user and re-throw error
      setUser(null);
      console.error("AuthProvider login error:", error);
      throw error; // Re-throw so Login component can catch it
    }
  };

  // ✅ FIXED: Logout with proper error handling
  const logout = async () => {
    try {
      // Try to call backend logout
      await logoutUser();
      console.log("✅ Backend logout successful");
    } catch (error) {
      // ✅ Log the error but don't throw it
      // The user should still be logged out locally even if backend fails
      console.warn(
        "⚠️ Backend logout failed, but proceeding with local cleanup:",
        error
      );
    } finally {
      //  ALWAYS clear user state, regardless of backend response
      setUser(null);

      // ✅ Clear any stored tokens
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
