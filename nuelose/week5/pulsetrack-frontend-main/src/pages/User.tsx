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
  const [error, setError] = useState<null | string>(null);
  const [showModal, setShowModal] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseUrl}/users`);
        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [baseUrl]);

  const handleAddUser = async (formData: NewUserFormData) => {
    try {
      const res = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create user");

      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="">
      <SectionHeader
        title="Users"
        subtitle="Manage registered users in the system"
      >
        <Button onClick={() => setShowModal(true)}>Add New User</Button>
      </SectionHeader>

      {loading && <p className="mt-4 text-gray-500">Loading Users...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}
      {!loading && !error && (
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
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="text-sm px-6 py-4 whitespace-nowrap ">
                  <span className="user-icon">{user.name[0]}</span>
                  {user.name}
                </td>
                <td className="text-sm px-6 py-4 whitespace-nowrap">
                  {user.email}
                </td>
                <td className="text-sm px-6 py-4 whitespace-nowrap">
                  {user.age}
                </td>
                <td className="text-sm px-6 py-4 whitespace-nowrap">
                  {user.gender}
                </td>
                <td className="flex gap-4 py-4 px-6">
                  <LiaEditSolid /> <RiDeleteBin5Line className="text-red-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New User"
      >
        <AddUserForm
          onSubmit={handleAddUser}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}

export default User;
