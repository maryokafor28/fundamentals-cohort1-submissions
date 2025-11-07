import axios from '@/lib/axios';
import Cookies from 'js-cookie';
import {
  Activity,
  CreateActivityPayload,
  ServerResponse
} from '@/lib/type';

const API_PATH = '/api/activities';
const ACCESS_TOKEN_COOKIE_NAME = "token";

/**
 * Creates a new activity for the logged-in user.
 * @param payload - The data for the new activity.
 * @returns The server's response, hopefully containing the newly created activity.
 */
export const createActivity = async (payload: CreateActivityPayload): Promise<ServerResponse> => {
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
    return error.response?.data || { success: false, error: 'An unexpected error occurred while creating the activity.' };
  }
};

/**
 * Fetches all activities for the currently logged-in user.
 * @returns The server's response containing an array of activities.
 */
export const getActivities = async (): Promise<Activity[]> => {
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
    console.error('Failed to fetch activities:', error.response?.data?.error || error.message);
    return [];
  }
};

/**
 * Fetches a single activity by its ID.
 * @param activityId - The ID of the activity to fetch.
 * @returns The server's response containing the single activity, or null if not found.
 */
export const getActivityById = async (activityId: string): Promise<Activity | null> => {
  const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
  if (!token) {
    console.error("Authentication token not found.");
    return null;
  }

  try {
    const response = await axios.get<ServerResponse>(`${API_PATH}/${activityId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data || null;
  } catch (error: any) {
    console.error(`Failed to fetch activity ${activityId}:`, error.response?.data?.error || error.message);
    return null;
  }
};
