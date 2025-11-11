import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import UserList from "@/components/users/UserList";

export default function UsersPage() {
  const { users, currentUser, fetchUsers, deleteUser, loading, error } =
    useUsers();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✅ Filter to show only patients (role: "user")
  const patients = useMemo(() => {
    return users.filter((user) => user.role === "user");
  }, [users]);

  const handleDelete = async (id: string) => {
    // ✅ Only allow deleting your own account
    if (id !== currentUser?._id) {
      alert("You can only delete your own account");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await deleteUser(id);
        logout();
        navigate("/users");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  const handleEdit = (id: string) => {
    // ✅ Only allow editing your own profile
    if (id !== currentUser?._id) {
      alert("You can only edit your own profile");
      return;
    }
    navigate(`/users/edit/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View all patients and manage your profile
          </p>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading patients...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && patients.length === 0 && (
        <p className="text-gray-500 text-center py-10">No patients found.</p>
      )}

      {patients.length > 0 && (
        <UserList
          users={patients}
          currentUser={currentUser}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
