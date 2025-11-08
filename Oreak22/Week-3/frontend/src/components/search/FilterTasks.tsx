// src/components/FilterTasks.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import api from "@/api/axiosClient";
import { useAuth } from "@/context/AuthContext";
import { Trash2Icon } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  discription: string;
  time: string;
  userId: string;
}

const FilterTasks = () => {
  const [userId, setUserId] = useState("");
  const [time, setTime] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const handleFilter = async () => {
    setLoading(true);
    try {
      const res = await api.get("/task/filter", {
        params: { userId, time, sort },
      });
      setTasks(res.data.tasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = (id: string) => {
    try {
      setLoading(true);
      api
        .delete(`/task/deletetask/${id}`)
        .then((res) => {
          console.log(res);
          setLoading(false);
          handleFilter();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch {
      setLoading(false);
    } finally {
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Filter Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="User ID (optional)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Input
            placeholder="Time (optional, e.g., morning)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as "asc" | "desc")}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Oldest</SelectItem>
              <SelectItem value="desc">Newest</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleFilter} disabled={loading}>
            {loading ? "Filtering..." : "Filter"}
          </Button>
        </div>

        {tasks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>User</TableCell>
                {user?.role == "admin" && (
                  <TableCell className="text-end text-red-600">
                    Delete
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.discription}</TableCell>
                  <TableCell>{task.time}</TableCell>
                  <TableCell>{task.userId}</TableCell>{" "}
                  {user?.role == "admin" && (
                    <TableCell className="text-center text-red-600">
                      <button onClick={() => handleDelete(task._id)}>
                        <Trash2Icon color="red" />
                      </button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No tasks found
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterTasks;
