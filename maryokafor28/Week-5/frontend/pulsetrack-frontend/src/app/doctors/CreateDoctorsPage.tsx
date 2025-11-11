import { useNavigate } from "react-router-dom";
import { DoctorAPI } from "@/services/doctorApi";
import DoctorForm from "@/components/doctors/DoctorForm";

export default function CreateDoctorPage() {
  const navigate = useNavigate();

  type DoctorInput = Parameters<typeof DoctorAPI.create>[0];

  const handleSubmit = async (data: DoctorInput) => {
    await DoctorAPI.create(data);
    navigate("/doctors");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Add Doctor</h1>
      <DoctorForm onSubmit={handleSubmit} />
    </div>
  );
}
