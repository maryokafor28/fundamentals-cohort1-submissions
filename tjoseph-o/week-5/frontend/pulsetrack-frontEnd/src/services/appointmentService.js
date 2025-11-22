import api from '../utils/api';

export const getAppointments = async (userId = null, status = null) => {
  let url = '/appointments';
  const params = [];
  
  if (userId) params.push(`userId=${userId}`);
  if (status) params.push(`status=${status}`);
  
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  const response = await api.get(url);
  return response.data;
};

export const getAppointment = async (id) => {
  const response = await api.get(`/appointments/${id}`);
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
};

export const updateAppointment = async (id, appointmentData) => {
  const response = await api.put(`/appointments/${id}`, appointmentData);
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};
