export interface User {
    id: string;
    name: string;
    email: string;
    age: number;
    activities: string[]
    meals: string[]
    appointments: string[]
    reports: string[]
}

export interface Activity {
    _id: string;
    user: string; // User ID
    type: string;
    durationMinutes: number;
    caloriesBurned?: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

// Corrected: InteractingUser now only includes 'name'
export interface InteractingUser {
    name: string;
}

export interface Doctor {
    _id: string;
    name: string;
    specialty?: string;
    contact?: string;
    createdAt: string;
    updatedAt: string;
    interactingUsers?: InteractingUser[]; // Updated to use the corrected InteractingUser interface
}

export interface Appointment {
    _id: string;
    user: string; // User ID
    doctor: string | Doctor; // Doctor ID or populated Doctor object
    time: string; // ISO 8601 string for date/time
    notes?: string;
    status: "scheduled" | "completed" | "cancelled";
    createdAt: string;
    updatedAt: string;
}

export interface CreateActivityPayload {
    type: string;
    durationMinutes: number;
    description?: string;
    caloriesBurned?: number;
}

export interface UpdateActivityPayload {
    type?: string;
    durationMinutes?: number;
    description?: string;
    caloriesBurned?: number;
}

export interface CreateAppointmentPayload {
    time: string; // ISO 8601 string
    doctor: string; // Doctor ID - will be sent as a string to the backend
    notes?: string;
    status?: "scheduled" | "completed" | "cancelled";
}

export interface CreateDoctorPayload {
    name: string;
    specialty?: string;
    contact?: string;
}

export interface UserContextProps {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    fetchUser: () => Promise<void>;
    logout: () => void;
}

export interface ServerResponse {
    success?: boolean;
    message?: string;
    data?: any; // Can be a single activity, appointment, or array, or doctor data
    error?: string;
    errors?: { msg: string; path?: string; location?: string }[];
    user?: User;
    activity?: Activity;
    activities?: Activity[];
    appointment?: Appointment;
    appointments?: Appointment[];
    doctor?: Doctor; // For single doctor response
    doctors?: Doctor[]; // For multiple doctors response
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse extends ServerResponse {
    token?: string; // Access token returned in the body
}

export interface RefreshResponse extends ServerResponse {
    token?: string; // New access token returned in the body
}
