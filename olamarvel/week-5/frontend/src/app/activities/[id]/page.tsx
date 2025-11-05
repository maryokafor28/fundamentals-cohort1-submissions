"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getActivityById } from '@/services/activity';
import { Activity } from '@/lib/type';
import { useRequireAuth } from '@/hooks/user';

const ActivityDetailPage = () => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.id as string; // Get the id from the dynamic route

  const { user, isLoading: isUserLoading } = useRequireAuth();

  useEffect(() => {
    if (user && id) { // Only fetch if user is authenticated and id is present
      const fetchActivity = async () => {
        try {
          setLoading(true);
          const fetchedActivity = await getActivityById(id);
          if (fetchedActivity) {
            setActivity(fetchedActivity);
          } else {
            setError('Activity not found.');
          }
        } catch (err) {
          setError('Failed to load activity details.');
        } finally {
          setLoading(false);
        }
      };

      fetchActivity();
    }
  }, [user, id]);

  if (isUserLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading activity details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-red-500 text-lg">{error}</p>
          <Link href="/activities" className="mt-4 inline-block text-indigo-600 hover:underline">
            &larr; Back to all activities
          </Link>
        </div>
      </div>
    );
  }

  if (!activity) {
    return null; // Should be handled by the error state
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{activity.type}</h1>
            <Link href="/activities" className="text-sm text-indigo-600 hover:underline whitespace-nowrap">
                &larr; Back to list
            </Link>
        </div>
        
        {activity.description && (
            <p className="text-gray-700 mb-6">{activity.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Duration</span>
            <span className="text-lg font-semibold text-gray-900">{activity.durationMinutes} minutes</span>
          </div>
          {activity.caloriesBurned && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">Calories Burned</span>
              <span className="text-lg font-semibold text-gray-900">{activity.caloriesBurned}</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Date Logged</span>
            <span className="text-lg font-semibold text-gray-900">{new Date(activity.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
