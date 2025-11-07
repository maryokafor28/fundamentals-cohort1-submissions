import requests, { ApiResponse } from './api';

// Interfaces for user-related data
interface User {
	_id: string;
	name: string;
	email: string;
	type: 'customer' | 'admin';
	isEmailVerified: boolean;
	createdAt: string;
	updatedAt: string;
}

interface RegisterUserData {
	name: string;
	email: string;
	password: string;
}

interface LoginUserData {
	email: string;
	password: string;
}

interface UpdateUserData {
	name?: string;
	password?: string;
}

interface LoginResponse {
	user: User;
	token: string;
}

// User service
export const Users = {
	// Get user details
	getUser: async (): Promise<ApiResponse<User>> => {
		return requests.get<ApiResponse<User>>('/users/1');
	},

	// Get all users
	getUsers: async (): Promise<ApiResponse<User[]>> => {
		return requests.get<ApiResponse<User[]>>('/users');
	},

	// Register a new user
	registerNewUser: async (user: RegisterUserData): Promise<ApiResponse<User>> => {
		if (!user.name || !user.email || !user.password) {
			throw new Error('Name, email, and password are required');
		}
		return requests.post<ApiResponse<User>>('/users', {
			...user,
			type: 'customer',
		});
	},

	// Login a user
	loginUser: async (user: LoginUserData): Promise<ApiResponse<LoginResponse>> => {
		if (!user.email || !user.password) {
			throw new Error('Email and password are required');
		}
		const loginUserRes = await requests.post<ApiResponse<LoginResponse>>('/users/login', user);
		
		// Store user data safely
		if (typeof window !== 'undefined' && loginUserRes.result?.user) {
			window.localStorage.setItem(
				'_digi_user',
				JSON.stringify(loginUserRes.result.user)
			);
		}
		return loginUserRes;
	},
	// Update user details
	updateUser: async (user: UpdateUserData, id: string): Promise<ApiResponse<User>> => {
		if (!id) {
			throw new Error('User ID is required');
		}
		if (!user.name && !user.password) {
			throw new Error('At least name or password must be provided');
		}
		
		const updateUserRes = await requests.patch<ApiResponse<User>>(
			`/users/update-name-password/${id}`,
			user
		);
		
		// Update localStorage safely
		if (typeof window !== 'undefined') {
			try {
				const userData = JSON.parse(
					window.localStorage.getItem('_digi_user') || '{}'
				);
				if (user.name) {
					userData.name = user.name;
				}
				window.localStorage.setItem('_digi_user', JSON.stringify(userData));
			} catch (error) {
				console.error('Failed to update localStorage:', error);
			}
		}

		return updateUserRes;
	},
	// Forgot user's password
	forgotUserPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
		if (!email) {
			throw new Error('Email is required');
		}
		return requests.get<ApiResponse<{ message: string }>>(
			`/users/forgot-password/${email}`
		);
	},

	// Resend OTP
	resendOTP: async (email: string): Promise<ApiResponse<{ message: string }>> => {
		if (!email) {
			throw new Error('Email is required');
		}
		return requests.get<ApiResponse<{ message: string }>>(`/users/send-otp-mail/${email}`);
	},

	// Verify OTP
	verifyOTP: async (otp: string, email: string): Promise<ApiResponse<{ message: string; user?: User }>> => {
		if (!otp || !email) {
			throw new Error('OTP and email are required');
		}
		return requests.get<ApiResponse<{ message: string; user?: User }>>(
			`/users/verify-email/${otp}/${email}`
		);
	},

	// Logout user
	logoutUser: async (): Promise<ApiResponse<{ message: string }>> => {
		const logoutUserRes = await requests.put<ApiResponse<{ message: string }>>('/users/logout', {});
		
		// Remove user data safely
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem('_digi_user');
		}
		return logoutUserRes;
	},
};

// Helper function to get current user from localStorage
export const getCurrentUser = (): User | null => {
	if (typeof window === 'undefined') return null;
	try {
		const userData = window.localStorage.getItem('_digi_user');
		return userData ? JSON.parse(userData) : null;
	} catch (error) {
		console.error('Failed to get current user:', error);
		return null;
	}
};
