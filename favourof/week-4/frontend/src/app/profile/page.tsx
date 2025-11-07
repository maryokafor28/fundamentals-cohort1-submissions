"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, LogOut } from "lucide-react";
import axios from "axios";
import Link from "next/link";

interface Project {
  _id: string;
  title: string;
  description: string;
  tag: string[];
  author: { name: string; email: string; avatar?: string };
  likes: string[];
  comments: { _id: string; text: string }[];
  createdAt: string;
}

interface ProjectResponse {
  status: string;
  data: Project[];
}

export default function ProfilePage() {
  const { token, user, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to view your profile");
      router.push("/login");
      return;
    }

    async function fetchUserProjects() {
      try {
        const response = await axios.get<ProjectResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/project?author=${user?._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);

        toast.error("Failed to fetch your projects");
        setLoading(false);
      }
    }

    if (user?._id) {
      fetchUserProjects();
    }
  }, [token, user, router]);

  const handleLike = async (projectId: string) => {
    if (!token || !user) {
      toast.error("Please log in to like a project");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId ? { ...p, likes: response.data.data.likes } : p
        )
      );
      toast.success(
        user._id && response.data.data.likes.includes(user._id)
          ? "Project liked!"
          : "Project unliked!"
      );
    } catch (error) {
      console.log(error);

      toast.error("Failed to like project");
    }
  };

  const handleCommentSubmit = async (projectId: string) => {
    if (!token) {
      toast.error("Please log in to comment");
      return;
    }
    const text = commentInputs[projectId]?.trim();
    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/${projectId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentInputs((prev) => ({ ...prev, [projectId]: "" }));
      toast.success("Comment posted!");
    } catch (error) {
      console.log(error);

      toast.error("Failed to post comment");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  if (!token) {
    return null; // Redirect handled by useEffect
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          className="text-gray-600 text-lg"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* User Info */}
        <Card className="mb-6 bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user?.name}</CardTitle>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={20} />
              Log Out
            </Button>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-gray-600">
                You haven’t created any projects yet.{" "}
                <Link
                  href="/projects/new"
                  className="text-primary hover:underline"
                >
                  Create one now!
                </Link>
              </p>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                <AnimatePresence>
                  {projects.map((project) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="relative overflow-hidden bg-white border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 opacity-10" />
                        <CardHeader className="flex flex-row items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {project.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl">
                              {project.title}
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                              By {project.author.name}
                            </p>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tag.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-sm px-2 py-1"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 mb-4">
                            <motion.button
                              onClick={() => handleLike(project._id)}
                              whileTap={{ scale: 0.9 }}
                              className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                            >
                              <Heart
                                className={
                                  user?._id && project.likes.includes(user._id)
                                    ? "fill-red-500 text-red-500"
                                    : ""
                                }
                                size={20}
                              />
                              <span>{project.likes.length}</span>
                            </motion.button>
                            <Link
                              href={`/projects/${project._id}`}
                              className="flex items-center gap-1 text-gray-600 hover:text-primary"
                            >
                              <MessageCircle size={20} />
                              <span>{project.comments.length} Comments</span>
                            </Link>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a comment..."
                              value={commentInputs[project._id] || ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [project._id]: e.target.value,
                                }))
                              }
                            />
                            <Button
                              onClick={() => handleCommentSubmit(project._id)}
                              disabled={!commentInputs[project._id]?.trim()}
                            >
                              Post
                            </Button>
                          </div>
                          <Link href={`/projects/${project._id}`}>
                            <Button variant="outline" className="w-full mt-4">
                              View Full Details
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
