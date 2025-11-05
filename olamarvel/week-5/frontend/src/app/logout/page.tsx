"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user';

const LogoutPage = () => {
  const { logout, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      if (user) { // Only attempt to logout if a user is currently logged in
        await logout();
      }
      router.push('/login'); // Always redirect to login after trying to logout
    };

    performLogout();
  }, [logout, router, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Logging out...
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please wait while we log you out.
        </p>
      </div>
    </div>
  );
};

export default LogoutPage;
