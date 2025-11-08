// CommentItem.tsx
import React from "react";
// import { Comment } from "./types";
import { Avatar } from "@/components/ui/avatar";
import type { Comment } from "./types";
import { timeAgo } from "./utils";

interface Props {
  comment: Comment;
  depth?: number;
  maxDepth?: number;
}

export const CommentItem: React.FC<Props> = ({
  comment,
  depth = 0,
}) => {
  return (
    <div className={`flex gap-3 ${depth > 0 ? "pl-6" : ""}`}>
      <Avatar className="h-9 w-9">
        <span className="rounded-full bg-muted text-sm flex items-center justify-center">
          {comment.author[0] ?? "U"}
        </span>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{comment.author}</span>
          <span className="text-xs text-muted-foreground">
            • {timeAgo(comment.createdAt)}
          </span>
        </div>

        <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
    </div>
  );
};
