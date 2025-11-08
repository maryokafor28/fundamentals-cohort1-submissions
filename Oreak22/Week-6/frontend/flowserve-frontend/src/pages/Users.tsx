import React, { useEffect, useState } from "react";
import api from "../api/axios";

type User = { id: string; name: string; email: string; phone?: string };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/users?page=1&limit=20");
      setUsers(res.data.data || []);
    } catch (err: any) {
      setError(err.error || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await api.post("/api/users", { name, email, password: "password123" });
      setName("");
      setEmail("");
      await fetchUsers();
      alert("User created");
    } catch (err: any) {
      setError(err.error || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <form
        onSubmit={handleCreate}
        className="bg-white p-4 rounded shadow space-y-3"
      >
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Create
          </button>
        </div>
        {error && <div className="text-red-600">{error}</div>}
      </form>

      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
