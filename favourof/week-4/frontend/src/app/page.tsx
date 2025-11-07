"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle } from "lucide-react";
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
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Project[];
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  );
  const { token, user } = useAuth();
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchProjects = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      try {
        setLoadingMore(true);
        const response = await axios.get<ProjectResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/project?page=${pageNum}&limit=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newProjects = response.data.data;
        setProjects((prev) =>
          reset ? newProjects : [...prev, ...newProjects]
        );
        setFilteredProjects((prev) =>
          reset ? newProjects : [...prev, ...newProjects]
        );
        setHasMore(pageNum < response.data.pages);
        setLoading(false);
        setLoadingMore(false);
      } catch (error) {
        console.error(
          "Fetch projects error:",
          error.response?.data || error.message
        );
        toast.error("Failed to fetch projects");
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [token]
  );

  useEffect(() => {
    console.log("Token:", token);
    setPage(1);
    setHasMore(true);
    fetchProjects(1, true);
  }, [fetchProjects, searchTerm, selectedTag, token]);

  // Handle search and tag filtering
  useEffect(() => {
    let result = projects;
    if (searchTerm) {
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedTag) {
      result = result.filter((project) => project.tag.includes(selectedTag));
    }
    setFilteredProjects(result);
  }, [searchTerm, selectedTag, projects]);

  // Infinite scroll observer
  useEffect(() => {
    if (loading || loadingMore || !hasMore) return;
    const currentRef = loadMoreRef.current;
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
          fetchProjects(page + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (currentRef && observer.current) {
        observer.current.unobserve(currentRef);
      }
    };
  }, [loading, loadingMore, hasMore, page, fetchProjects]);

  // Handle like toggle
  const handleLike = async (projectId: string) => {
    console.log("Like clicked for project:", projectId); // Debug click
    if (!token || !user) {
      toast.error("Please log in to like a project");
      return;
    }
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/project/like/${projectId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects((prev) =>
        prev.map((p) =>
          p._id === projectId ? { ...p, likes: response.data.data.likes } : p
        )
      );
      setFilteredProjects((prev) =>
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
      console.error(
        "Like project error:",
        error.response?.data || error.message
      );
      toast.error("Failed to like project");
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (projectId: string) => {
    console.log("Comment submit clicked for project:", projectId);
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
      await fetchProjects(1, true); // Refetch to update comment count
      toast.success("Comment posted!");
    } catch (error) {
      console.error(
        "Comment post error:",
        error.response?.data || error.message
      );
      toast.error("Failed to post comment");
    }
  };

  // Handle comment input change
  const handleCommentInputChange = (projectId: string, value: string) => {
    console.log(
      "Comment input changed for project:",
      projectId,
      "Value:",
      value
    ); // Debug input
    setCommentInputs((prev) => ({ ...prev, [projectId]: value }));
  };

  // Get unique tags for filter buttons
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tag))
  );

  if (loading && page === 1) {
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary to-blue-600 text-white py-16 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover & Collaborate on DevConnect
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Join developers worldwide to share ideas, build projects, and create
          something amazing together.
        </p>
        {token ? (
          <Link href="/projects/new">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Start a New Project
            </Button>
          </Link>
        ) : (
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Join Now
            </Button>
          </Link>
        )}
      </motion.section>

      {/* Search and Filter Section */}
      <section className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              onClick={() => setSelectedTag(null)}
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-center"
          >
            No projects found. Try adjusting your search or filters.
          </motion.p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="relative overflow-hidden bg-white border-gray-200 hover:shadow-xl transition-shadow duration-300">
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
                        <Button
                          variant="ghost"
                          onClick={() => handleLike(project._id)}
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
                        <Link
                          href={`/projects/${project._id}`}
                          className="flex items-center gap-1 text-gray-600 hover:text-primary"
                        >
                          <MessageCircle size={20} />
                          <span>{project.comments.length} Comments</span>
                        </Link>
                      </div>
                      {token && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a comment..."
                            value={commentInputs[project._id] || ""}
                            onChange={(e) =>
                              handleCommentInputChange(
                                project._id,
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                          <Button
                            onClick={() => handleCommentSubmit(project._id)}
                            disabled={!commentInputs[project._id]?.trim()}
                          >
                            Post
                          </Button>
                        </div>
                      )}
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
        {loadingMore && (
          <div className="text-center py-4">
            <motion.div
              className="text-gray-600"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              Loading more...
            </motion.div>
          </div>
        )}
        {!hasMore && filteredProjects.length > 0 && (
          <p className="text-center text-gray-600 py-4">
            No more projects to load
          </p>
        )}
        <div ref={loadMoreRef} className="h-1" />
      </section>
    </div>
  );
}
