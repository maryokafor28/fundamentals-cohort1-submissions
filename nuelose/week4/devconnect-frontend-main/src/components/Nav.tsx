import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Nav() {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAuthenticated = !!user; 

  return (
    <nav className="flex justify-between items-center px-8 bg-[#0f162a] py-4 text-slate-50 border-b border-slate-700">
      <Link to="/">
        <div className="flex items-center gap-2">
          <div className="bg-[#38bdf8] p-1 rounded-lg text-slate-800">
            &lt;/&gt;
          </div>
          <h1 className="font-bold text-lg">DevConnect</h1>
        </div>
      </Link>

      {isAuthenticated ? (
        <div className="flex items-center gap-6">
          <Link
            to="/projects"
            className="text-slate-300 hover:text-[#38bdf8] transition-colors"
          >
            Projects
          </Link>

          <Link
            to="/profile"
            className="text-slate-300 hover:text-[#38bdf8] transition-colors"
          >
            Profile
          </Link>

          <Link
            to="/new"
            className="bg-[#38bdf8] px-3 py-1 rounded-lg text-slate-800 font-medium hover:bg-[#0ea5e9] transition-colors"
          >
            + New Project
          </Link>

          <button
            onClick={handleLogout}
            className="text-slate-300 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-3 flex items-center">
          <Link
            to="/login"
            className="text-slate-300 hover:text-[#38bdf8] transition-colors"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="bg-[#38bdf8] px-4 py-1 rounded-lg text-slate-800 font-medium hover:bg-[#0ea5e9] transition-colors"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Nav;
