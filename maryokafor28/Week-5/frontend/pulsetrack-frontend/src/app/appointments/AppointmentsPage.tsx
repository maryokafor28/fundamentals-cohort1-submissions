// app/appointmentpage.tsx
import { Button } from "@/components/ui/button";
import AppointmentList from "@/components/appointments/AppointmentList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function AppointmentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-20">
        <p>You must be logged in to view appointments.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-primary">My Appointments</h1>
        <Button onClick={() => navigate("/doctors")}>Book Appointment</Button>
      </div>

      <AppointmentList />
    </div>
  );
}
