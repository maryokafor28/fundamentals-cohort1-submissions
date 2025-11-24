import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';

export const useProjects = (page = 1, filters = {}) => {
  return useQuery({
    queryKey: ['projects', page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...filters,
      });
      const { data } = await api.get(`/projects?${params}`);
      return data.data;
    },
  });
};

export const useProject = (id) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${id}`);
      return data.data.project;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData) => {
      const { data } = await api.post('/projects', projectData);
      return data.data.project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      toast.success('Project created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data: projectData }) => {
      const { data } = await api.put(`/projects/${id}`, projectData);
      return data.data.project;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['projects']);
      queryClient.invalidateQueries(['project', variables.id]);
      toast.success('Project updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update project');
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      toast.success('Project deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    },
  });
};