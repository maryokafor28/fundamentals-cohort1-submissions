// src/services/appointmentApi.ts
import { apiFetch } from "../lib/api";
import type { Appointment } from "../lib/types";

export const AppointmentAPI = {
  async getAll() {
    const res = await apiFetch<{ success: boolean; data: Appointment[] }>(
      "/appointments"
    );
    return res.data; // ✅ only return the actual list
  },

  async getById(id: string) {
    const res = await apiFetch<{ success: boolean; data: Appointment }>(
      `/appointments/${id}`
    );
    return res.data;
  },

  async create(data: Partial<Appointment>) {
    const res = await apiFetch<{ success: boolean; data: Appointment }>(
      "/appointments",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return res.data;
  },

  async update(id: string, data: Partial<Appointment>) {
    const res = await apiFetch<{ success: boolean; data: Appointment }>(
      `/appointments/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return res.data;
  },

  async delete(id: string) {
    const res = await apiFetch<{ success: boolean; message: string }>(
      `/appointments/${id}`,
      { method: "DELETE" }
    );
    return res.message;
  },
};
