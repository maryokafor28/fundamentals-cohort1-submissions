// Authentication utilities for token management and API calls

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface AuthError {
  message: string;
  field?: string;
}

// Store access token in localStorage
export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  userId?: {
    name: string;
    id: string;
  };
}

// Retrieve access token from localStorage
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
}

// Remove access token from localStorage
export function removeAccessToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

const BASE_URL = "http://localhost:4000/api";

// Login API call
export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include", // Include cookies for refresh token
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const data: AuthResponse = await response.json();
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export async function register(
  credentials: RegisterCredentials
): Promise<AuthResponse> {
  const response = await fetch("http://localhost:4000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include", // Include cookies for refresh token
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  const data: AuthResponse = await response.json();
  return data;
}

// Logout function
export async function logout(): Promise<void> {
  removeAccessToken();

  // Optional: Call logout endpoint to invalidate refresh token
  try {
    await fetch("http://localhost:4000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export async function getTasks(token: string): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  // console.log(res.json(), "this tasks");

  return res.json();
}

export async function createTask(
  token: string,
  title: string,
  description: string
) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function deleteTask(token: string, id: string) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
}
