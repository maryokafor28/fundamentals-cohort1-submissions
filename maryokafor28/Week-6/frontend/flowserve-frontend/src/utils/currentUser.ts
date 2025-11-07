const CURRENT_USER_KEY = "flowserve_current_user_id";

export const currentUserStorage = {
  // Get current user ID from localStorage
  get: (): string | null => {
    return localStorage.getItem(CURRENT_USER_KEY);
  },

  // Set current user ID in localStorage
  set: (userId: string): void => {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  },

  // Remove current user (logout)
  remove: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Check if user is selected
  exists: (): boolean => {
    return localStorage.getItem(CURRENT_USER_KEY) !== null;
  },
};
