"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UserProfile from "@/components/profile/UserProfile";
import { UserAPI } from "@/api/user";
import { UserProfile as UserProfileType } from "@/types";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await UserAPI.getById(userId); // ✅ Use getById instead
        setUser(data);
      } catch (error) {
        console.error("❌ Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-400">Loading profile...</p>
    );

  if (!user)
    return <p className="text-center mt-20 text-gray-400">User not found.</p>;

  return <UserProfile user={user} editable={false} />;
}
