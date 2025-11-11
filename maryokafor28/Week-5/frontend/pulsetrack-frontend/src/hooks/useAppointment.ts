// src/hooks/useAppointment.tsx
import { useState, useCallback } from "react";
import { AppointmentAPI } from "@/services/appointmentApi";
import type { Appointment } from "@/lib/types";

export function useAppointment() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** ✅ Fetch all appointments */
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AppointmentAPI.getAll();
      setAppointments(data);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch appointments";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  /** ✅ Create new appointment */
  const createAppointment = useCallback(async (data: Partial<Appointment>) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure date is a string
      const formattedData = {
        ...data,
        date:
          typeof data.date === "string"
            ? data.date
            : (data.date as Date | undefined)?.toISOString() ?? "",
      };

      const newAppointment = await AppointmentAPI.create(formattedData);
      setAppointments((prev) => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create appointment";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** ✅ Update appointment */
  const updateAppointment = useCallback(
    async (id: string, data: Partial<Appointment>) => {
      try {
        setLoading(true);
        setError(null);
        const updated = await AppointmentAPI.update(id, data);
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? updated : a))
        );
        return updated;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to update appointment";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /** ✅ Cancel appointment (update status instead of delete) */
  const cancelAppointment = useCallback(
    async (id: string) => {
      try {
        await updateAppointment(id, { status: "cancelled" });
      } catch (err) {
        console.error("Cancel failed:", err);
      }
    },
    [updateAppointment]
  );

  /** ✅ Delete appointment (if needed) */
  const deleteAppointment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await AppointmentAPI.delete(id);
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete appointment";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
  };
}
