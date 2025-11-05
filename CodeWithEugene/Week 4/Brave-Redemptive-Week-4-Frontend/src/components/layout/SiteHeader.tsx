import { type ChangeEvent, type FormEvent, useState } from "react";
import { Bell, ChevronDown, Menu, Search, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../common/Button";

export function SiteHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Discover", href: "/" },
    { label: "Community", href: "/community" },
    { label: "Profile", href: user ? `/profile/${user.username}` : "/profile" }
  ];

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }
    navigate(`/?query=${encodeURIComponent(query.trim())}`);
    setIsMenuOpen(false);
  };

  const handleCreateProject = () => {
    navigate("/projects/new");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-base font-bold">
            DC
          </span>
          DevConnect
        </Link>
        <form
          className="relative hidden max-w-sm flex-1 md:block"
          onSubmit={handleSearch}
          role="search"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            className="w-full rounded-full border border-slate-800 bg-slate-900 pl-10 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
            placeholder="Search projects, people, or tags"
            aria-label="Search DevConnect"
          />
        </form>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-300 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "text-white" : "transition-colors hover:text-white"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <Button
                variant="ghost"
                aria-label="Notifications"
                className="hidden lg:inline-flex"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                className="hidden sm:inline-flex"
                onClick={handleCreateProject}
              >
                Share project
              </Button>
              <button
                type="button"
                onClick={() => navigate(user ? `/profile/${user.username}` : "/profile")}
                className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm font-semibold text-slate-200 hover:border-primary-400 hover:text-white sm:flex"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                  {user.username.slice(0, 2).toUpperCase()}
                </span>
                {user.username}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <Button
                variant="ghost"
                className="sm:hidden"
                onClick={() => setIsMenuOpen((nextOpen: boolean) => !nextOpen)}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-nav"
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>Log in</Button>
              <Button onClick={() => navigate("/register")}>Sign up</Button>
            </div>
          )}
        </div>
      </div>
      {isAuthenticated && user && isMenuOpen ? (
        <div id="mobile-nav" className="border-t border-slate-800 bg-slate-950/95 px-4 py-3 lg:hidden">
          <form className="relative mb-3" onSubmit={handleSearch} role="search">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
              className="w-full rounded-full border border-slate-800 bg-slate-900 pl-10 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Search projects, people, or tags"
              aria-label="Search DevConnect"
            />
          </form>
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={`mobile-${link.href}`}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }: { isActive: boolean }) =>
                  `text-sm font-medium ${isActive ? "text-white" : "text-slate-300"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex flex-wrap gap-2">
              <Button className="flex-1" onClick={handleCreateProject}>
                Share project
              </Button>
              <Button variant="secondary" className="flex-1" onClick={handleLogout}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
