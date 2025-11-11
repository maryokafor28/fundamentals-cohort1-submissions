import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointment } from "@/hooks/useAppointment";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

export default function AppointmentList() {
  const navigate = useNavigate();
  const { appointments, fetchAppointments, cancelAppointment, loading, error } =
    useAppointment();
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filtered = appointments.filter((a) => {
    const userId = typeof a.user === "string" ? a.user : a.user?._id;
    const doctorId = typeof a.doctor === "string" ? a.doctor : a.doctor?._id;
    return userId === user?._id || doctorId === user?._id;
  });

  if (filtered.length === 0)
    return <p className="text-gray-600">No appointments found.</p>;

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      alert("Appointment cancelled successfully.");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to cancel appointment.";
      alert(message);
    }
  };

  return (
    <div className="space-y-4">
      {filtered.map((a) => {
        const userId = typeof a.user === "string" ? a.user : a.user?._id;
        const isOwner = userId === user?._id;
        const canEdit =
          isOwner && a.status !== "cancelled" && a.status !== "completed";

        return (
          <div
            key={a._id}
            className="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Doctor:</strong>{" "}
                {typeof a.doctor === "string" ? a.doctor : a.doctor?.name}
              </p>
              <p>
                <strong>Date:</strong> {new Date(a.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {a.time}
              </p>
              {a.reason && (
                <p>
                  <strong>Reason:</strong> {a.reason}
                </p>
              )}
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    a.status === "cancelled"
                      ? "text-red-500"
                      : a.status === "completed"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {a.status}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              {/* Edit button - only for appointment owner and non-cancelled/completed */}
              {canEdit && (
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-500 hover:bg-blue-50"
                  onClick={() => navigate(`/appointments/edit/${a._id}`)}
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
              )}

              {/* Cancel button - only if not already cancelled */}
              {isOwner && a.status !== "cancelled" && (
                <Button
                  variant="outline"
                  className="text-red-600 border-red-500 hover:bg-red-50"
                  onClick={() => handleCancel(a._id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Cancel
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
