import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; //
import { Button } from "../ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // ✅ Get user and logout
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Users", path: "/users" },
    { name: "Doctors", path: "/doctors" },
    { name: "Appointments", path: "/appointments" },
    { name: "Activities", path: "/activities" },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-primary/50 text-primary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Brand */}
        <h1 className="text-xl font-semibold">MyApp</h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `hover:text-secondary transition ${
                      isActive ? "underline underline-offset-4" : ""
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop Logout */}
          {user && (
            <div className="flex items-center gap-4 border-l pl-6">
              <span className="text-sm">
                {user.name} {user.role === "doctor" && "🩺"}
              </span>
              <Button
                onClick={handleLogout}
                variant={"outline"}
                className="flex items-center gap-2 px-4 py-2 transition"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-primary/20">
          <ul className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded hover:bg-secondary ${
                      isActive ? "bg-primary text-white font-medium" : ""
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}

            {/* Mobile Logout */}
            {user && (
              <li className="border-t pt-4 w-full text-center">
                <div className="text-sm mb-2">
                  Logged in as: <strong>{user.name}</strong>
                  {user.role === "doctor" && " 🩺"}
                </div>
                <Button
                  onClick={handleLogout}
                  variant={"outline"}
                  className="flex items-center justify-center gap-2 mx-auto px-6 py-2  transition"
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
