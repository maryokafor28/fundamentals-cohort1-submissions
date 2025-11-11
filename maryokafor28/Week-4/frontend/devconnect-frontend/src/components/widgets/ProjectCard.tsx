"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Code, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:scale-[1.02] transition-transform duration-200">
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
        <p className="text-sm text-gray-300 line-clamp-2">
          {project.description}
        </p>
      </CardHeader>

      {/* Content */}
      <CardContent>
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-2">
          {project.techStack?.map((tech: string, index: number) => (
            <Badge key={index} className="bg-purple-600 hover:bg-purple-700">
              {tech.trim()}
            </Badge>
          ))}
        </div>

        {/* Links Section */}
        <div className="flex gap-3 mb-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demo</span>
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Code className="w-4 h-4" />
              <span>Repository</span>
            </a>
          )}
        </div>

        {/* Author and Comment Count */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <p>By {project.createdBy?.name || "Unknown"}</p>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            <span>{project.commentCount || 0}</span>
          </div>
        </div>

        {/* 👤 View Profile Button */}
        {project.createdBy?._id && (
          <Link href={`/profile/${project.createdBy._id}`}>
            <Button
              variant="outline"
              className="w-full border-blue-500 text-blue-400 hover:bg-blue-700 hover:text-white mb-3"
            >
              <User className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </Link>
        )}
      </CardContent>

      {/* 🔍 View Project Button */}
      <CardContent className="pt-0">
        <Link href={`/projects/${project._id}`}>
          <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
