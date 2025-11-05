import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";

type User = { id: string; email: string; role: "user" | "admin" };

type AuthState = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // helper to set Authorization header for axios
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    // backend returns { accessToken } and sets refreshToken cookie
    const token = res.data.accessToken;
    setAccessToken(token);

    // decode token to get user info (or fetch /me endpoint)
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser({ id: payload.sub, email, role: payload.role });
  };

  const register = async (email: string, password: string) => {
    await api.post("/auth/register", { email, password });
    // optionally auto-login after register
    await login(email, password);
  };

  const refreshAccessToken = async () => {
    // backend refresh should read refresh token cookie and return new access token
    const res = await api.get("/auth/refresh");
    const token = res.data.accessToken;
    setAccessToken(token);
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ id: payload.sub, email: payload.email || "", role: payload.role });
    }
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout");
    } catch (e) {
      // ignore
    } finally {
      setAccessToken(null);
      setUser(null);
      // axios will remove header via useEffect
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, refreshAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
