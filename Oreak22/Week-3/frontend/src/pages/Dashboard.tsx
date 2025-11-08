import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axiosClient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LucideTrash2 } from "lucide-react";

interface task {
  title: string;
  time: string;
  discription: string;
  _id: string;
}

const Dashboard = () => {
  const [taskData, setTaskData] = useState<task[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const handleDelete = (id: string) => {
    try {
      setLoading(true);
      api
        .delete(`/task/deletetask/${id}`)
        .then((res) => {
          console.log(res);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchTask = async () => {
      try {
        api
          .get("/task/getTask")
          .then((res) => {
            if (res.data.task) setTaskData(res.data.task);
            else setTaskData([]);
          })
          .catch(() => {});
      } catch {}
    };
    fetchTask();
  }, [loading]);

  return (
    <>
      <h1 className=" font-bold text-xl mb-5">Welcome {user?.name}</h1>
      <Table>
        {taskData.length <= 0 && <TableCaption>No record found</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S/N</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Discription</TableHead>
            <TableHead className="text-right">Time</TableHead>
            {user?.role == "admin" && (
              <TableHead className="text-right text-red-600">Delete</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskData.length > 0 &&
            taskData.map((task, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.discription}</TableCell>
                <TableCell className="text-right">
                  {task.time.split("T")[1]} / {task.time.split("T")[0]}
                  {/* {new Date(task.time).toLocaleDateString()} */}
                </TableCell>
                {user?.role == "admin" && (
                  <TableHead className="text-right" key={index}>
                    <button
                      className="cursor-pointer"
                      onClick={() => handleDelete(task._id)}
                    >
                      <LucideTrash2 color="red" />
                    </button>
                  </TableHead>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Dashboard;
