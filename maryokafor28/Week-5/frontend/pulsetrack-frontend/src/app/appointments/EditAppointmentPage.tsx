import { useParams } from "react-router-dom";
import AppointmentForm from "@/components/appointments/AppointmentForm";

export default function EditAppointmentPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Edit Appointment
      </h1>
      <AppointmentForm appointmentId={appointmentId} mode="edit" />
    </div>
  );
}
