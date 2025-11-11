"use client";

import { useAuth } from "@/context/AuthProvider";
import UserProfile from "@/components/profile/UserProfile";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading)
    return <p className="text-center mt-20 text-gray-400">Loading...</p>;
  if (!user)
    return (
      <p className="text-center mt-20 text-gray-400">
        Please log in to view your profile.
      </p>
    );

  return <UserProfile user={user} editable={true} />;
}
