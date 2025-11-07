import { createContext, useState, useEffect, type ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (userData: Partial<User> & { userId?: string }, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);

      // Normalize userId → id if needed
      const normalizedUser: User = {
        id: parsedUser.id || parsedUser.userId, // ✅ handles both cases
        name: parsedUser.name,
        email: parsedUser.email,
      };

      setUser(normalizedUser);
      setToken(storedToken);
    }
  }, []);

  const login = (
    userData: Partial<User> & { userId?: string },
    newToken: string
  ) => {
    // Normalize userId → id before saving
    const normalizedUser: User = {
      id: userData.id || userData.userId || "",
      name: userData.name || "",
      email: userData.email || "",
    };

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
