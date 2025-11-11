import { api } from "./config";
import { ApiAxiosError } from "@/types/task";

export const registerUser = async (data: {
  email: string;
  password: string;
  role?: string;
}) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err) {
    const error = err as ApiAxiosError;
    // ✅ Throw the backend error message
    throw new Error(error.response?.data?.message || "Failed to register");
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const res = await api.post("/auth/login", data);
    console.log("✅ Login response:", res.data); // Debug log

    return res.data;
  } catch (err) {
    const error = err as ApiAxiosError;
    console.error("❌ Login error:", error.response?.data); // Debug log

    // ✅ Throw the backend error message
    throw new Error(error.response?.data?.message || "Failed to login");
  }
};
