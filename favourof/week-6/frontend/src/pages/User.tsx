import { useEffect, useState } from "react";
import { userService } from "../api/userService";
import type { User } from "../types";
import { toast } from "sonner";
import ModalForm from "@/components/layout/ModalForm";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      balance: Number(fd.get("balance") || 0),
    };
    try {
      await userService.create(payload);
      toast.success("User created");
      setOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Create fail");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete user?")) return;
    try {
      await userService.remove(id);
      toast.success("User deleted");
      fetchUsers();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Delete fail");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users</h2>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Create User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Balance</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    No users
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">₦{u.balance.toLocaleString()}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalForm
        open={open}
        title="Create User"
        onClose={() => setOpen(false)}
        footer={null}
      >
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-700">Name</label>
            <input
              name="name"
              required
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-700">
              Initial Balance
            </label>
            <input
              name="balance"
              type="number"
              defaultValue={0}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2  bg-blue-500 text-white rounded"
            >
              Create
            </button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}
