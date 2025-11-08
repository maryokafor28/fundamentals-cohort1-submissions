import api from "@/api/axiosClient";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { projectData } from "../dashboard/types";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "lucide-react";
import { CommentSection } from "./CommentSection";
import type { Comment } from "./types";

const Project = () => {
  const { id } = useParams();
  const [project, setproject] = useState<projectData>();
  const [comments, setComments] = useState<Comment[]>([]);
  useEffect(() => {
    const getProject = () => {
      api
        .get(`/project/${id}`)
        .then((res) => {
          setproject(res.data.project);
          setComments(res.data.comments);
        })
        .catch(() => {});
    };
    getProject();
  }, []);

  if (!project) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-muted-foreground">
        Loading project details...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <Card className="w-full max-w-3xl rounded-2xl border border-border bg-background shadow-sm transition-all hover:shadow-lg">
        {/* Header Section */}
        <CardHeader className="flex flex-col items-start gap-2 border-b border-border pb-4">
          <Badge
            fontVariant="secondary"
            className="uppercase text-xs tracking-wider"
          >
            Project
          </Badge>
          <CardTitle className="text-2xl font-bold capitalize">
            {project.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Posted on {new Date(project.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>

        {/* Body Section */}
        <CardContent className="space-y-4 py-6">
          <div>
            <Label className="text-sm text-muted-foreground">Description</Label>
            <p className="mt-2 text-base leading-relaxed text-foreground">
              {project.discription || "No description available."}
            </p>
          </div>
        </CardContent>

        <Separator />

        {/* Footer Section */}
        <CardFooter className="flex flex-col gap-3 pt-6">
          <h3 className="text-lg font-semibold">Comments</h3>
          <div className="w-full">
            <CommentSection
              id={project._id}
              tagId={project.userId}
              comments={comments}
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Project;
