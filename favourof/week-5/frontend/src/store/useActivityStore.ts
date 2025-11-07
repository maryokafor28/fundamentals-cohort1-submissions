/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { Activity } from "../api/activity.api";
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../api/activity.api";

interface ActivityState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  fetchActivities: () => Promise<void>;
  addActivity: (activity: Activity) => Promise<void>;
  editActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  loading: false,
  error: null,

  fetchActivities: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getActivities();
      set({ activities: Array.isArray(data) ? data : [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addActivity: async (activity) => {
    set({ loading: true });
    try {
      await createActivity(activity);
      await useActivityStore.getState().fetchActivities(); // auto refresh
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  editActivity: async (id, activity) => {
    set({ loading: true });
    try {
      await updateActivity(id, activity);
      await useActivityStore.getState().fetchActivities();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  removeActivity: async (id) => {
    set({ loading: true });
    try {
      await deleteActivity(id);
      await useActivityStore.getState().fetchActivities();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
