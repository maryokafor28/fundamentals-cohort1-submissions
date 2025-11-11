import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DoctorForm from "@/components/doctors/DoctorForm";
import { DoctorAPI } from "@/services/doctorApi";
import type { Doctor } from "@/lib/types";

export default function EditDoctorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (id) {
      DoctorAPI.getById(id).then(setDoctor);
    }
  }, [id]);

  const handleSubmit = async (data: Partial<Doctor>) => {
    if (!id) return;
    await DoctorAPI.update(id, data);
    navigate("/doctors");
  };

  if (!doctor) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Doctor</h1>
      <DoctorForm initialData={doctor} onSubmit={handleSubmit} />
    </div>
  );
}
