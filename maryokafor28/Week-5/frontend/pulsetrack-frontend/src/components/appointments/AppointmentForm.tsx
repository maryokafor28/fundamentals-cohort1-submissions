import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointment } from "@/hooks/useAppointment";
import { useAuth } from "@/hooks/useAuth";
import type { Doctor } from "@/lib/types";
import { DoctorAPI } from "@/services/doctorApi";
import { Button } from "../ui/button";

interface AppointmentFormProps {
  doctorId?: string;
  appointmentId?: string;
  mode?: "create" | "edit";
}

export default function AppointmentForm({
  doctorId,
  appointmentId,
  mode = "create",
}: AppointmentFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createAppointment, updateAppointment, appointments } =
    useAppointment();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Load existing appointment data in edit mode
  useEffect(() => {
    if (mode === "edit" && appointmentId) {
      const appointment = appointments.find((a) => a._id === appointmentId);
      if (appointment) {
        // Check if logged-in user owns this appointment
        const appointmentUserId =
          typeof appointment.user === "string"
            ? appointment.user
            : appointment.user?._id;

        if (appointmentUserId !== user?._id) {
          alert("You can only edit your own appointments.");
          navigate("/appointments");
          return;
        }

        // Pre-fill form with existing data
        setDate(new Date(appointment.date).toISOString().split("T")[0]);
        setTime(appointment.time);
        setReason(appointment.reason || "");

        // Load doctor info
        const doctorIdToFetch =
          typeof appointment.doctor === "string"
            ? appointment.doctor
            : appointment.doctor?._id;

        if (doctorIdToFetch) {
          DoctorAPI.getById(doctorIdToFetch)
            .then((data) => setDoctor(data))
            .catch(() => console.warn("Failed to load doctor"));
        }
      }
    }
  }, [mode, appointmentId, appointments, user, navigate]);

  // Load doctor in create mode
  useEffect(() => {
    if (mode === "create" && doctorId) {
      DoctorAPI.getById(doctorId)
        .then((data) => setDoctor(data))
        .catch(() => console.warn("Failed to load doctor"));
    }
  }, [mode, doctorId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user?._id) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "edit" && appointmentId) {
        // Update existing appointment
        await updateAppointment(appointmentId, {
          date: new Date(date).toISOString(),
          time,
          reason,
        });
        alert("Appointment updated successfully!");
      } else {
        // Create new appointment
        if (!doctorId) {
          alert("Missing doctor information.");
          setLoading(false);
          return;
        }

        await createAppointment({
          user: user._id,
          doctor: doctorId,
          date: new Date(date).toISOString(),
          time,
          reason,
        });
        alert("Appointment booked successfully!");
      }
      navigate("/appointments");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : `Failed to ${mode === "edit" ? "update" : "book"} appointment.`;
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      {doctor && (
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <p className="text-sm text-gray-700">
            {mode === "edit"
              ? "Editing appointment with"
              : "Booking appointment with"}{" "}
            <span className="font-semibold text-blue-700">
              {doctor.name} ({doctor.specialization})
            </span>
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full border rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe your symptoms or reason for visit"
          className="w-full border rounded-md p-2"
          rows={4}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading
            ? mode === "edit"
              ? "Updating..."
              : "Booking..."
            : mode === "edit"
            ? "Update Appointment"
            : "Book Appointment"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/appointments")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
