import React, { useState, useEffect, type ReactNode } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContextObject";
import type { User } from "../types";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshToken();
      } catch {
        console.error("Failed to initialize authentication");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await axios.get(`${baseURL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
      console.error("Failed to fetch user");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        `${baseURL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      setAccessToken(res.data.accessToken);
      await fetchUser(res.data.accessToken);
    } catch {
      console.error("Login failed");
    }
  };

  const logout = async () => {
    await axios.post(`${baseURL}/auth/logout`, {}, { withCredentials: true });
    setUser(null);
    setAccessToken(null);
  };

  const register = async (
    email: string,
    password: string,
    role: "user" | "admin"
  ) => {
    try {
      const res = await axios.post(
        `${baseURL}/auth/register`,
        { email, password, role },
        { withCredentials: true }
      );
      setAccessToken(res.data.accessToken);
      await login(email, password);
    } catch {
      console.error("Failed to Register");
    }
  };

  const refreshToken = async () => {
    try {
      console.log('Entered rftoken fn')
      const res = await axios.post(
        `${baseURL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      setAccessToken(res.data.accessToken);
      fetchUser(res.data.accessToken);
    } catch {
      console.error("Could not refresh token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
