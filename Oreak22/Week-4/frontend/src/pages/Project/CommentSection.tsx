// CommentSection.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import type { Comment } from "./types";
import { useAuth } from "@/context/AuthContext";
import axiosClient from "@/api/axiosClient";

export const CommentSection: React.FC<{
  maxReplyDepth?: number;
  id: string;
  tagId: string;
  comments: Comment[];
}> = ({ maxReplyDepth = 0, id, tagId, comments }) => {
  // const [comments, setComments] = React.useState<Comment[]>(initial);
  const { user } = useAuth();

  const handleComment = (content: string) => {
    try {
      axiosClient
        .post("/project/newComment", {
          author: user?.userName,
          content,
          projectId: id,
        })
        .then(() => {
          // setComments(comments.push(res.data.comment));
        })
        .catch(() => {});
    } catch {}
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Comments</h3>
      </div>

      {tagId != "user?.id" && (
        <div className="mt-4">
          <CommentForm
            onSubmit={handleComment}
            placeholder="Add a comment..."
            submitLabel="Comment"
          />
        </div>
      )}

      <Separator className="my-4" />

      <div className="space-y-6">
        {comments?.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Be the first to comment.
          </p>
        ) : (
          comments?.map((c) => (
            <CommentItem key={c.id} comment={c} maxDepth={maxReplyDepth} />
          ))
        )}
      </div>
    </Card>
  );
};
