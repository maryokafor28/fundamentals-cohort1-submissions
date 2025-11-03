import Button from "../component/ui/Button";
import { FiPhone } from "react-icons/fi";
import { TfiEmail } from "react-icons/tfi";
import { RiHospitalLine } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import type { DisplayDoctorCard, Doctor } from "../types/type";
import { useEffect, useState } from "react";
import SectionHeader from "../component/ui/SectionHeader";
import AddDoctorForm, { type
  DoctorFormData,
} from "../forms/AddDoctorForm";

function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [showForm, setShowForm] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${baseUrl}/doctors`);
        if (!response.ok) throw Error("Failed to fetch Doctors");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unexpected Error Occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [baseUrl]);

  const handleAddDoctor = async (doctorData: DoctorFormData) => {
    try {
      const response = await fetch(`${baseUrl}/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorData),
      });

      if (!response.ok) throw new Error("Failed to add doctor");

      const newDoctor = await response.json();
      setDoctors((prev) => [...prev, newDoctor]);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Error adding doctor");
    }
  };

  return (
    <div>
      <SectionHeader
        title="Doctors"
        subtitle="Manage healthcare providers in the system"
      >
        <Button onClick={() => setShowForm(true)}>Add Doctor</Button>
      </SectionHeader>

      {loading && <p className="mt-4 text-gray-500">Loading Doctors...</p>}
      {error && (
        <p className="mt-4 text-red-500">Error Loading Doctors: {error}</p>
      )}

      <ul className="flex flex-col md:flex-row md:flex-wrap gap-4">
        {doctors.map((doctor) => (
          <DisplayDoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </ul>

      {showForm && (
        <AddDoctorForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddDoctor}
        />
      )}
    </div>
  );
}

function DisplayDoctorCard({ doctor }: DisplayDoctorCard) {
  return (
    <li className="list-none border p-4 rounded-lg ">
      <div className="flex justify-between min-w-[250px]">
        <div className="bg-lightGreen w-fit p-3 rounded-md">
          <FaUserDoctor className="text-darkGreen text-xl" />
        </div>
        <p className="bg-lightGreen text-darkGreen rounded-md h-fit border border-darkGreen text-xs px-4 py-0.5">
          {doctor.specialty}
        </p>
      </div>

      <p className="my-8 font-medium text-base">{doctor.name}</p>

      <div className="flex items-center space-x-2">
        <FiPhone className="text-[#9AA0AE]" />
        <span className="text-sm">{doctor.phone}</span>
      </div>

      <div className="flex items-center space-x-2 ">
        <TfiEmail className="text-[#9AA0AE]" />
        <span className="text-sm">{doctor.email}</span>
      </div>

      <div className="flex items-center space-x-2 ">
        <RiHospitalLine className="text-[#9AA0AE]" />
        <span className="text-sm">{doctor.hospital}</span>
      </div>
    </li>
  );
}

export default Doctors;
