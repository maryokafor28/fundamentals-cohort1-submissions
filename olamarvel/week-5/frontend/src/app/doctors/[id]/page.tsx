"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getDoctorById } from '@/services/doctor';
import { Doctor, InteractingUser } from '@/lib/type';
import { useRequireAuth } from '@/hooks/user';

const DoctorDetailPage = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [interactingUsers, setInteractingUsers] = useState<InteractingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.id as string;

  const { user, isLoading: isUserLoading } = useRequireAuth();

  useEffect(() => {
    if (user && id) { 
      const fetchDoctor = async () => {
        try {
          setLoading(true);
          const response = await getDoctorById(id);
          if (response) {
            
            setDoctor(response as Doctor);
            setInteractingUsers(response.interactingUsers || []);
          } else {
            setError('Doctor not found.');
          }
        } catch (err) {
          setError('Failed to load doctor details.');
        } finally {
          setLoading(false);
        }
      };

      fetchDoctor();
    }
  }, [user, id]);

  if (isUserLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading doctor details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-red-500 text-lg">{error}</p>
          <Link href="/doctors" className="mt-4 inline-block text-indigo-600 hover:underline">
            &larr; Back to all doctors
          </Link>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Dr. {doctor.name}</h1>
            <Link href="/doctors" className="text-sm text-indigo-600 hover:underline whitespace-nowrap">
                &larr; Back to list
            </Link>
        </div>
        
        {doctor.specialty && (
            <p className="text-gray-700 mb-2"><strong className="font-medium">Specialty:</strong> {doctor.specialty}</p>
        )}
        {doctor.contact && (
            <p className="text-gray-700 mb-6"><strong className="font-medium">Contact:</strong> {doctor.contact}</p>
        )}

        {/* Interacting Users Section */}
        {interactingUsers.length > 0 && (
            <div className="mt-8 border-t pt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Patients who interacted</h3>
                <ul className="list-disc list-inside space-y-2">
                    {interactingUsers.map((user, index) => (
                        <li key={index} className="text-gray-700">
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>
        )}

      </div>
    </div>
  );
};

export default DoctorDetailPage;
