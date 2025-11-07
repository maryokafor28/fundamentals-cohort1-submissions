import { useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore";
import UserForm from "../components/forms/UserForm";

const Users = () => {
  const { users, fetchUsers, removeUser, editUser, loading } = useUserStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdate = async (id: string) => {
    if (!updatedEmail.trim() || !updatedName.trim()) return;
    await editUser(id, { name: updatedName, email: updatedEmail });
    await fetchUsers(); // refresh list after update
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await removeUser(id);
    await fetchUsers(); // refresh list after deletion
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <UserForm />
      {loading && <p className="text-gray-500">Loading users...</p>}

      <div className="space-y-3">
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>

              <div className="flex gap-3">
                {editing === user._id ? (
                  <div className="flex gap-2 items-center">
                    <input
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                      className="border px-2 py-1 rounded"
                      placeholder="New name"
                    />
                    <input
                      value={updatedEmail}
                      onChange={(e) => setUpdatedEmail(e.target.value)}
                      className="border px-2 py-1 rounded"
                      placeholder="New email"
                    />
                    <button
                      onClick={() => handleUpdate(user._id!)}
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
                        setEditing(user._id!);
                        setUpdatedEmail(user.email);
                        setUpdatedName(user.name);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id!)}
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
          <p className="text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
