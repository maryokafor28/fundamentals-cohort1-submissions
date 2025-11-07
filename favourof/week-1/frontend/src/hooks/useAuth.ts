"use client";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // NEW
  const router = useRouter();

  // Register
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const data = await api.register({ username, email, password });
    return data;
  };

  // Login
  const login = async (email: string, password: string) => {
    const data = (await api.login({ email, password })) as {
      token?: string;
      user?: any;
    };
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      localStorage.setItem("userId", data.user.id);
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin"); // cleanup
      router.push(redirectPath);
    }

    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Load user on mount
  useEffect(() => {
    api
      .getProfile()
      .then((data: any) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false)); // ✅ stop loading
  }, []);

  // Listen for forced logout events
  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener("auth-logout", handleLogout);
    return () => window.removeEventListener("auth-logout", handleLogout);
  }, []);

  return { user, loading, login, register, logout };
}
