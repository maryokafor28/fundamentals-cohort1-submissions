import api from './api';

export const reportService = {
  getAll: () => api.get('/reports'),
  getUserReports: (userId) => api.get(`/reports/user/${userId || ''}`),
  getById: (id) => api.get(`/reports/${id}`),
  generate: (reportData) => api.post('/reports/generate', reportData),
  update: (id, reportData) => api.put(`/reports/${id}`, reportData),
  delete: (id) => api.delete(`/reports/${id}`),
  download: (id) => api.get(`/reports/${id}/download`, { responseType: 'blob' })
};