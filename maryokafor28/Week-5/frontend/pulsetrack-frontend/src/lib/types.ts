// src/types/index.ts
import type { JSX } from "react";

export interface Activity {
  _id: string;
  user: string | User; // populated or just an ID
  activityType: string;
  duration: number;
  caloriesBurned?: number;
  date: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Appointment {
  _id: string;
  user: string | User;
  doctor: string | Doctor;
  date: string;
  time: string;
  reason?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  email: string;
  phone?: string;
  appointments?: (string | Appointment)[];
  createdAt?: string;
  updatedAt?: string;
  error: string | null;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "doctor";
  password?: string;
  age?: number;
  height?: number;
  weight?: number;
  activities: (string | Activity)[];
  appointments: (string | Appointment)[];
  createdAt: string;
  updatedAt?: string;
}
export interface HomeOption {
  id: string;
  label: string;
  icon: JSX.Element;
  path: string;
}

export interface UseUsersReturn {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  createUser: (data: Partial<User>) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<User | void>;
  deleteUser: (id: string) => Promise<void>;
}
export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role?: "user" | "doctor"
  ) => Promise<void>;
  logout: () => void;
};
