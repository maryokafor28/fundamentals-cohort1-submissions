// frontend/src/services/auth.js
import api from './api';

export const register = async (username, email, password) => {
  const { data } = await api.post('/auth/register', { username, email, password });
  if (data.success) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

export const login = async (username, password) => {
  const { data } = await api.post('/auth/login', { username, password });
  if (data.success) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } finally {
    localStorage.clear();
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => !!localStorage.getItem('accessToken');
export const isAdmin = () => getCurrentUser()?.role === 'admin';