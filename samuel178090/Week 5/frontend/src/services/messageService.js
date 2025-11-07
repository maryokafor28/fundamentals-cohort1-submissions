import api from './api';

export const messageService = {
  getMessages: () => api.get('/messages'),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (id) => api.put(`/messages/${id}/read`)
};