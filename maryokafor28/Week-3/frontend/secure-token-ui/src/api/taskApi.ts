// api/taskApi.ts
import { api } from "@/api/config";
import { Task, NewTask, ApiAxiosError } from "@/types/task";

// Response type for search and filter endpoints
interface PaginatedTaskResponse {
  message: string;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  tasks: Task[];
}

export const getTasks = async (): Promise<Task[]> => {
  try {
    const res = await api.get<Task[]>("/tasks");
    console.log("✅ getTasks response:", res.data);
    return res.data;
  } catch (err) {
    const error = err as ApiAxiosError;
    console.error("❌ getTasks error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch tasks"
    );
  }
};

export const createTask = async (task: NewTask): Promise<Task> => {
  try {
    console.log("📤 Creating task:", task);
    const res = await api.post<Task>("/tasks", task);
    console.log("✅ createTask response:", res.data);

    if (!res.data._id) {
      console.error("⚠️ Task created but no _id in response:", res.data);
      throw new Error("Task created but server did not return task ID");
    }

    return res.data;
  } catch (err) {
    const error = err as ApiAxiosError;
    console.error(
      "❌ createTask error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || error.message || "Failed to create task"
    );
  }
};

export const deleteTask = async (id: string): Promise<{ message: string }> => {
  try {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Invalid task ID: cannot delete task without valid ID");
    }

    console.log("🗑️ Deleting task with ID:", id);
    const res = await api.delete<{ message: string }>(`/tasks/${id}`);
    console.log("✅ deleteTask response:", res.data);
    return res.data;
  } catch (err) {
    const error = err as ApiAxiosError;
    console.error(
      "❌ deleteTask error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete task"
    );
  }
};

// Search tasks with pagination
export const searchTasks = async (params: {
  keyword: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedTaskResponse> => {
  try {
    console.log("🔍 Searching tasks:", params);
    const res = await api.post<PaginatedTaskResponse>("/tasks/search", {
      keyword: params.keyword,
      page: params.page || 1,
      limit: params.limit || 10,
    });
    console.log("✅ searchTasks response:", res.data);
    return res.data;
  } catch (err) {
    const error = err as ApiAxiosError;
    console.error(
      "❌ searchTasks error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || error.message || "Failed to search tasks"
    );
  }
};

// Filter tasks with pagination
export const filterTasks = async (filters: {
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedTaskResponse> => {
  try {
    console.log("Filtering tasks:", filters);
    const res = await api.post<PaginatedTaskResponse>("/tasks/filter", {
      startDate: filters.startDate,
      endDate: filters.endDate,
      status: filters.status,
      page: filters.page || 1,
      limit: filters.limit || 10,
    });
    console.log("filterTasks response:", res.data);
    return res.data;
  } catch (err) {
    const error = err as ApiAxiosError;
    console.error(" filterTasks error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to filter tasks"
    );
  }
};
