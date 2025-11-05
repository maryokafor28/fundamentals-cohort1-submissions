import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const quickFilters = [
  { label: "All Projects", href: "/" },
  { label: "Open for Collaboration", href: "/?status=open" },
  { label: "In Progress", href: "/?status=in-progress" },
  { label: "Completed", href: "/?status=completed" }
];

const toLearn = [
  { label: "Design Guidelines", href: "https://tailwindcss.com/docs" },
  { label: "API Reference", href: "https://devconnect.docs.api" },
  { label: "Community Handbook", href: "https://developerexperience.netlify.app" }
];

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="grid h-fit gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300 shadow-lg shadow-slate-950/30 lg:sticky lg:top-24 lg:w-72">
      {user ? (
        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-wide text-slate-500">Welcome back</span>
          <p className="text-lg font-semibold text-white">{user.username}</p>
          <p className="text-xs text-slate-400">
            Share what you are building and find collaborators aligned with your goals.
          </p>
          <Link
            to="/projects/new"
            className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-400"
          >
            Launch new project
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-white">Join DevConnect</p>
          <p className="text-xs text-slate-400">
            Create an account to follow projects, leave comments, and start collaborations.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-400"
          >
            Create account
          </Link>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-slate-500">Quick filters</p>
        <ul className="grid gap-2">
          {quickFilters.map((filter) => (
            <li key={filter.href}>
              <Link className="transition-colors hover:text-white" to={filter.href}>
                {filter.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-slate-500">Resources</p>
        <ul className="grid gap-2">
          {toLearn.map((item) => (
            <li key={item.href}>
              <a
                className="transition-colors hover:text-white"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
