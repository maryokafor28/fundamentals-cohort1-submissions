import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProjectCard } from "../components/common/ProjectCard";
import { PageLoader } from "../components/common/PageLoader";
import apiClient from "../lib/apiClient";
import type { Project, User } from "../types";

interface ProfileResponse {
  user: User;
  projects: Project[];
  collaborations: Project[];
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: profile } = await apiClient.get<ProfileResponse>(`/users/${username}`);
        setData(profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, [username]);

  if (loading) {
    return <PageLoader />;
  }

  if (error || !data) {
    return (
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 text-slate-100">
        <p className="text-sm text-red-400">{error ?? "Profile not found."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-xl font-semibold text-white">
            {data.user.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-white">{data.user.username}</h1>
            <p className="text-sm text-slate-400">{data.user.bio ?? "No bio yet."}</p>
            <p className="text-xs text-slate-500">
              Member since {new Date(data.user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Projects by {data.user.username}</h2>
          <span className="text-xs uppercase tracking-wide text-slate-500">
            {data.projects.length} published
          </span>
        </div>
        {data.projects.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {data.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No projects yet.</p>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Collaborations</h2>
          <span className="text-xs uppercase tracking-wide text-slate-500">
            {data.collaborations.length} joined
          </span>
        </div>
        {data.collaborations.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {data.collaborations.map((project) => (
              <ProjectCard key={`${project.id}-collab`} project={project} orientation="horizontal" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No collaborations yet.</p>
        )}
      </section>
    </div>
  );
}
