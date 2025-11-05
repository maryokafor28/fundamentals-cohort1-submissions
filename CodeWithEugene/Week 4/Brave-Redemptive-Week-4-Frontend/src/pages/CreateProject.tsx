import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectForm } from "../components/forms/ProjectForm";
import type { ProjectPayload } from "../components/forms/ProjectForm";
import apiClient from "../lib/apiClient";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (payload: ProjectPayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
  const { data } = await apiClient.post<{ id?: string }>("/projects", payload);
  const destination = data.id ? `/projects/${data.id}` : "/";
  navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Share a new project</h1>
        <p className="text-sm text-slate-400">
          Describe your idea, select technologies, and invite collaborators.
        </p>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <ProjectForm submitLabel="Publish project" isSubmitting={isSubmitting} onSubmit={handleCreate} />
    </div>
  );
}
