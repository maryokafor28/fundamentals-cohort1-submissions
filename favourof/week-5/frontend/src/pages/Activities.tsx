import { useEffect, useState } from "react";
import { useActivityStore } from "../store/useActivityStore";
import ActivityForm from "../components/forms/ActivityForm";

const Activities = () => {
  const { activities, fetchActivities, removeActivity, editActivity, loading } =
    useActivityStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [updatedType, setUpdatedType] = useState("");
  const [updatedDuration, setUpdatedDuration] = useState("");
  const [updatedCalories, setUpdatedCalories] = useState("");

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleUpdate = async (id: string) => {
    if (
      !updatedType.trim() ||
      !updatedDuration.trim() ||
      !updatedCalories.trim()
    )
      return;
    await editActivity(id, {
      type: updatedType,
      durationMinutes: Number(updatedDuration),
      calories: Number(updatedCalories),
    });
    setEditing(null);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Activities</h2>
      <ActivityForm />
      {loading && <p className="text-gray-500">Loading activities...</p>}

      <div className="space-y-3">
        {Array.isArray(activities) && activities.length > 0 ? (
          activities.map((act) => (
            <div
              key={act._id}
              className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{act.type}</p>
                <p className="text-gray-500">
                  Duration: {act.durationMinutes} min | Calories: {act.calories}
                </p>
                <p className="text-gray-400 text-sm">
                  User:{" "}
                  {typeof act.user === "object"
                    ? act.user.name || act.user.email || act.user._id
                    : act.user}
                </p>
              </div>

              <div className="flex gap-3">
                {editing === act._id ? (
                  <div className="flex flex-col md:flex-row gap-2 items-center">
                    <input
                      value={updatedType}
                      onChange={(e) => setUpdatedType(e.target.value)}
                      className="border px-2 py-1 rounded"
                      placeholder="New type"
                    />
                    <input
                      value={updatedDuration}
                      onChange={(e) => setUpdatedDuration(e.target.value)}
                      className="border px-2 py-1 rounded"
                      placeholder="Duration"
                    />
                    <input
                      value={updatedCalories}
                      onChange={(e) => setUpdatedCalories(e.target.value)}
                      className="border px-2 py-1 rounded"
                      placeholder="Calories"
                    />
                    <button
                      onClick={() => handleUpdate(act._id!)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditing(act._id!);
                        setUpdatedType(act.type);
                        setUpdatedDuration(act.durationMinutes.toString());
                        setUpdatedCalories(act.calories.toString());
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeActivity(act._id!)}
                      className="bg-rose-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No activities found.</p>
        )}
      </div>
    </div>
  );
};

export default Activities;
