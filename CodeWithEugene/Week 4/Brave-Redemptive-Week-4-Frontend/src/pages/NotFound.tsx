import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-100">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-2xl font-bold text-white">
        404
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Page missing</h1>
        <p className="text-sm text-slate-400">
          The page you are looking for could not be found. It might have been moved or removed.
        </p>
      </div>
      <Link
        className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:border-primary-400 hover:text-primary-300"
        to="/"
      >
        Back to projects
      </Link>
    </section>
  );
}
