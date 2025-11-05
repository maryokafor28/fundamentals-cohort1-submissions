import axios from '@/lib/axios';
import Cookies from 'js-cookie';
import {
  Doctor,
  CreateDoctorPayload, 
  ServerResponse
} from '@/lib/type';

const API_PATH = '/api/doctors';
const ACCESS_TOKEN_COOKIE_NAME = "token";

/**
 * Creates a new doctor.
 * @param payload - The data for the new doctor.
 * @returns The server's response, hopefully containing the newly created doctor.
 */
export const createDoctor = async (payload: CreateDoctorPayload): Promise<ServerResponse> => {
  const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
  if (!token) {
    return { success: false, error: "Authentication token not found. Please log in again." };
  }

  try {
    const response = await axios.post<ServerResponse>(`${API_PATH}/create`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, error: 'An unexpected error occurred while creating the doctor.' };
  }
};

/**
 * Fetches all doctors.
 * @returns A promise that resolves to an array of Doctor objects.
 */
export const getDoctors = async (): Promise<Doctor[]> => {
  const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
  if (!token) {
    console.error("Authentication token not found.");
    return [];
  }

  try {
    const response = await axios.get<ServerResponse>(API_PATH, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
   return response.data.data || [];
  } catch (error: any) {
    console.error('Failed to fetch doctors:', error.response?.data?.error || error.message);
    return [];
  }
};

/**
 * Fetches a single doctor by their ID.
 * @param doctorId - The ID of the doctor to fetch.
 * @returns A promise that resolves to a Doctor object or null if not found.
 */
export const getDoctorById = async (doctorId: string): Promise<Doctor | null> => {
  const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
  if (!token) {
    console.error("Authentication token not found.");
    return null;
  }

  try {
    const response = await axios.get<ServerResponse>(`${API_PATH}/${doctorId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
   return response.data.data || null;
  } catch (error: any) {
    console.error(`Failed to fetch doctor ${doctorId}:`, error.response?.data?.error || error.message);
    return null; 
  }
};
