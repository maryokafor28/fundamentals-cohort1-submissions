export interface AuthData {
  password: string;
  name: string;
  email?: string;
}

export interface LoginData {
  identifier: string;
  password: string;
}
