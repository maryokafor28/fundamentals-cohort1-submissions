import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate from react-router-dom
import { useUser } from '@/context/user';

const LogoutPage = () => {
  const { logout, user } = useUser();
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    const performLogout = async () => {
      if (user) { // Only attempt to logout if a user is currently logged in
        await logout();
      }
      navigate('/login'); // Always redirect to login after trying to logout
    };

    performLogout();
  }, [logout, navigate, user]);

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
