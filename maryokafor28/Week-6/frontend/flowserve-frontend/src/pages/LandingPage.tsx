import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { LoadingSpinner } from "../components/common/Loading";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { Button } from "../components/common/Button";

export const LandingPage = () => {
  const navigate = useNavigate();
  const {
    users,
    loading: usersLoading,
    error: usersError,
    refetch,
  } = useUsers();
  const { setCurrentUser, currentUser } = useCurrentUser(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("flowserve_current_user_id");
    console.log("📦 Stored user ID on mount:", storedUserId);
    if (storedUserId) {
      setSelectedUserId(storedUserId);
    }
  }, []);

  const handleContinue = async () => {
    console.log("🔵 handleContinue called with userId:", selectedUserId);

    if (!selectedUserId) {
      console.log("❌ No user selected");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("⏳ Calling setCurrentUser...");
      await setCurrentUser(selectedUserId);
      console.log("✅ setCurrentUser completed");
      console.log("👤 Current user after set:", currentUser);
      console.log("🚀 Navigating to /transactions");
      navigate("/transactions");
    } catch (error) {
      console.error("❌ Failed to set user:", error);
      alert("Failed to load user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManageUsers = () => {
    navigate("/users");
  };

  const selectedUser = users?.find((u) => u.id === selectedUserId);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            💸 FlowServe
          </h1>
          <p className="text-gray-600">Real-time Transaction Platform</p>
        </div>

        {usersLoading ? (
          <LoadingSpinner />
        ) : usersError ? (
          <ErrorMessage message={usersError} onRetry={refetch} />
        ) : (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="user-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Your Account
              </label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={(e) => {
                  console.log("👤 User selected:", e.target.value);
                  setSelectedUserId(e.target.value);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                <option value="">Choose a user...</option>
                {users?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!selectedUserId || isSubmitting}
              className="w-full py-3 text-lg"
            >
              {isSubmitting
                ? "Loading..."
                : `Continue as ${selectedUser?.name || "..."}`}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <Button
              onClick={handleManageUsers}
              variant="secondary"
              className="w-full py-3"
              disabled={isSubmitting}
            >
              Manage Users
            </Button>

            {(!users || users.length === 0) && (
              <p className="text-center text-yellow-600 text-sm">
                No users found. Create one to get started!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
