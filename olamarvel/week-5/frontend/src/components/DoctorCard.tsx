import { Doctor } from '@/lib/type';
import Link from 'next/link';
import React from 'react';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <Link href={`/doctors/${doctor._id}`} className="block hover:bg-gray-50 transition duration-150">
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-transparent hover:border-indigo-300">
        <h3 className="text-xl font-bold text-indigo-600">{doctor.name}</h3>
        {doctor.specialty && <p className="text-gray-700 mt-2">Specialty: {doctor.specialty}</p>}
        {doctor.contact && <p className="text-gray-700">Contact: {doctor.contact}</p>}
        {doctor.interactingUsers && doctor.interactingUsers.length > 0 && <p className='text-gray-700'> {doctor.interactingUsers.length} interacting users</p>}
      </div>
    </Link>
  );
};

export default DoctorCard;
