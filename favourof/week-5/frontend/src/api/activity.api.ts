import api from "./axiosConfig";

export interface ActivityUser {
  _id: string;
  name?: string;
  email?: string;
}

export interface Activity {
  _id?: string;
  user: string | ActivityUser;
  type: string;
  durationMinutes: number;
  calories: number;
  metadata?: Record<string, string | number>;
}

export const getActivities = async () => {
  const { data } = await api.get("/activities");
  return Array.isArray(data) ? data : data.data;
};

export const createActivity = async (activity: Activity) => {
  const { data } = await api.post("/activities", activity);
  return data;
};

export const updateActivity = async (
  id: string,
  activity: Partial<Activity>
) => {
  const { data } = await api.put(`/activities/${id}`, activity);
  return data;
};

export const deleteActivity = async (id: string) => {
  const { data } = await api.delete(`/activities/${id}`);
  return data;
};
