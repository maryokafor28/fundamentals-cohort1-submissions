import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { userApi } from "../api/userApi";
import { currentUserStorage } from "../utils/currentUser";
import { Navbar } from "../layout/Navbar";
import { UserList } from "../components/users/UserList";
import { CreateUserForm } from "../components/users/CreateUserForm";

export const ManageUsersPage = () => {
  const { users, loading, error, page, setPage, totalPages, refetch } =
    useUsers();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const handleCreateUser = async (name: string, email: string) => {
    await userApi.createUser({ name, email });
    refetch();
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setDeletingUserId(id);
    try {
      await userApi.deleteUser(id);

      // If deleted user was the current user, clear localStorage
      if (currentUserStorage.get() === id) {
        currentUserStorage.remove();
      }

      refetch();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage users for testing
          </p>
        </div>

        {/* Create User Form */}
        <div className="mb-8">
          <CreateUserForm onSubmit={handleCreateUser} />
        </div>

        {/* User List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Existing Users ({users ? users.length : 0})
            </h2>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <span className="px-3 py-1 text-sm text-gray-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {!users || loading ? (
            <div className="bg-white p-4 rounded border text-gray-600">
              Loading users...
            </div>
          ) : (
            <UserList
              users={users}
              loading={loading}
              error={error}
              onDelete={handleDeleteUser}
              onRetry={refetch}
              deletingUserId={deletingUserId || undefined}
            />
          )}
        </div>
      </main>
    </div>
  );
};
