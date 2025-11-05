import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectForm } from "../components/forms/ProjectForm";
import type { ProjectFormValues, ProjectPayload } from "../components/forms/ProjectForm";
import apiClient from "../lib/apiClient";
import type { Project } from "../types";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<ProjectFormValues>>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get<Project>(`/projects/${id}`);
        setInitialValues({
          title: data.title,
          summary: data.summary,
          description: data.description,
          techStack: data.techStack.join(", "),
          tags: data.tags.join(", "),
          repoUrl: data.repoUrl ?? "",
          liveUrl: data.liveUrl ?? "",
          status: data.status
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load project");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProject();
  }, [id]);

  const handleUpdate = async (payload: ProjectPayload) => {
    if (!id) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await apiClient.put(`/projects/${id}`, payload);
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-400">Loading project...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (!initialValues) {
    return <p className="text-sm text-slate-400">Project not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Update project</h1>
        <p className="text-sm text-slate-400">Refresh details to keep collaborators in sync.</p>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <ProjectForm
        defaultValues={initialValues}
        submitLabel="Save changes"
        isSubmitting={isSubmitting}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
