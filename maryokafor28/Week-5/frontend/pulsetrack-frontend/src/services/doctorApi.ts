import { apiFetch } from "../lib/api";
import type { Doctor } from "../lib/types";

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}

export const DoctorAPI = {
  // ✅ Get all doctors
  getAll: async (): Promise<Doctor[]> => {
    const res = await apiFetch<ApiResponse<Doctor[]>>("/doctors");
    return res.data; // only data
  },

  // ✅ Get single doctor by ID
  getById: async (id: string): Promise<Doctor> => {
    const res = await apiFetch<ApiResponse<Doctor>>(`/doctors/${id}`);
    return res.data;
  },

  // ✅ Create a new doctor
  create: async (data: Partial<Doctor>): Promise<Doctor> => {
    const res = await apiFetch<ApiResponse<Doctor>>("/doctors", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // ✅ Update doctor
  update: async (id: string, data: Partial<Doctor>): Promise<Doctor> => {
    const res = await apiFetch<ApiResponse<Doctor>>(`/doctors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // ✅ Delete doctor
  delete: async (id: string): Promise<Doctor> => {
    const res = await apiFetch<ApiResponse<Doctor>>(`/doctors/${id}`, {
      method: "DELETE",
    });
    return res.data;
  },
};
