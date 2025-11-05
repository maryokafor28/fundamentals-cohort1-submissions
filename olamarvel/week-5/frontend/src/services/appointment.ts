import axios from '@/lib/axios';
import Cookies from 'js-cookie';
import {
  Appointment,
  CreateAppointmentPayload,
  ServerResponse
} from '@/lib/type';

const API_PATH = '/api/appointments';
const ACCESS_TOKEN_COOKIE_NAME = "token";

/**
 * Creates a new appointment for the logged-in user.
 * @param payload - The data for the new appointment.
 * @returns The server's response, hopefully containing the newly created appointment.
 */
export const createAppointment = async (payload: CreateAppointmentPayload): Promise<ServerResponse> => {
  const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
  if (!token) {
    return { success: false, error: "Authentication token not found. Please log in again." };
  }

  try {
    const response = await axios.post<ServerResponse>(API_PATH, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { success: false, error: 'An unexpected error occurred while creating the appointment.' };
  }
};

/**
 * Fetches all appointments for the currently logged-in user.
 * @returns The server's response containing an array of appointments.
 */
export const getAppointments = async (): Promise<Appointment[]> => {
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
    console.error('Failed to fetch appointments:', error.response?.data?.error || error.message);
    return [];
  }
};

/**
 * Fetches a single appointment by its ID.
 * @param appointmentId - The ID of the appointment to fetch.
 * @returns The server's response containing the single appointment, or null if not found.
 */
export const getAppointmentById = async (appointmentId: string): Promise<Appointment | null> => {
  const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
  if (!token) {
    console.error("Authentication token not found.");
    return null;
  }

  try {
    const response = await axios.get<ServerResponse>(`${API_PATH}/${appointmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data || null;
  } catch (error: any) {
    console.error(`Failed to fetch appointment ${appointmentId}:`, error.response?.data?.error || error.message);
    return null;
  }
};
