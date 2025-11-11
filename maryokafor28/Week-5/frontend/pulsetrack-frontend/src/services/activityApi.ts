import { apiFetch } from "../lib/api";
import type { Activity } from "../lib/types";

export const ActivityAPI = {
  getAll: () => apiFetch<Activity[]>("/activities"),
  getById: (id: string) => apiFetch<Activity>(`/activities/${id}`),
  create: (data: Partial<Activity>) =>
    apiFetch<Activity>("/activities", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Activity>) =>
    apiFetch<Activity>(`/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch<{ message: string }>(`/activities/${id}`, { method: "DELETE" }),
};
