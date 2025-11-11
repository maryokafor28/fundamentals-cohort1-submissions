import { useEffect } from "react";
import { motion } from "framer-motion";
import DoctorsList from "@/components/doctors/DoctorsList";
import { useDoctors } from "@/hooks/useDoctor";
import { useAuth } from "@/hooks/useAuth";

export default function DoctorsPage() {
  const { doctors, fetchDoctors, loading, error } = useDoctors();
  const { user } = useAuth(); // ✅ Get logged-in user info

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // ✅ Check if logged-in user is a doctor
  const isDoctor = user?.role === "doctor";
  const currentUserEmail = isDoctor ? user?.email : null; // ✅ FIXED

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-primary">Doctors</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading doctors...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-2">{error}</p>
            <p className="text-muted-foreground">
              Unable to load doctors. Please try again.
            </p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No doctors available at the moment.
            </p>
          </div>
        ) : (
          <DoctorsList
            doctors={doctors}
            currentUserEmail={currentUserEmail} // ✅ Compare using email now
          />
        )}
      </motion.div>
    </div>
  );
}
