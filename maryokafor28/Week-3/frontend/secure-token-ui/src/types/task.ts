import { AxiosError } from "axios";

// Generic API error response type
export interface ApiError {
  message: string;
  [key: string]: unknown;
}

// Task data type
export interface Task {
  _id: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NewTask = Omit<Task, "_id">;

// Helper alias to safely type Axios errors
export type ApiAxiosError = AxiosError<ApiError>;
