import { apiFetch } from "@/lib/api";
import { UserProfile } from "@/types";

export const UserAPI = {
  // ✅ Get logged-in user's own profile
  getProfile: () => apiFetch<UserProfile>("/api/users/me"),

  // ✅ Update logged-in user's own profile
  updateProfile: (data: Partial<UserProfile>) =>
    apiFetch<UserProfile>("/api/users/me", {
      method: "PUT",
      body: data,
    }),

  // ✅ Get another user's profile by ID
  getById: (userId: string) => apiFetch<UserProfile>(`/api/users/${userId}`),
};
