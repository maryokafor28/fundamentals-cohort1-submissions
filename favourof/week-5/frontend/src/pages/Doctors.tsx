import { useEffect, useState } from "react";
import { useDoctorStore } from "../store/useDoctorStore";
import DoctorForm from "../components/forms/DoctorForm";

const Doctors = () => {
  const { doctors, fetchDoctors, removeDoctor, editDoctor, loading } =
    useDoctorStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedSpecialty, setUpdatedSpecialty] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleUpdate = async (id: string) => {
    if (!updatedName.trim() || !updatedEmail.trim() || !updatedSpecialty.trim())
      return;
    await editDoctor(id, {
      name: updatedName,
      email: updatedEmail,
      specialty: updatedSpecialty,
    });
    setEditing(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Doctors</h2>
      <DoctorForm />
      {loading && <p className="text-gray-500">Loading doctors...</p>}

      <div className="space-y-3">
        {Array.isArray(doctors) && doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{doctor.name}</p>
                <p className="text-gray-500">{doctor.email}</p>
                <p className="text-gray-400 text-sm">{doctor.specialty}</p>
              </div>

              <div className="flex gap-3">
                {editing === doctor._id ? (
                  <div className="flex flex-col md:flex-row gap-2 items-center">
                    <input
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                      className="border px-2 py-1 rounded"
                      placeholder="New name"
                    />
                    <input
                      value={updatedEmail}
                      onChange={(e) => setUpdatedEmail(e.target.value)}
                      className="border px-2 py-1 rounded"
                      placeholder="New email"
                    />
                    <input
                      value={updatedSpecialty}
                      onChange={(e) => setUpdatedSpecialty(e.target.value)}
                      className="border px-2 py-1 rounded"
                      placeholder="New specialty"
                    />
                    <button
                      onClick={() => handleUpdate(doctor._id!)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditing(doctor._id!);
                        setUpdatedName(doctor.name);
                        setUpdatedEmail(doctor.email);
                        setUpdatedSpecialty(doctor.specialty);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeDoctor(doctor._id!)}
                      className="bg-rose-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default Doctors;
