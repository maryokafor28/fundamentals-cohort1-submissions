import { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { useDoctorStore } from "../store/useDoctorStore";
import { useActivityStore } from "../store/useActivityStore";
import SummaryCard from "../components/dashboard/SummaryCard";
import ActivityChart from "../components/dashboard/ActivityChart";
import { Users, Stethoscope, Activity } from "lucide-react";

const Dashboard = () => {
  const { users, fetchUsers } = useUserStore();
  const { doctors, fetchDoctors } = useDoctorStore();
  const { activities, fetchActivities } = useActivityStore();

  useEffect(() => {
    fetchUsers();
    fetchDoctors();
    fetchActivities();
  }, [fetchUsers, fetchDoctors, fetchActivities]);

  const totalUsers = users?.length || 0;
  const totalDoctors = doctors?.length || 0;
  const totalActivities = activities?.length || 0;

  const recentActivities = activities.slice(-5);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Users"
          value={totalUsers}
          icon={<Users />}
          color="bg-blue-600"
        />
        <SummaryCard
          title="Doctors"
          value={totalDoctors}
          icon={<Stethoscope />}
          color="bg-green-600"
        />
        <SummaryCard
          title="Activities"
          value={totalActivities}
          icon={<Activity />}
          color="bg-purple-600"
        />
      </div>

      {/* Chart Section */}
      <ActivityChart data={activities} />

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2">User</th>
              <th className="py-2">Type</th>
              <th className="py-2">Duration</th>
              <th className="py-2">Calories</th>
            </tr>
          </thead>
          <tbody>
            {recentActivities.map((act) => (
              <tr
                key={act._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-2">
                  {typeof act.user === "object"
                    ? act.user.name || act.user.email
                    : act.user}
                </td>
                <td className="py-2">{act.type}</td>
                <td className="py-2">{act.durationMinutes} min</td>
                <td className="py-2">{act.calories}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
