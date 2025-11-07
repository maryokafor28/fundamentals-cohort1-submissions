"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAppointmentById } from '@/services/appointment';
import { Appointment, Doctor } from '@/lib/type';
import { useRequireAuth } from '@/hooks/user';

const AppointmentDetailPage = () => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.id as string; 
  const { user, isLoading: isUserLoading } = useRequireAuth();

  useEffect(() => {
    if (user && id) { 
      const fetchAppointment = async () => {
        try {
          setLoading(true);
          const fetchedAppointment = await getAppointmentById(id);
          if (fetchedAppointment) {
            setAppointment(fetchedAppointment);
          } else {
            setError('Appointment not found.');
          }
        } catch (err) {
          setError('Failed to load appointment details.');
        } finally {
          setLoading(false);
        }
      };

      fetchAppointment();
    }
  }, [user, id]);

  if (isUserLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading appointment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-red-500 text-lg">{error}</p>
          <Link href="/appointments" className="mt-4 inline-block text-indigo-600 hover:underline">
            &larr; Back to all appointments
          </Link>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return null; 
  }

  const doctorName = typeof appointment.doctor === 'object' 
    ? appointment.doctor.name 
    : appointment.doctor;

  const doctorSpecialty = typeof appointment.doctor === 'object' 
    ? appointment.doctor.specialty 
    : 'N/A';

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Appointment Details</h1>
            <Link href="/appointments" className="text-sm text-indigo-600 hover:underline whitespace-nowrap">
                &larr; Back to list
            </Link>
        </div>
        
        <div className="mb-6">
            <p className="text-gray-700 mb-2"><strong className="font-medium">Doctor:</strong> {doctorName} ({doctorSpecialty})</p>
            <p className="text-gray-700 mb-2"><strong className="font-medium">Time:</strong> {new Date(appointment.time).toLocaleString()}</p>
            <p className="text-gray-700 mb-2"><strong className="font-medium">Status:</strong> <span className={`px-2 py-1 rounded-full text-sm font-semibold ${statusClasses}`}>{appointment.status}</span></p>
            {appointment.notes && (
                <p className="text-gray-700 mt-4"><strong className="font-medium">Notes:</strong> {appointment.notes}</p>
            )}
        </div>

      </div>
    </div>
  );
};

export default AppointmentDetailPage;
