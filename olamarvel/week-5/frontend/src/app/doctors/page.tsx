"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDoctors } from '@/services/doctor';
import { Doctor } from '@/lib/type';
import DoctorCard from '@/components/DoctorCard';
import { useRequireAuth } from '@/hooks/user';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: isUserLoading } = useRequireAuth();

  useEffect(() => {
    if (user) { 
      const fetchDoctors = async () => {
        try {
          setLoading(true);
          const fetchedDoctors = await getDoctors();
          setDoctors(fetchedDoctors);
        } catch (err) {
          setError('Failed to load doctors. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchDoctors();
    }
  }, [user]);

  if (isUserLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading doctors...</p>
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
          <h1 className="text-3xl font-bold text-gray-800">Our Doctors</h1>
          <Link
            href="/doctors/create"
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            + Add New Doctor
          </Link>
        </div>

        {doctors.length > 0 ? (
          <div>
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <p className="text-gray-500">No doctors found.</p>
            <p className="text-gray-500 mt-2">
              Click the button above to add a new doctor!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
