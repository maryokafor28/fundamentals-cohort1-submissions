import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthProvider";
import Home from "@/app/Home";
import LoginPage from "@/app/auth/SignIn";
import SignupPage from "@/app/auth/SignUp";
import ProtectedRoute from "@/app/protectedRoute";
import UsersPage from "@/app/users/UsersPage";
import EditUserPage from "@/app/users/EditUserPage";
import DoctorsPage from "@/app/doctors/DoctorsPage";
import EditDoctorPage from "@/app/doctors/EditDoctorPage";
import AppointmentsPage from "@/app/appointments/AppointmentsPage";
import CreateAppointmentPage from "@/app/appointments/CreateAppointment";
import EditAppointmentPage from "@/app/appointments/EditAppointmentPage";
import ActivitiesPage from "@/app/activities/ActivitiesPage";
import Layout from "@/components/layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ✅ Protected routes inside Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* User management */}
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/edit/:id" element={<EditUserPage />} />
            {/* Doctors */}
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/edit/:id" element={<EditDoctorPage />} />
            {/* Appointments */}
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route
              path="/appointments/create/:doctorId"
              element={<CreateAppointmentPage />}
            />
            <Route
              path="/appointments/edit/:appointmentId"
              element={<EditAppointmentPage />}
            />
            5{/* Activities */}
            <Route path="/activities" element={<ActivitiesPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
