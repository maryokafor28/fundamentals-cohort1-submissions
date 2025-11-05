"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createAppointment } from '@/services/appointment';
import { getDoctors } from '@/services/doctor';
import { Doctor } from '@/lib/type';
import { useRequireAuth } from '@/hooks/user';

const CreateAppointmentPage = () => {
  const [time, setTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [notes, setNotes] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]); 
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useRequireAuth();

  useEffect(() => {
    if (user) {
      const fetchDoctors = async () => {
        try {
          setDoctorsLoading(true);
          const fetchedDoctors = await getDoctors();
          setDoctors(fetchedDoctors);
          if (fetchedDoctors.length > 0) {
            setSelectedDoctor(fetchedDoctors[0]._id);
          }
        } catch (err) {
          setError('Failed to load doctors. Cannot schedule appointment.');
        } finally {
          setDoctorsLoading(false);
        }
      };
      fetchDoctors();
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedDoctor) {
        setError("Please select a doctor.");
        setLoading(false);
        return;
    }

    if (!time) {
        setError("Please select a date and time for the appointment.");
        setLoading(false);
        return;
    }

    try {
      const response = await createAppointment({
        time: new Date(time).toISOString(),
        doctor: selectedDoctor,
        notes,
        status: "scheduled", 
      });

      if (response.success) {
        router.push('/appointments'); 
      } else {
        if (response.errors && response.errors.length > 0) {
          setError(response.errors.map(err => err.msg).join(', '));
        } else {
          setError(response.message || response.error || 'Failed to schedule appointment.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading || doctorsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading doctors for scheduling...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Schedule New Appointment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
              Select Doctor
            </label>
            {doctors.length > 0 ? (
              <select
                id="doctor"
                required
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} ({doctor.specialty || 'General'})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-500">No doctors available. Please add a doctor first.</p>
            )}
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Date and Time
            </label>
            <input
              id="time"
              type="datetime-local"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Discuss previous symptoms, follow-up on medication."
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading || doctors.length === 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointmentPage;
