import { useEffect, useState } from "react";
import Header from "../components/Header";
import { CiBoxList, CiSearch } from "react-icons/ci";
import { RxPlusCircled } from "react-icons/rx";
import { LuLogOut } from "react-icons/lu";
import { useAuth } from "../context/AuthContextObject";
import type { Task } from "../types";
import { useApi } from "../services/api";
import CreateTask from "./CreateTask";
import SearchFilter from "./SearchFilter";
import { RiDeleteBin6Line } from "react-icons/ri";

function Tasks() {
  const api = useApi();
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedView, setSelectedView] = useState<
    "tasks" | "create" | "search"
  >("tasks");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get<Task[]>("/tasks");
      setTasks(res.data);
    } catch {
      console.log("Failed to fetch data");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch {
      alert("Failed to delete data");
    }
  };

  return (
    <div>
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <div className="px-6 border-r border-slate-400 h-screen">
          <ul className="space-y-5 w-fit mx-auto py-5">
            <li
              className="flex items-center gap-5 cursor-pointer hover:text-blue-500"
              onClick={() => setSelectedView("tasks")}
            >
              <CiBoxList />
              <p>All Tasks</p>
            </li>
            <li
              className="flex items-center gap-5 cursor-pointer hover:text-blue-500"
              onClick={() => setSelectedView("create")}
            >
              <RxPlusCircled />
              <p>Create Task</p>
            </li>
            <li
              className="flex items-center gap-5 cursor-pointer hover:text-blue-500"
              onClick={() => setSelectedView("search")}
            >
              <CiSearch />
              <p>Search</p>
            </li>
          </ul>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 border-t border-slate-300 text-red-500 pt-5 w-full"
          >
            <LuLogOut />
            <p>Logout</p>
          </button>
        </div>

        {/* Main Content */}
        <div className="p-4 w-6xl mx-auto">
          {selectedView === "tasks" && (
            <TaskList tasks={tasks} user={user} handleDelete={handleDelete} />
          )}
          {selectedView === "create" && <CreateTask />}
          {selectedView === "search" && <SearchFilter />}
        </div>
      </div>
    </div>
  );
}

interface TaskListProps {
  tasks: Task[];
  user: { role?: string } | null;
  handleDelete: (id: string) => void;
}

function TaskList({ tasks, user, handleDelete }: TaskListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">All Tasks</h2>
      <p className="mb-4 text-gray-600">
        Viewing all tasks across the platform
      </p>

      <ul className="space-y-8">
        {tasks.map((task) => (
          <li key={task._id} className="flex justify-between border border-slate-200 rounded-2xl  max-w-4xl p-2">
            <div>
              <h3 className="font-bold capitalize  ">{task.title}</h3>
              <p className="text-sm  ">{task.description}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>

            {user?.role === "admin" && (
              <button
                onClick={() => handleDelete(task._id)}
                className="text-red-500 text-sm mt-2 cursor-pointer"
              >
                <RiDeleteBin6Line />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
