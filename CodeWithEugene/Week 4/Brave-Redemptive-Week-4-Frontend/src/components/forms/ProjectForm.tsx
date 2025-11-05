import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { TextArea } from "./TextArea";

export const projectSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters"),
  summary: z.string().min(12, "Summary must be at least 12 characters"),
  description: z.string().min(24, "Description must be at least 24 characters"),
  techStack: z.string().min(2, "Include at least one technology"),
  tags: z.string().optional(),
  repoUrl: z
    .string()
    .url("Use a valid URL")
    .or(z.literal(""))
    .optional(),
  liveUrl: z
    .string()
    .url("Use a valid URL")
    .or(z.literal(""))
    .optional(),
  status: z.enum(["open", "in-progress", "completed"]).default("open")
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export interface ProjectPayload {
  title: string;
  summary: string;
  description: string;
  status: "open" | "in-progress" | "completed";
  techStack: string[];
  tags: string[];
  repoUrl?: string | null;
  liveUrl?: string | null;
}

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: (payload: ProjectPayload) => Promise<void> | void;
}

export function ProjectForm({
  defaultValues,
  submitLabel = "Save project",
  isSubmitting = false,
  onSubmit
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      summary: "",
      description: "",
      techStack: "",
      tags: "",
      status: "open",
      ...defaultValues
    }
  });

  const status = watch("status");
  const tagsValue = watch("tags");

  const tagHint = useMemo(() => {
    if (!tagsValue) {
      return "Separate tags with commas";
    }
    return `${tagsValue.split(",").length} tags selected`;
  }, [tagsValue]);

  const handleFormSubmit = handleSubmit(async (values: ProjectFormValues) => {
    const payload: ProjectPayload = {
      title: values.title.trim(),
      summary: values.summary.trim(),
      description: values.description.trim(),
      status: values.status,
      techStack: Array.from(
        new Set(
          values.techStack
            .split(",")
            .map((item: string) => item.trim())
            .filter(Boolean)
        )
      ),
      tags:
        values.tags && values.tags.length > 0
          ? Array.from(
              new Set(
                values.tags
                  .split(",")
                  .map((item: string) => item.trim())
                  .filter(Boolean)
              )
            )
          : [],
      repoUrl: values.repoUrl?.trim() || undefined,
      liveUrl: values.liveUrl?.trim() || undefined
    };
    await onSubmit(payload);
  });

  return (
    <form className="grid gap-6" onSubmit={handleFormSubmit}>
      <div className="grid gap-4">
        <Input
          label="Project title"
          placeholder="Build a GitHub action for release notes"
          error={errors.title?.message}
          {...register("title")}
        />
        <TextArea
          label="Project summary"
          placeholder="One-liner for the community feed"
          error={errors.summary?.message}
          {...register("summary")}
        />
        <TextArea
          label="Detailed description"
          placeholder="Explain the problem, solution, milestones, and collaboration expectations"
          error={errors.description?.message}
          {...register("description")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Tech stack"
          placeholder="React, TypeScript, TailwindCSS"
          helperText="Comma separated list"
          error={errors.techStack?.message}
          {...register("techStack")}
        />
        <Input
          label="Tags"
          placeholder="open-source, hiring, mentorship"
          helperText={tagHint}
          error={errors.tags?.message}
          {...register("tags")}
        />
        <Input
          label="Repository URL"
          placeholder="https://github.com/devconnect/project"
          error={errors.repoUrl?.message}
          {...register("repoUrl")}
        />
        <Input
          label="Live URL"
          placeholder="https://project.devconnect.app"
          error={errors.liveUrl?.message}
          {...register("liveUrl")}
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-200" htmlFor="status">
          Project status
        </label>
        <select
          id="status"
          className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          {...register("status")}
        >
          <option value="open">Open for collaborators</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
        <p className="text-xs text-slate-400">
          Current status: <span className="font-semibold text-slate-200">{status}</span>
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
