import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Users", path: "/users" },
    { name: "Doctors", path: "/doctors" },
    { name: "Activities", path: "/activities" },
    { name: "Meals", path: "/meals" },
    { name: "Appointments", path: "/appointments" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
      <h1 className="text-2xl font-bold text-primary">PulseTrack</h1>
      <ul className="flex gap-6">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`${
                location.pathname === link.path
                  ? "text-primary font-semibold"
                  : "text-gray-600"
              } hover:text-primary transition`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
