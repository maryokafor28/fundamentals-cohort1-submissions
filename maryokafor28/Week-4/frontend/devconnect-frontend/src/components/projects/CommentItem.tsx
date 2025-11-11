"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { apiFetch } from "@/lib/api";
import { CommentItemProps, Comment } from "@/types";

export default function CommentItem({
  comment,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const { user } = useAuth();

  //  Handle both populated and non-populated userId
  const commentUser =
    typeof comment.userId === "object"
      ? comment.userId
      : { _id: comment.userId, name: "Anonymous" };

  const isOwner = user?._id === commentUser?._id;

  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(comment.text);
  const [loading, setLoading] = useState(false);

  const handleSaveEdit = async () => {
    if (!newText.trim()) return;
    try {
      setLoading(true);
      const res = await apiFetch<Comment>(`/api/comments/${comment._id}`, {
        method: "PUT",
        body: { text: newText },
      });
      onUpdate(res);
      setIsEditing(false);
    } catch (err) {
      console.error("Edit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    try {
      await apiFetch(`/api/comments/${comment._id}`, { method: "DELETE" });
      onDelete(comment._id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const userName = commentUser?.name || "Anonymous";
  const formattedDate = comment.createdAt
    ? new Date(comment.createdAt).toLocaleString()
    : "Just now";

  return (
    <div className="bg-white/10 p-3 rounded-lg border border-white/10 mb-3">
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full bg-white/20 border border-white/30 text-white p-2 rounded-md focus:outline-none resize-none"
          />
          <div className="flex gap-3">
            <Button
              onClick={handleSaveEdit}
              disabled={loading}
              className="bg-green-700 hover:bg-green-800"
            >
              Save
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="border-gray-400 text-gray-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-100">{comment.text}</p>
          <div className="text-sm text-gray-400 mt-1 flex justify-between">
            <span>
              — {userName} on {formattedDate}
            </span>

            {isOwner && (
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
