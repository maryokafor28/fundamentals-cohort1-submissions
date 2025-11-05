import { Appointment, Doctor } from '@/lib/type';
import Link from 'next/link';
import React from 'react';

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const doctorName = typeof appointment.doctor === 'object' ? appointment.doctor.name : appointment.doctor; // Handle populated or unpopulated doctor
  const appointmentTime = new Date(appointment.time).toLocaleString();

  let statusClasses = "";
  switch (appointment.status) {
    case "scheduled":
      statusClasses = "bg-blue-100 text-blue-800";
      break;
    case "completed":
      statusClasses = "bg-green-100 text-green-800";
      break;
    case "cancelled":
      statusClasses = "bg-red-100 text-red-800";
      break;
    default:
      statusClasses = "bg-gray-100 text-gray-800";
  }

  return (
    <Link href={`/appointments/${appointment._id}`} className="block hover:bg-gray-50 transition duration-150">
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-transparent hover:border-indigo-300">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">Appointment with {doctorName}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses}`}>
            {appointment.status}
          </span>
        </div>
        <p className="text-gray-700">Time: {appointmentTime}</p>
        {appointment.notes && <p className="text-gray-600 text-sm mt-1 truncate">Notes: {appointment.notes}</p>}
      </div>
    </Link>
  );
};

export default AppointmentCard;
