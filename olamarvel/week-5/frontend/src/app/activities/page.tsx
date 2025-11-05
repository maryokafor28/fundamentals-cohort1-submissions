"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getActivities } from '@/services/activity';
import { Activity } from '@/lib/type';
import ActivityCard from '@/components/ActivityCard';
import { useRequireAuth } from '@/hooks/user';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: isUserLoading } = useRequireAuth();

  useEffect(() => {
    if (user) { // Only fetch activities if the user is authenticated
      const fetchActivities = async () => {
        try {
          setLoading(true);
          const fetchedActivities = await getActivities();
          setActivities(fetchedActivities);
        } catch (err) {
          setError('Failed to load activities. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchActivities();
    }
  }, [user]);

  if (isUserLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading activities...</p>
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Activities</h1>
          <Link
            href="/activities/create"
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            + Log New Activity
          </Link>
        </div>

        {activities.length > 0 ? (
          <div>
            {activities.map((activity) => (
              <ActivityCard key={activity._id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <p className="text-gray-500">You haven't logged any activities yet.</p>
            <p className="text-gray-500 mt-2">
              Click the button above to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesPage;
