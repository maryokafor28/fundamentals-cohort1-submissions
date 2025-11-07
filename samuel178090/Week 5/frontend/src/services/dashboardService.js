import api from './api';

export const dashboardService = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getDoctorDashboard: () => api.get('/dashboard/doctor'),
  getPatientDashboard: () => api.get('/dashboard/patient'),
  assignDoctorToPatient: (data) => api.post('/dashboard/assign-doctor', data),
  assignActivityToPatient: (data) => api.post('/dashboard/assign-activity', data),
  assignMealToPatient: (data) => api.post('/dashboard/assign-meal', data)
};