"use client";

import React from 'react';
import Link from 'next/link';

const MealsComingSoonPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Meals Section
        </h1>
        <p className="text-xl text-indigo-600 mb-6">
          Coming Soon!
        </p>
        <p className="text-gray-700 leading-relaxed mb-8">
          We're diligently working on bringing you a comprehensive meal tracking and management feature. Stay tuned for exciting updates!
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default MealsComingSoonPage;
