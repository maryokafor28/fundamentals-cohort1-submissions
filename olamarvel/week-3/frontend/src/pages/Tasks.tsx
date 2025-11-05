import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

type Task = {
  _id: string;
  title: string;
  description?: string;
  ownerId?: string;
  createdAt?: string;
};

export default function Tasks() {
  const { user, accessToken, refreshAccessToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await api.get("/task"); // backend route: /api/task
      setTasks(res.data.data || res.data);
    } catch (err: any) {
      // attempt refresh if 401
      if (err.response?.status === 401) {
        try {
          await refreshAccessToken();
          const res = await api.get("/task");
          setTasks(res.data.data || res.data);
        } catch (e) {
          setError("Unable to fetch tasks: authentication required");
        }
      } else {
        setError("Unable to fetch tasks");
      }
    }
  };

  useEffect(() => {
    load();
  }, [accessToken]);

  const createTask = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    try {
      const res = await api.post("/task", { title, description });
      setTasks(prev => [res.data.task || res.data, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create task");
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/task/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      {user && <div style={{ marginBottom: 12 }}>Logged in as {user.email} ({user.role})</div>}

      <form onSubmit={createTask} style={{ marginBottom: 12 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <button type="submit">Create Task</button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <ul>
        {tasks.map(t => (
          <li key={t._id} style={{ marginBottom: 8 }}>
            <strong>{t.title}</strong>
            <div>{t.description}</div>
            <small>Created: {t.createdAt}</small>
            {user?.role === "admin" && (
              <div>
                <button onClick={() => deleteTask(t._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
