import { apiFetch } from "@/lib/api";
import { Project, CreateProjectData } from "@/types";

// Define the response type that matches your backend
interface ProjectsResponse {
  projects: Project[];
}

interface ProjectResponse {
  project: Project;
}

export const ProjectAPI = {
  getAll: async () => {
    const response = await apiFetch<ProjectsResponse>("/api/projects");
    return response.projects; // Extract the projects array
  },

  getById: async (id: string) => {
    const response = await apiFetch<ProjectResponse>(`/api/projects/${id}`);
    return response.project; // Extract the project object
  },

  create: (data: CreateProjectData) =>
    apiFetch<Project>("/api/projects", { method: "POST", body: data }),

  update: async (id: string, data: Partial<CreateProjectData>) => {
    const response = await apiFetch<ProjectResponse>(`/api/projects/${id}`, {
      method: "PUT",
      body: data,
    });
    return response.project; // Extract the project object
  },

  delete: (id: string) =>
    apiFetch<void>(`/api/projects/${id}`, {
      method: "DELETE",
    }),
};
