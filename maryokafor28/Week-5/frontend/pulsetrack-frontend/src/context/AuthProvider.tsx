import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { AuthAPI } from "@/services/authApi";
import type { User } from "@/lib/types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    AuthAPI.getMe()
      .then((data) => setUser(data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const signin = async (email: string, password: string) => {
    await AuthAPI.signin({ email, password });
    const me = await AuthAPI.getMe();
    setUser(me);
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role?: "user" | "doctor"
  ) => {
    await AuthAPI.signup({ name, email, password, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
