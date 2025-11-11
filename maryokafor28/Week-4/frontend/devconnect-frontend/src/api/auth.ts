import { apiFetch } from "@/lib/api";
import { AuthResponse, LoginData, RegisterData, User } from "@/types";

// Add response type for /auth/me
interface MeResponse {
  success: boolean;
  user: User;
}

export const AuthAPI = {
  register: (data: RegisterData) =>
    apiFetch<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: data,
    }),

  login: (data: LoginData) =>
    apiFetch<AuthResponse>("/api/auth/login", { method: "POST", body: data }),

  logout: () => apiFetch<void>("/api/auth/logout", { method: "POST" }),

  getCurrentUser: async (): Promise<User> => {
    const response = await apiFetch<MeResponse>("/api/auth/me");
    return response.user;
  },

  // ✅ Use native fetch instead of apiFetch to avoid circular dependency
  async refreshToken() {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for sending cookies
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to refresh token" }));
      throw new Error(error.message || "Failed to refresh token");
    }

    return response.json() as Promise<{ accessToken: string }>;
  },
};
