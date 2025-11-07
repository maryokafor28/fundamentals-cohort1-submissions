"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAppointments } from '@/services/appointment';
import { Appointment } from '@/lib/type';
import AppointmentCard from '@/components/AppointmentCard';
import { useRequireAuth } from '@/hooks/user';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: isUserLoading } = useRequireAuth();

  useEffect(() => {
    if (user) { 
      const fetchAppointments = async () => {
        try {
          setLoading(true);
          const fetchedAppointments = await getAppointments();
          setAppointments(fetchedAppointments);
        } catch (err) {
          setError('Failed to load appointments. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchAppointments();
    }
  }, [user]);

  if (isUserLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Appointments</h1>
          <Link
            href="/appointments/create"
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            + Schedule New Appointment
          </Link>
        </div>

        {appointments.length > 0 ? (
          <div>
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment._id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <p className="text-gray-500">You haven't scheduled any appointments yet.</p>
            <p className="text-gray-500 mt-2">
              Click the button above to schedule your first appointment!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
