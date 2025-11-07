// Token storage keys
const TOKEN_KEY = '_digi_auth_token';
const USER_TYPE_KEY = '_user_type';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Get token
export const getToken = (): string | null => {
	try {
		return isBrowser ? localStorage.getItem(TOKEN_KEY) : null;
	} catch (error) {
		console.error('Failed to get token:', error);
		return null;
	}
};

// Set token
export const setToken = (token: string): boolean => {
	try {
		if (isBrowser) {
			localStorage.setItem(TOKEN_KEY, token);
			return true;
		}
		return false;
	} catch (error) {
		console.error('Failed to set token:', error);
		return false;
	}
};

// Get user type
export const getUserType = (): string | null => {
	try {
		return isBrowser ? localStorage.getItem(USER_TYPE_KEY) : null;
	} catch (error) {
		console.error('Failed to get user type:', error);
		return null;
	}
};

// Set user type
export const setUserType = (userType: string): boolean => {
	try {
		if (isBrowser) {
			localStorage.setItem(USER_TYPE_KEY, userType);
			return true;
		}
		return false;
	} catch (error) {
		console.error('Failed to set user type:', error);
		return false;
	}
};

// Remove token
export const removeToken = (): boolean => {
	try {
		if (isBrowser) {
			localStorage.removeItem(TOKEN_KEY);
			return true;
		}
		return false;
	} catch (error) {
		console.error('Failed to remove token:', error);
		return false;
	}
};

// Remove user type
export const removeUserType = (): boolean => {
	try {
		if (isBrowser) {
			localStorage.removeItem(USER_TYPE_KEY);
			return true;
		}
		return false;
	} catch (error) {
		console.error('Failed to remove user type:', error);
		return false;
	}
};

// Clear all auth data
export const clearAuthData = (): boolean => {
	try {
		const tokenRemoved = removeToken();
		const userTypeRemoved = removeUserType();
		return tokenRemoved && userTypeRemoved;
	} catch (error) {
		console.error('Failed to clear auth data:', error);
		return false;
	}
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
	const token = getToken();
	return Boolean(token && token.trim().length > 0);
};

// Get auth header for API requests
export const getAuthHeader = (): Record<string, string> | null => {
	const token = getToken();
	return token ? { Authorization: `Bearer ${token}` } : null;
};
