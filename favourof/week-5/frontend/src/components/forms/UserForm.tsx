import { useState } from "react";
import { useUserStore } from "../../store/useUserStore";

const UserForm = () => {
  const { addUser, loading } = useUserStore();
  const [form, setForm] = useState({ name: "", email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    await addUser(form);
    setForm({ name: "", email: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center mb-6">
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border px-3 py-2 rounded-lg w-56"
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border px-3 py-2 rounded-lg w-56"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 bg-blue-700 rounded-lg hover:bg-rose-500"
      >
        {loading ? "Adding..." : "Add User"}
      </button>
    </form>
  );
};

export default UserForm;
