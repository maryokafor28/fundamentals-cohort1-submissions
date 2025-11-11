"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProjectAPI } from "@/api/projects";
import { ProjectActionsProps } from "@/types";

export default function ProjectActions({ projectId }: ProjectActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await ProjectAPI.delete(projectId);
      alert("Project deleted successfully.");
      router.push("/projects");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="flex gap-3 mb-8">
      <Button
        onClick={() => router.push(`/projects/${projectId}/edit`)}
        className="bg-yellow-600 hover:bg-yellow-700"
      >
        Edit
      </Button>
      <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
        Delete
      </Button>
    </div>
  );
}
