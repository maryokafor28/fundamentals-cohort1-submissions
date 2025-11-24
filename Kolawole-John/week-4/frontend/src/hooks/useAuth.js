import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';

export const useGetMe = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me');
      return data.data.user;
    },
    retry: false,
    staleTime: Infinity,
  });
};

export const useSignup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const { data } = await api.post('/auth/signup', userData);
      localStorage.setItem('token', data.token);
      return data.data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Signup failed');
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      return data.data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    },
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    },
  });
};