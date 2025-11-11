"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ProjectAPI } from "@/api/projects";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function CreateProjectPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    repoUrl: "",
    liveUrl: "",
  });
  const [loading, setLoading] = useState(false); //  This is for form submission
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  //  Show loading or redirect if not authenticated
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await ProjectAPI.create({
        title: form.title,
        description: form.description,
        techStack: form.techStack.split(",").map((t) => t.trim()),
        repoUrl: form.repoUrl || undefined,
        liveUrl: form.liveUrl || undefined,
      });
      router.push("/projects");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant={"link"}
        className="cursor-pointer text-2xl mb-5"
        onClick={() => router.push("/projects")}
      >
        ← Back
      </Button>

      <div className="min-h-screen text-white ">
        <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xlflex justify-center items-center p-8 mx-auto mt-10">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Create New Project
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Project Title"
              value={form.title}
              onChange={handleChange}
              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
              required
            />
            <Textarea
              name="description"
              placeholder="Project Description"
              value={form.description}
              onChange={handleChange}
              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
              required
            />
            <Input
              name="techStack"
              placeholder="Tech Stack (comma separated, e.g., React, Node.js, MongoDB)"
              value={form.techStack}
              onChange={handleChange}
              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
              required
            />
            <Input
              name="repoUrl"
              placeholder="Repository URL (optional)"
              value={form.repoUrl}
              onChange={handleChange}
              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
            />
            <Input
              name="liveUrl"
              placeholder="Live Demo URL (optional)"
              value={form.liveUrl}
              onChange={handleChange}
              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
            />

            {error && <p className="text-red-300 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
