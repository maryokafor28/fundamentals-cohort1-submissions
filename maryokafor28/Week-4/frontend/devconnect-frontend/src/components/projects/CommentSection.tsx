"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import CommentItem from "./CommentItem";
import { useAuth } from "@/context/AuthProvider";
import { Comment, CommentSectionProps, AddCommentResponse } from "@/types";

export default function CommentSection({ projectId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // ✅ Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch comments independently of auth state
  useEffect(() => {
    if (!projectId || !mounted) return;

    async function fetchComments() {
      try {
        setFetchLoading(true);
        // ✅ Fixed: Backend returns { comments: Comment[] }
        const res = await apiFetch<{ comments: Comment[] }>(
          `/api/comments/${projectId}`
        );
        console.log("📝 Fetched comments:", res);

        // ✅ Extract the comments array from the response
        const commentsData = res.comments || [];
        console.log("📝 Number of comments:", commentsData.length);
        console.log("💾 Setting comments to state:", commentsData);

        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setComments([]);
      } finally {
        setFetchLoading(false);
      }
    }

    fetchComments();
  }, [projectId, mounted]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      const res = await apiFetch<AddCommentResponse>(
        `/api/comments/${projectId}`,
        {
          method: "POST",
          body: { text: newComment },
        }
      );

      console.log("✅ Add comment response:", res);
      console.log("👤 userId in response:", res.comment?.userId);

      const newCommentData = res.comment || res;

      setComments((prev) => {
        const updated = [...prev, newCommentData];
        console.log("💾 Updated comments array:", updated);
        return updated;
      });
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComment = (updated: Comment) => {
    setComments((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  // Don't render until mounted
  if (!mounted || fetchLoading) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Comments</h2>
        <p className="text-gray-300 text-sm">Loading comments...</p>
      </div>
    );
  }

  console.log("🎨 Rendering with comments:", comments);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-3">
        Comments ({comments.length})
      </h2>

      <div className="space-y-3 mb-6">
        {comments.length > 0 ? (
          comments.map((c, index) => {
            console.log(` Rendering comment ${index}:`, c);
            return (
              <CommentItem
                key={c._id || `comment-${index}`}
                comment={c}
                onUpdate={handleUpdateComment}
                onDelete={handleDeleteComment}
              />
            );
          })
        ) : (
          <p className="text-gray-300 text-sm">
            No comments yet. Be the first!
          </p>
        )}
      </div>

      {user ? (
        <form onSubmit={handleAddComment} className="flex gap-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-lg bg-white/20 border border-white/30 p-2 text-white placeholder-gray-200 focus:outline-none"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 px-6"
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </form>
      ) : (
        <p className="text-gray-300 text-sm">
          <a href="/login" className="text-blue-300 underline">
            Log in
          </a>{" "}
          to post a comment.
        </p>
      )}
    </div>
  );
}
