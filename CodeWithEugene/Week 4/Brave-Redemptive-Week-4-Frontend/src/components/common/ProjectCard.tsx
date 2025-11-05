import { Link } from "react-router-dom";
import clsx from "clsx";
import type { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
  orientation?: "vertical" | "horizontal";
}

const statusColors: Record<Project["status"], string> = {
  open: "bg-emerald-500/15 text-emerald-300",
  "in-progress": "bg-amber-500/15 text-amber-300",
  completed: "bg-sky-500/15 text-sky-300"
};

export function ProjectCard({ project, orientation = "vertical" }: ProjectCardProps) {
  return (
    <article
      className={clsx(
        "group flex w-full rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-colors hover:border-primary-400 hover:bg-slate-900",
        orientation === "horizontal" ? "flex-row gap-6" : "flex-col gap-4"
      )}
    >
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
          <span className="flex items-center gap-2 font-medium text-slate-300">
            <span
              className={clsx(
                "inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold",
                statusColors[project.status]
              )}
            >
              {project.status}
            </span>
            by {project.author.username}
          </span>
          <time dateTime={project.createdAt} className="text-slate-500">
            {new Date(project.createdAt).toLocaleDateString()}
          </time>
        </div>
        <Link to={`/projects/${project.id}`} className="text-lg font-semibold text-white">
          {project.title}
        </Link>
        <p className="text-sm text-slate-300">{project.summary}</p>
        <ul className="flex flex-wrap gap-2 text-xs text-slate-400">
          {project.techStack.slice(0, 4).map((tech) => (
            <li
              key={`${project.id}-${tech}`}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wide"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
      {orientation === "horizontal" ? (
        <div className="flex w-48 flex-col justify-between gap-4 text-sm text-slate-400">
          <p>{project.description.slice(0, 120)}...</p>
          <Link
            to={`/projects/${project.id}`}
            className="text-primary-400 transition-colors hover:text-primary-300"
          >
            View details →
          </Link>
        </div>
      ) : null}
    </article>
  );
}
