import { Link } from "react-router-dom";

export default function CommunityPage() {
  return (
    <section className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-slate-100">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Community Hub</h1>
        <p className="text-sm text-slate-400">
          Join discussions, showcase progress, and find teammates for your next launch. This
          space will evolve as community features roll out.
        </p>
      </div>
      <div className="grid gap-4">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-white">Office Hours</h2>
          <p className="mt-2 text-sm text-slate-300">
            Weekly sessions to get feedback on your project architecture, roadmaps, or API
            design. RSVP to join live calls with mentors and other builders.
          </p>
          <a
            className="mt-4 inline-flex w-fit rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-100 transition-colors hover:border-primary-400 hover:text-primary-300"
            href="https://cal.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reserve a seat
          </a>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-white">Looking for collaborators?</h2>
          <p className="mt-2 text-sm text-slate-300">
            Explore open projects or share what you are eager to build. We will highlight a few
            standout ideas in the weekly newsletter.
          </p>
          <Link
            className="mt-4 inline-flex w-fit rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-100 transition-colors hover:border-primary-400 hover:text-primary-300"
            to="/projects/new"
          >
            Share a project
          </Link>
        </article>
      </div>
    </section>
  );
}
