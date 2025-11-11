import { useState, useCallback } from "react";
import { DoctorAPI } from "@/services/doctorApi";
import type { Doctor } from "@/lib/types";

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** ✅ Fetch all doctors */
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DoctorAPI.getAll();
      console.log("Fetched doctors:", data); // 👈 Add this

      setDoctors(data);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to fetch doctors";
      setError(msg);
      console.error("Fetch doctors error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /** ✅ Get doctor by ID — needs `doctors` */
  const getDoctorById = useCallback(
    async (id: string): Promise<Doctor | null> => {
      try {
        const found = doctors.find((doc) => doc._id === id);
        if (found) return found;
        return await DoctorAPI.getById(id);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to get doctor";
        setError(msg);
        console.error("Get doctor by ID error:", err);
        return null;
      }
    },
    [doctors]
  );

  /** ✅ Create doctor — no need for `doctors` */
  const createDoctor = useCallback(async (data: Partial<Doctor>) => {
    try {
      setLoading(true);
      setError(null);
      const newDoctor = await DoctorAPI.create(data);
      setDoctors((prev) => [...prev, newDoctor]);
      return newDoctor;
    } catch (err) {
      console.error("Create doctor error:", err);
      setError("Failed to create doctor");
    } finally {
      setLoading(false);
    }
  }, []);

  /** ✅ Update doctor — no need for `doctors` */
  const updateDoctor = useCallback(
    async (id: string, data: Partial<Doctor>) => {
      try {
        setLoading(true);
        setError(null);
        const updated = await DoctorAPI.update(id, data);
        setDoctors((prev) =>
          prev.map((doc) => (doc._id === id ? updated : doc))
        );
        return updated;
      } catch (err) {
        console.error("Update doctor error:", err);
        setError("Failed to update doctor");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /** ✅ Delete doctor — no need for `doctors` */
  const deleteDoctor = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await DoctorAPI.delete(id);
      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error("Delete doctor error:", err);
      setError("Failed to delete doctor");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    doctors,
    loading,
    error,
    fetchDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  };
}
