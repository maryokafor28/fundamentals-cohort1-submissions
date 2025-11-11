import { useParams } from "react-router-dom";
import AppointmentForm from "@/components/appointments/AppointmentForm";

export default function CreateAppointmentPage() {
  const { doctorId } = useParams<{ doctorId: string }>();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Book Appointment
      </h1>
      <AppointmentForm doctorId={doctorId ?? ""} />
    </div>
  );
}
