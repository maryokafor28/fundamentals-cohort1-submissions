import api from '../utils/api';

export const getActivities = async (userId = null) => {
  const url = userId ? `/activities?userId=${userId}` : '/activities';
  const response = await api.get(url);
  return response.data;
};

export const getActivity = async (id) => {
  const response = await api.get(`/activities/${id}`);
  return response.data;
};

export const createActivity = async (activityData) => {
  const response = await api.post('/activities', activityData);
  return response.data;
};

export const updateActivity = async (id, activityData) => {
  const response = await api.put(`/activities/${id}`, activityData);
  return response.data;
};

export const deleteActivity = async (id) => {
  const response = await api.delete(`/activities/${id}`);
  return response.data;
};