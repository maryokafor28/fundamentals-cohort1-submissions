"use client";

import { useState, useEffect } from "react";
import {
  getTasks as apiGetTasks,
  createTask as apiCreateTask,
  deleteTask as apiDeleteTask,
} from "@/api/taskApi";
import { Task } from "@/types/task";
import { useAuth } from "@/context/AuthProvider";

interface TaskListProps {
  searchQuery: string;
  filteredTasks?: Task[]; // ✅ New optional prop for filtered results
}

export default function TaskList({
  searchQuery,
  filteredTasks,
}: TaskListProps) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAddInput, setShowAddInput] = useState(false);

  // 🟢 Load tasks only if no filteredTasks are passed
  useEffect(() => {
    if (!filteredTasks?.length) {
      (async () => {
        try {
          const data = await apiGetTasks();
          setTasks(data);
        } catch (err) {
          if (err instanceof Error)
            setError(err.message || "Failed to load tasks");
        }
      })();
    }
  }, [filteredTasks]);

  // 🧠 Use whichever list is available
  const displayedTasks = filteredTasks?.length ? filteredTasks : tasks;

  // 🧩 Filter by search query
  const filteredDisplay = displayedTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🕒 Clear alerts automatically
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // 🧾 Create Task
  const create = async () => {
    if (!title.trim()) {
      setError("Task title cannot be empty");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const newTask = await apiCreateTask({ title: title.trim() });
      if (!newTask._id)
        throw new Error("Task created but no ID returned from server");
      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setSuccess("Task created successfully!");
      setShowAddInput(false);
    } catch (err) {
      if (err instanceof Error)
        setError(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading && title.trim()) create();
  };

  // ❌ Delete Task
  const remove = async (id: string, taskTitle: string) => {
    if (!id) {
      setError("Cannot delete task: Invalid task ID");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${taskTitle}"?`))
      return;

    try {
      await apiDeleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setSuccess("Task deleted successfully!");
    } catch (err) {
      if (err instanceof Error)
        setError(
          err.message || "Failed to delete task. You may not have permission."
        );
    }
  };

  return (
    <>
      {/* Alerts */}
      {error && (
        <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-3 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm text-center">
          {success}
        </div>
      )}

      {/* Add Task */}
      {!showAddInput ? (
        <button
          onClick={() => setShowAddInput(true)}
          className="w-full mb-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-medium flex items-center justify-center gap-2"
        >
          Add New Task
        </button>
      ) : (
        <div className="mb-4 bg-white rounded-xl border text-black border-gray-200 p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter task title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mb-3"
            disabled={loading}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={create}
              disabled={loading || !title.trim()}
              className="flex-1 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
            <button
              onClick={() => {
                setShowAddInput(false);
                setTitle("");
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredDisplay.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery || filteredTasks?.length
                ? "No tasks found"
                : "No tasks yet"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery || filteredTasks?.length
                ? "Try adjusting your search or filters"
                : "Create your first task to get started"}
            </p>
          </div>
        ) : (
          filteredDisplay.map((task) => (
            <div
              key={task._id || `temp-${task.title}-${Date.now()}`}
              className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-3">
                  <h3 className="text-gray-800 font-medium text-base">
                    {task.title}
                  </h3>
                  {task.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(task.createdAt).toLocaleDateString()} at{" "}
                      {new Date(task.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                {user?.role === "admin" && (
                  <button
                    onClick={() => remove(task._id!, task.title)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
