import React, { createContext, useContext, useEffect, useState } from "react";
import api, { refreshTokenRequest, setAccessToken } from "../api/axiosClient";
import type { AuthContextType, User } from "./type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("hello");

  useEffect(() => {
    const tryRefresh = async () => {
      console.log("hello");
      try {
        const data = await refreshTokenRequest();
        setToken(data.accessToken);
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        setUser(null);
        setToken(null);
        setAccessToken(null);
        // navigate("/auth/login", { replace: true });
        window.location.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    console.log(window.location.pathname);
    if (
      window.location.pathname === "/auth/login" ||
      window.location.pathname === "/auth/signin"
    ) {
      return;
    }
    tryRefresh();
    console.log(window.location.pathname);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    console.log(res.data);
    setToken(res.data.accessToken);
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res;
  };

  const register = async (
    name: string,
    role: string,
    userName: string,
    email: string,
    password: string
  ) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      userName,
      password,
      role,
    });

    console.log(res);
  };
  const logout = async () => {
    await api.post("/auth/logout").then((res) => {
      setToken(null);
      setAccessToken(null);
      setUser(null);
      console.log("hey", res);
      return res;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
