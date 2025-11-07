"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isAuthenticated, logout, getAccessToken } from "@/lib/auth";
import { getTasks, createTask, deleteTask, Task } from "@/lib/auth";
import { CheckCircle2, LogOut, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // ✅ Auth check + load user role
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      console.log(user, "here i am didirin pelumi");

      setUserRole(user.role || "user");
      setUserName(user.name || "");
      fetchTasks();
      setIsLoading(false);
    }
  }, [router]);

  // ✅ Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("No access token");
      const data = await getTasks(token);
      console.log(data);

      setTasks(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // ✅ Create new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.warning("Please enter a title");

    setCreating(true);
    try {
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");
      await createTask(token, title, description);
      toast.success("Task created successfully!");
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // ✅ Delete task (admin only)
  const handleDeleteTask = async (id: string) => {
    console.log(id);

    try {
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");
      await deleteTask(token, id);
      toast.success("Task deleted");
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">TaskFlow</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here’s an overview of your tasks and projects.
            </p>
          </div>

          {/* Quick Stats (Static for now) */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Tasks</CardDescription>
                <CardTitle className="text-3xl">{tasks.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Tasks in progress
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completed This Week</CardDescription>
                <CardTitle className="text-3xl">--</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Role</CardDescription>
                <CardTitle className="text-3xl capitalize">
                  {userRole}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Access level</p>
              </CardContent>
            </Card>
          </div>

          {/* Task Management Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manage Tasks</CardTitle>
                  <CardDescription>
                    Create and view all your tasks
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Add Task Form */}
              <form
                onSubmit={handleCreateTask}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Input
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1"
                />
                <Textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1 sm:flex-[2]"
                />
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    "Creating..."
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </>
                  )}
                </Button>
              </form>

              {/* Task List */}
              <div className="space-y-4">
                {tasks.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No tasks yet. Create your first one!
                  </p>
                )}
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                      <p className="text-xs text-red-800">
                        created by:
                        {userName === task.userId?.name
                          ? ` You`
                          : `${task.userId?.name}`}
                      </p>
                    </div>

                    {userRole === "admin" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Auth Info */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>Your current session info</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">Authenticated</span>
                </p>
                <p className="text-muted-foreground font-mono text-xs break-all">
                  Token: {getAccessToken()?.substring(0, 50)}...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
