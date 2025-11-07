import { useEffect, useState } from "react";
import Button from "../component/ui/Button";
import SectionHeader from "../component/ui/SectionHeader";
import type { AppointmentProps } from "../types/type";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin5Line } from "react-icons/ri";

const Appointment = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/appointments`);
        if (!response.ok) throw new Error("Failed to fetch appointments");

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unexpected error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [baseUrl]);

  return (
    <div>
      <SectionHeader
        title="Appointments"
        subtitle="Manage patient appointments with doctors"
      >
        <Button>Book Appointment</Button>
      </SectionHeader>

      {loading && <p>Loading Appointments...</p>}
      {error && <p>Error Loading Appointments: {error}</p>}

      {!loading && !error && (
        <div className="">
          

          {loading && <p className="mt-4 text-gray-500">Loading Users...</p>}
          {error && <p className="mt-4 text-red-500">Error: {error}</p>}
          {!loading && !error && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    date & time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="text-sm px-6 py-4 whitespace-nowrap ">
                      <span className="user-icon">
                        {appointment.user.name[0]}
                      </span>
                      {appointment.user.name}
                    </td>
                    <td className="text-sm px-6 py-4 whitespace-nowrap">
                      {appointment.doctor.name}
                    </td>
                    <td className="text-sm px-6 py-4 whitespace-nowrap">
                      {appointment.reason}
                    </td>
                    <td className="text-sm px-6 py-4 whitespace-nowrap">
                      {appointment.status}
                    </td>
                    <td className="flex gap-4 py-4 px-6">
                      <LiaEditSolid />{" "}
                      <RiDeleteBin5Line className="text-red-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointment;
