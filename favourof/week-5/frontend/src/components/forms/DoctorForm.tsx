import { useState } from "react";
import { useDoctorStore } from "../../store/useDoctorStore";

const DoctorForm = () => {
  const { addDoctor, loading } = useDoctorStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialty: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.specialty) return;
    await addDoctor(form);
    setForm({ name: "", email: "", specialty: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-6">
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
      <input
        name="specialty"
        placeholder="Specialty"
        value={form.specialty}
        onChange={handleChange}
        className="border px-3 py-2 rounded-lg w-56"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded-lg bg-blue-700 hover:bg-rose-500"
      >
        {loading ? "Adding..." : "Add Doctor"}
      </button>
    </form>
  );
};

export default DoctorForm;
