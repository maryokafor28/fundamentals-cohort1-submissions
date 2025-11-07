import { useState } from "react";
import { useActivityStore } from "../../store/useActivityStore";

const ActivityForm = () => {
  const { addActivity, loading } = useActivityStore();
  const [form, setForm] = useState({
    user: "",
    type: "",
    durationMinutes: "",
    calories: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user || !form.type || !form.durationMinutes || !form.calories)
      return;

    const payload = {
      user: form.user,
      type: form.type,
      durationMinutes: Number(form.durationMinutes),
      calories: Number(form.calories),
    };

    await addActivity(payload);
    setForm({ user: "", type: "", durationMinutes: "", calories: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-6">
      <input
        name="user"
        placeholder="User ID"
        value={form.user}
        onChange={handleChange}
        className="border px-3 py-2 rounded-lg w-56"
      />
      <input
        name="type"
        placeholder="Activity Type"
        value={form.type}
        onChange={handleChange}
        className="border px-3 py-2 rounded-lg w-56"
      />
      <input
        name="durationMinutes"
        placeholder="Duration (minutes)"
        value={form.durationMinutes}
        onChange={handleChange}
        className="border px-3 py-2 rounded-lg w-56"
      />
      <input
        name="calories"
        placeholder="Calories"
        value={form.calories}
        onChange={handleChange}
        className="border px-3 py-2 rounded-lg w-56"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded-lg bg-blue-700 hover:bg-rose-500"
      >
        {loading ? "Adding..." : "Add Activity"}
      </button>
    </form>
  );
};

export default ActivityForm;
