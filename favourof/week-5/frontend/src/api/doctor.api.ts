import api from "./axiosConfig";

export interface Doctor {
  _id?: string;
  name: string;
  email: string;
  specialty: string;
  totalAppointments?: number;
}

export const getDoctors = async () => {
  const { data } = await api.get("/doctors");
  return Array.isArray(data) ? data : data.data; // handle wrapped response
};

export const createDoctor = async (doctor: Doctor) => {
  const { data } = await api.post("/doctors", doctor);
  return data;
};

export const updateDoctor = async (id: string, doctor: Partial<Doctor>) => {
  const { data } = await api.put(`/doctors/${id}`, doctor);
  return data;
};

export const deleteDoctor = async (id: string) => {
  const { data } = await api.delete(`/doctors/${id}`);
  return data;
};
