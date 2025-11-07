import { create } from "zustand";
import type { Doctor } from "../api/doctor.api";
import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../api/doctor.api";

interface DoctorState {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  fetchDoctors: () => Promise<void>;
  addDoctor: (doctor: Doctor) => Promise<void>;
  editDoctor: (id: string, doctor: Partial<Doctor>) => Promise<void>;
  removeDoctor: (id: string) => Promise<void>;
}

export const useDoctorStore = create<DoctorState>((set) => ({
  doctors: [],
  loading: false,
  error: null,

  fetchDoctors: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getDoctors();
      set({ doctors: Array.isArray(data) ? data : [], loading: false });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        loading: false,
      });
    }
  },

  addDoctor: async (doctor) => {
    set({ loading: true });
    try {
      await createDoctor(doctor);
      await useDoctorStore.getState().fetchDoctors(); // auto refresh
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        loading: false,
      });
    }
  },

  editDoctor: async (id, doctor) => {
    set({ loading: true });
    try {
      await updateDoctor(id, doctor);
      await useDoctorStore.getState().fetchDoctors(); // auto refresh
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        loading: false,
      });
    }
  },

  removeDoctor: async (id) => {
    set({ loading: true });
    try {
      await deleteDoctor(id);
      await useDoctorStore.getState().fetchDoctors(); // auto refresh
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        loading: false,
      });
    }
  },
}));
