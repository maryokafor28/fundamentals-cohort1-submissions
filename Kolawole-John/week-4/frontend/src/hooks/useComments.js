import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';

export const useComments = (projectId, page = 1) => {
  return useQuery({
    queryKey: ['comments', projectId, page],
    queryFn: async () => {
      const { data } = await api.get(`/projects/${projectId}/comments?page=${page}&limit=20`);
      return data.data;
    },
    enabled: !!projectId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, content }) => {
      const { data } = await api.post(`/projects/${projectId}/comments`, { content });
      return data.data.comment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['comments', variables.projectId]);
      queryClient.invalidateQueries(['project', variables.projectId]);
      toast.success('Comment added!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, commentId }) => {
      await api.delete(`/projects/${projectId}/comments/${commentId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['comments', variables.projectId]);
      toast.success('Comment deleted!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    },
  });
};