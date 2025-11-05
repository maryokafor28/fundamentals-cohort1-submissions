import axios from '@/lib/axios';
import Cookies from 'js-cookie';
import {
  RegisterCredentials,
  LoginCredentials,
  ServerResponse,
  LoginResponse,
  RefreshResponse,
  User
} from '@/lib/type';

const ACCESS_TOKEN_COOKIE_NAME = "token";

export const registerUser = async (credentials: RegisterCredentials): Promise<ServerResponse> => {
  try {
    const response = await axios.post<ServerResponse>('/api/auth/register', credentials);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, error: 'An unexpected error occurred' };
  }
};

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>('/api/auth/login', credentials);
    if (response.data.success && response.data.token) {
      Cookies.set(ACCESS_TOKEN_COOKIE_NAME, response.data.token, { expires: 1 / 24 });
    }
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, error: 'An unexpected error occurred' };
  }
};

export const logoutUser = async (): Promise<ServerResponse> => {
  try {

    const response = await axios.post<ServerResponse>('/api/auth/logout');
    Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
    return response.data;
  } catch (error: any) {
    Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
    return error.response?.data || { success: false, error: 'An unexpected error occurred' };
  }
};

export const fetchCurrentUser = async (): Promise<User | null> => {
  const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
  if (!token) {
    return null;
  }

  try {
    const response = await axios.get<ServerResponse>('/api/auth/getUser', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user || null;
  } catch (error) {

    Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
    return null;
  }
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post<RefreshResponse>('/api/auth/refresh');
    if (response.data.success && response.data.token) {
      Cookies.set(ACCESS_TOKEN_COOKIE_NAME, response.data.token, { expires: 1 / 24 });
      return response.data.token;
    }
    return null;
  } catch (error) {
    Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
    return null;
  }
};
