"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAccessToken } from "@/lib/auth";
import { getTasks, deleteTask, Task } from "@/lib/auth";
import { toast } from "sonner";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");

  const fetchTasks = async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserRole(user.role);

      const data = await getTasks(token);
      setTasks(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");

      await deleteTask(token, id);
      toast.success("Task deleted successfully");
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task._id} className="hover:bg-accent/50 transition">
          <CardContent className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            </div>
            {userRole === "admin" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
