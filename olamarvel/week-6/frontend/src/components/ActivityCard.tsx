import { Activity } from '@/lib/type';
import Link from 'next/link';
import React from 'react';

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <Link href={`/activities/${activity._id}`} className="block hover:bg-gray-50 transition duration-150">
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-transparent hover:border-indigo-300">
        <h3 className="text-xl font-bold text-indigo-600">{activity.type}</h3>
        {activity.description && <p className="text-gray-700 mt-2 truncate">{activity.description}</p>}
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <span>
            <strong>Duration:</strong> {activity.durationMinutes} minutes
          </span>
          {activity.caloriesBurned && (
            <span>
              <strong>Calories Burned:</strong> {activity.caloriesBurned}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Logged on: {new Date(activity.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
};

export default ActivityCard;
