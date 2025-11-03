import { useEffect, useState } from "react";
import Button from "../component/ui/Button";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin5Line } from "react-icons/ri";
import type { NewUserFormData, UserType } from "../types/type";
import SectionHeader from "../component/ui/SectionHeader";
import Modal from "../component/ui/Modal";
import AddUserForm from "../forms/AddUserForm";

function User() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}/users?page=${page}&limit=${limit}`
        );
        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data.data);
        setTotalPages(data.meta.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, baseUrl]);

  const handleAddOrEditUser = async (formData: NewUserFormData) => {
    const isEdit = Boolean(editingUser);
    const method = isEdit ? "PATCH" : "POST";
    const url = isEdit
      ? `${baseUrl}/users/${editingUser!.id}`
      : `${baseUrl}/users`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user");

      setShowModal(false);
      setEditingUser(null);
      setPage(1); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (user: UserType) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${baseUrl}/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete user");
    }
  };

  return (
    <div>
      <SectionHeader
        title="Users"
        subtitle="Manage all users and their accounts."
      >
        <Button onClick={() => setShowModal(true)}>Add New User</Button>
      </SectionHeader>

      {loading && <p className="mt-4 text-gray-500">Loading Users...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="text-sm px-6 py-4 whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="text-sm px-6 py-4 whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="text-sm px-6 py-4 whitespace-nowrap">
                    {user.balance}
                  </td>
                  <td className="text-sm px-6 py-4 whitespace-nowrap">
                    {user.createdAt.split("T")[0]}
                  </td>
                  <td className="flex gap-4 py-4 px-6">
                    <button onClick={() => handleEditClick(user)}>
                      <LiaEditSolid />
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)}>
                      <RiDeleteBin5Line className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Prev
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingUser ? "Edit User" : "Add New User"}
      >
        <AddUserForm
          onSubmit={handleAddOrEditUser}
          onCancel={handleCloseModal}
          initialData={editingUser || undefined}
        />
      </Modal>
    </div>
  );
}

export default User;
