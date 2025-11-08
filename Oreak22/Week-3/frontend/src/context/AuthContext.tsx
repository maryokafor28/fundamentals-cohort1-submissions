import React, { createContext, useContext, useEffect, useState } from "react";
import api, { refreshTokenRequest, setAccessToken } from "../api/axiosClient";
import type { AuthContextType, User } from "./type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  currentPage?: "save" | null;
}> = ({ children, currentPage }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const data = await refreshTokenRequest();
        setToken(data.accessToken);
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        setUser(null);
        setToken(null);
        setAccessToken(null);
        window.location.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    if (window.location.pathname == "/auth/login" || "/auth/sigin") return;
    else tryRefresh();
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

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { name, email, password });

    console.log(res);
  };

  const logout = async () => {
    await api.post("/auth/logout").then((res) => {
      setToken(null);
      setAccessToken(null);
      setUser(null);
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
