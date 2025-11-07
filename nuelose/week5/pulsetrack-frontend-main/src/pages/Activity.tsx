import { useEffect, useState } from "react";
import { GoPulse } from "react-icons/go";
import { RiTimerLine } from "react-icons/ri";
import { HiMiniFire } from "react-icons/hi2";
import Button from "../component/ui/Button";
import SectionHeader from "../component/ui/SectionHeader";
import AddActivityForm, {
  type ActivityFormData,
} from "../forms/AddActivityForm";
import type { Activities, DisplayActivityProp } from "../types/type";

function Activity() {
  const [activities, setActivity] = useState<Activities[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [showForm, setShowForm] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`${baseUrl}/activities`);
        if (!response.ok) throw new Error("Failed to fetch activities");

        const data = await response.json();
        setActivity(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [baseUrl]);

  const handleAddActivity = async (activityData: ActivityFormData) => {
    try {
      const response = await fetch(`${baseUrl}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) throw new Error("Failed to add activity");

      const newActivity = await response.json();
      setActivity((prev) => [...prev, newActivity]);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Error adding activity");
    }
  };

  return (
    <div>
      <SectionHeader
        title="Activities"
        subtitle="Track physical activities and calorie burn"
      >
        <Button onClick={() => setShowForm(true)}>Add Activity</Button>
      </SectionHeader>

      {loading && <p>Loading activities...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <ul className="flex flex-col md:flex-row md:flex-wrap gap-4 ">
          {activities.map((activity) => (
            <DisplayActivity key={activity._id} activity={activity} />
          ))}
        </ul>
      )}

      {showForm && (
        <AddActivityForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddActivity}
        />
      )}
    </div>
  );
}

function DisplayActivity({ activity }: DisplayActivityProp) {
  return (
    <li className="list-none border p-4 rounded-lg hover:shadow-lg">
      <div className="flex justify-between min-w-[250px]">
        <div className="bg-lightGreen w-fit p-3 rounded-md">
          <GoPulse className="text-darkGreen text-xl" />
        </div>
        <p className="bg-lightGreen text-darkGreen rounded-md h-fit border border-darkGreen text-xs px-4 py-0.5">
          {activity.type}
        </p>
      </div>

      {/* <p className="my-4 font-medium">{activity.userEmail}</p> */}
      <div className="flex items-center space-x-2">
        <RiTimerLine className="text-[#9AA0AE]" />
        <span className="text-sm">{activity.duration} mins</span>
      </div>

      <div className="flex items-center space-x-2 ">
        <HiMiniFire className="text-[#FF6800]" />
        <span className="text-sm">
          {activity.caloriesBurned} calories burned
        </span>
      </div>

      <p className="text-xs border-t mt-4 pt-2">
        {activity.date.split("T")[0]}
      </p>
    </li>
  );
}

export default Activity;
