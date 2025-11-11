import type { Doctor } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "@/hooks/useDoctor";
import { motion } from "framer-motion";

interface Props {
  doctors: Doctor[];
  currentUserEmail?: string | null; // ✅ Changed to email for comparison
}

export default function DoctorsList({ doctors, currentUserEmail }: Props) {
  const navigate = useNavigate();
  const { deleteDoctor } = useDoctors();

  const handleDelete = async (doctorId: string) => {
    if (
      !confirm(
        " Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteDoctor(doctorId);
      //  Redirect to home after successful deletion
      navigate("/", {
        state: {
          message:
            "Your profile has been deleted successfully. Please logout from the navbar.",
        },
      });
    } catch (error) {
      alert("Failed to delete profile. Please try again.");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-4 ">
      {doctors.map((doctor, index) => {
        //  Check if this is the logged-in doctor's profile by EMAIL
        const isOwnProfile = currentUserEmail === doctor.email;

        return (
          <motion.div
            key={doctor._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`rounded-2xl p-6 hover:shadow-lg transition-all ${
                isOwnProfile
                  ? "bg-primary border-2 border-primary/45 shadow-md" //  Highlight own profile
                  : "bg-primary/10 border border-primary/20"
              }`}
            >
              <CardContent className="p-0">
                {/*  Doctor Info Section */}
                <div className="mb-4">
                  {/* Doctor Name */}
                  <h2 className="text-secondary font-semibold text-xl mb-2">
                    {doctor.name}
                  </h2>

                  {/* Specialization */}
                  <p className=" text-sm mb-2">
                    <span className="font-medium">Specialization:</span>{" "}
                    {doctor.specialization}
                  </p>

                  {/* Email */}
                  <p className=" text-sm mb-1">
                    <span className="font-medium">📧 Email:</span>{" "}
                    {doctor.email}
                  </p>

                  {/* Phone */}
                  {doctor.phone && (
                    <p className=" text-sm mb-1">
                      <span className="font-medium">📞 Phone:</span>{" "}
                      {doctor.phone}
                    </p>
                  )}
                </div>

                {/*  Action Buttons */}
                <div className="flex gap-2 mt-4">
                  {/*  BOOK APPOINTMENT - Show only for OTHER doctors (not own profile) */}
                  {!isOwnProfile && (
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(`/appointments/create/${doctor._id}`)
                      }
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Book Appointment
                    </Button>
                  )}

                  {/* ✅ EDIT - Only show on OWN profile */}
                  {isOwnProfile && (
                    <Button
                      size="sm"
                      variant={"outline"}
                      onClick={() => navigate(`/doctors/edit/${doctor._id}`)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit Profile
                    </Button>
                  )}

                  {/*  DELETE - Only show on OWN profile */}
                  {isOwnProfile && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(doctor._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
