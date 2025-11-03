export interface User {
  _id: string;
  email: string;
  role: "user" | "admin";
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  results: Task[];
}

export const Role = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
