import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import type { projectData } from "../types";
import type { User } from "@/context/type";

export function ProjectTable({
  Data,
  user,
}: {
  Data: [projectData] | [];
  user: User | null;
}) {
  return (
    <Table>
      {Data.length > 0 ? (
        <TableCaption>A list of your recent Projects.</TableCaption>
      ) : (
        <TableCaption>
          You have no projects, create{" "}
          <Link to="/new-project" className="underline">
            New project
          </Link>
          .
        </TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead className="">Project Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Created On</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Data.length > 0 &&
          Data.map((project, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <Link
                  to={`/project/${user?.userName}/${project._id}`}
                  className="underline"
                >
                  {project.title}
                </Link>
              </TableCell>
              <TableCell>{project.discription}</TableCell>
              <TableCell className="text-right">
                {project.createdAt.split("T")[0]}
                <br />
                {project.createdAt.split("T")[1].split(":")[0] +
                  ":" +
                  project.createdAt.split("T")[1].split(":")[1]}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
