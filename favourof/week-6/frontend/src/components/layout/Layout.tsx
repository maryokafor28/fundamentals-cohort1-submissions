import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-power/5 to-zinc-50">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold text-power">
            FlowServe
          </Link>
          <nav className="flex items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-power font-medium" : "text-slate-700"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? "text-power font-medium" : "text-slate-700"
              }
            >
              Users
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive ? "text-power font-medium" : "text-slate-700"
              }
            >
              Transactions
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
