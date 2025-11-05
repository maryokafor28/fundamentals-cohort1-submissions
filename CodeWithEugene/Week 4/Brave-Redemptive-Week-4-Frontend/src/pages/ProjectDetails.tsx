import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/common/Button";
import { PageLoader } from "../components/common/PageLoader";
import apiClient from "../lib/apiClient";
import type { Comment, Project } from "../types";

interface ProjectWithComments extends Project {
  comments?: Comment[];
}

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectWithComments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get<ProjectWithComments>(`/projects/${id}`);
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load project");
      } finally {
        setLoading(false);
      }
    };

    void fetchProject();
  }, [id]);

  if (loading) {
    return <PageLoader />;
  }

  if (error || !project) {
    return (
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-slate-100">
        <p className="text-sm text-red-400">{error ?? "Project not found."}</p>
        <Link className="text-primary-400 hover:text-primary-300" to="/">
          ← Back to projects
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-8">
      <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-slate-100">
        <p className="text-sm uppercase tracking-wide text-slate-400">
          {project.status} • started {new Date(project.createdAt).toLocaleDateString()}
        </p>
        <h1 className="text-3xl font-semibold text-white">{project.title}</h1>
        <p className="text-base text-slate-200">{project.summary}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span>By {project.author.username}</span>
          <span>•</span>
          <span>{project.likes} people follow this</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-slate-700 px-3 py-1 uppercase">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {project.repoUrl ? (
            <a
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-100 transition-colors hover:border-primary-400 hover:text-primary-300"
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
            >
              View repository
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-100 transition-colors hover:border-primary-400 hover:text-primary-300"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open live demo
            </a>
          ) : null}
          <Button>Request to collaborate</Button>
        </div>
      </div>

      <div className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-slate-100">
        <h2 className="text-xl font-semibold text-white">Project Overview</h2>
        <p className="text-base leading-relaxed text-slate-200">{project.description}</p>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            {project.techStack.map((stack) => (
              <span key={stack} className="rounded-lg border border-slate-700 px-3 py-1">
                {stack}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Comments</h2>
          <Button variant="secondary">Start thread</Button>
        </div>
        {project.comments && project.comments.length > 0 ? (
          <ul className="space-y-4">
            {project.comments.map((comment) => (
              <li key={comment.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex items-baseline justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-200">{comment.author.username}</span>
                  <time dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className="mt-2 text-sm text-slate-200">{comment.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400">No comments yet. Start the conversation.</p>
        )}
      </section>
    </article>
  );
}
