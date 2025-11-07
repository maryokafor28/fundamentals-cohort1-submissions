"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface Project {
  _id: string;
  title: string;
  description: string;
  tag: string[];
  author: { name: string; email: string };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/project`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);

        toast.error("Failed to fetch projects");
        setLoading(false);
      }
    }
    fetchProjects();
  }, [token]);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        {token && (
          <Link href="/projects/new">
            <Button className="bg-primary hover:bg-primary/90">
              Create Project
            </Button>
          </Link>
        )}
      </div>
      {projects.length === 0 ? (
        <p className="text-gray-600">
          No projects found. Start by creating one!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tag.map((tag) => (
                    <span
                      key={tag}
                      className="bg-secondary text-gray-800 text-sm px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  By {project.author.name}
                </p>
                <Link href={`/project/${project._id}`}>
                  <Button variant="outline" className="mt-4">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
