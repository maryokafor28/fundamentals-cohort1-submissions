// CommentForm.tsx
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  placeholder?: string;
  initial?: string;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export const CommentForm: React.FC<Props> = ({
  placeholder = "Write a comment...",
  initial = "",
  onSubmit,
  onCancel,
  submitLabel = "Post",
}) => {
  const [value, setValue] = React.useState(initial);
  const submitting = false;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!value.trim() || submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
