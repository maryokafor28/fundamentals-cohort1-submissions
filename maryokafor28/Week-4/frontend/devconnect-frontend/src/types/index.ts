// src/types/index.ts

// =========================
// AUTH TYPES
// =========================
export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// =========================
// PROJECT TYPES
// =========================
export interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  createdBy: User;
  comments: Comment[];
  repoUrl?: string;
  liveUrl?: string;
  createdAt: string;
  updatedAt: string;
  commentCount?: number;
}

export interface CreateProjectData {
  title: string;
  description: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
}

// =========================
// COMMENT TYPES
// =========================
export interface Comment {
  _id: string;
  text: string;
  user?: {
    _id: string;
    name: string;
    email?: string;
  };
  userId?: {
    _id: string;
    name: string;
    email?: string;
  };
  createdAt: string;
  projectId?: string;
}
export interface CreateCommentData {
  text: string;
  projectId: string;
}
export interface AddCommentResponse {
  message: string;
  comment: Comment;
}

// =========================
// COMPONENT PROP TYPES
// =========================
export interface CommentItemProps {
  comment: Comment; // ✅ Use the Comment type directly
  onUpdate: (updatedComment: Comment) => void;
  onDelete: (commentId: string) => void;
}
export interface CommentSectionProps {
  projectId: string;
}

export interface ProjectActionsProps {
  projectId: string;
}

export interface ProjectCardProps {
  project: Project;
}

// =========================
// API FETCH TYPES
// =========================
export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}
export interface UserProfile {
  _id?: string;
  fullName?: string;
  name?: string;
  email: string;
  techStack?: string;
  github?: string;
  linkedin?: string;
  bio?: string;
  avatar?: string; // optional profile photo URL
}
