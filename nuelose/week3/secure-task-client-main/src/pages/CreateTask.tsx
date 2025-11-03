import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useApi } from "../services/api";

function CreateTask() {
  const api = useApi()
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/tasks", { title, description });
      navigate("/");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="  p-4">
      <div >
        <h2>Create New Task</h2>
        <p>Add a new task to your workflow</p>
        {error && <p className="text-red-500">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="border border-slate-400 max-w-4xl px-4 py-8 rounded-xl space-y-2"
        >
          <div className="flex flex-col">
            <label htmlFor="title">Task Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Describe the task in detail..."
              className="bg-slate-200 rounded-lg p-2"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <Link
              to="/"
              className="border border-slate-300 rounded-md px-2 py-1"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-slate-500 text-white px-2 py-1 rounded-md"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
