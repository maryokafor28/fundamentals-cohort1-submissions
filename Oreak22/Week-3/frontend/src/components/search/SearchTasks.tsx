// src/components/SearchTasks.tsx
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
  createdAt: string;
}

const SearchTasks = () => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get("/task/search", {
        params: { query, sort },
      });
      console.log(res);
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
          handleSearch();
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
        <CardTitle>Search Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {tasks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created</TableCell>
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
                  <TableCell>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </TableCell>
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

export default SearchTasks;
