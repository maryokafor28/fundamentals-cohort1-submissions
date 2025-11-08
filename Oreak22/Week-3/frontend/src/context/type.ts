import type { AxiosResponse } from "axios";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<AxiosResponse<any, any, {}>>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
