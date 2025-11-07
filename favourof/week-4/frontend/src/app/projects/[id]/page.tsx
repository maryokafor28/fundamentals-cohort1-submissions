"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  description: string;
  tag: string[];
  author: { name: string; email: string; avatar?: string };
  likes: string[];
  comments: { _id: string; text: string; author: { name: string } }[];
  createdAt: string;
}

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await axios.get<{ status: string; data: Project }>(
          `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProject(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Fetch project error:",
          error.response?.data || error.message
        );
        toast.error("Failed to fetch project");
        setLoading(false);
      }
    }
    fetchProject();
  }, [id, token]);

  const handleLike = async () => {
    if (!token || !user) {
      toast.error("Please log in to like a project");
      return;
    }
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/project/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject((prev) =>
        prev ? { ...prev, likes: response.data.data.likes } : prev
      );
      toast.success(
        user._id && response.data.data.likes.includes(user._id)
          ? "Project liked!"
          : "Project unliked!"
      );
    } catch (error) {
      console.error(
        "Like project error:",
        error.response?.data || error.message
      );
      toast.error("Failed to like project");
    }
  };

  const handleCommentSubmit = async () => {
    if (!token) {
      toast.error("Please log in to comment");
      return;
    }
    const text = commentInput.trim();
    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/${id}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentInput("");
      // Refetch project to update comments
      const response = await axios.get<{ status: string; data: Project }>(
        `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject(response.data.data);
      toast.success("Comment posted!");
    } catch (error) {
      console.error(
        "Comment post error:",
        error.response?.data || error.message
      );
      toast.error("Failed to post comment");
    }
  };

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

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-gray-600">Project not found.</p>
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
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{project.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              <p className="text-sm text-gray-500">By {project.author.name}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{project.description}</p>
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
              <Button
                variant="ghost"
                onClick={handleLike}
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
              </Button>
              <span className="flex items-center gap-1 text-gray-600">
                <MessageCircle size={20} />
                <span>{project.comments.length} Comments</span>
              </span>
            </div>
            {token && (
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full"
                />
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!commentInput.trim()}
                >
                  Post
                </Button>
              </div>
            )}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Comments</h3>
              {project.comments.length === 0 ? (
                <p className="text-gray-600">No comments yet.</p>
              ) : (
                <div className="space-y-2">
                  {project.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="border-b border-gray-200 py-2"
                    >
                      <p className="text-sm text-gray-600">
                        <strong>{comment.author.name}</strong>: {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
