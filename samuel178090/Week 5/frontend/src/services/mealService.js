import api from './api';

export const mealService = {
  getAll: () => api.get('/meals'),
  getById: (id) => api.get(`/meals/${id}`),
  create: (mealData) => api.post('/meals', mealData),
  update: (id, mealData) => api.put(`/meals/${id}`, mealData),
  delete: (id) => api.delete(`/meals/${id}`)
};