import { apiFetch } from "../lib/api";
import type { User } from "@/lib/types";

export const AuthAPI = {
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role?: "user" | "doctor"; // ✅ Add role
  }) =>
    apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  signin: async (data: { email: string; password: string }) => {
    const res = await apiFetch<{
      data: {
        token: string;
        user: User; // ✅ Backend returns user object with role
      };
    }>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // ✅ Store token from correct path
    localStorage.setItem("token", res.data.token);
    return res;
  },

  getMe: async () => {
    const res = await apiFetch<{
      success: boolean;
      data: User; // ✅ Returns user with role
    }>("/auth/me");
    return res.data;
  },
};
