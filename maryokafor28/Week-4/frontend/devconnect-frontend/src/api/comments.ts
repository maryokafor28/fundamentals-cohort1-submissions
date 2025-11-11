// api/comments.ts
import { apiFetch } from "@/lib/api";
import { Comment, CreateCommentData } from "@/types";

export const CommentAPI = {
  getByProject: (projectId: string) =>
    apiFetch<Comment[]>(`/api/comments/${projectId}`),

  add: (projectId: string, data: CreateCommentData) => {
    console.log("🚀 CommentAPI.add called with:", { projectId, data });
    return apiFetch<Comment>(`/api/comments/${projectId}`, {
      method: "POST",
      body: data,
    });
  },
};
