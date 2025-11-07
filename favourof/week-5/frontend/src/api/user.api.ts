import api from "./axiosConfig";

export interface User {
  _id?: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
}

export const getUsers = async () => {
  const { data } = await api.get("/users");
  return Array.isArray(data) ? data : data.data;
};

export const createUser = async (user: User) => {
  const { data } = await api.post("/users", user);
  return data;
};

export const updateUser = async (id: string, user: Partial<User>) => {
  const { data } = await api.put(`/users/${id}`, user);
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
