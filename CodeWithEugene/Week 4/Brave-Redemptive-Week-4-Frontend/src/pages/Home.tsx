import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProjectCard } from "../components/common/ProjectCard";
import { Button } from "../components/common/Button";
import { PageLoader } from "../components/common/PageLoader";
import { useProjects } from "../hooks/useProjects";
import type { Project } from "../types";

export default function HomePage() {
  const { projects, loading, error } = useProjects();
  const navigate = useNavigate();

  const spotlight: Project[] = useMemo(() => projects.slice(0, 3), [projects]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-gradient-to-br from-primary-500/15 via-slate-900 to-slate-950 p-8 text-white">
        <h1 className="text-3xl font-semibold sm:text-4xl">Discover collaborators. Ship faster.</h1>
        <p className="max-w-2xl text-base text-slate-200">
          DevConnect connects developers, designers, and product thinkers building the next
          generation of tools. Share your idea, gather feedback, and form the team you need to
          launch.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}>
            Explore projects
          </Button>
          <Button variant="secondary" onClick={() => navigate("/projects/new")}>
            Start a project
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Spotlight this week</h2>
          <Link to="/projects/new" className="text-sm text-primary-400 hover:text-primary-300">
            Submit yours →
          </Link>
        </div>
        {loading ? (
          <PageLoader />
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {spotlight.map((project) => (
              <ProjectCard key={project.id} project={project} orientation="horizontal" />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4" id="recent-projects">
        <h2 className="text-xl font-semibold text-white">Recent projects</h2>
        {loading ? (
          <PageLoader />
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
