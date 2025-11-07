import { NavLink } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import { CiGrid42 } from "react-icons/ci";
import { GrTransaction } from "react-icons/gr";


const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: <CiGrid42 /> },
    { name: "Users", path: "/users", icon: <FiUsers /> },
    { name: "Transactions", path: "/transactions", icon: <GrTransaction /> },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] flex flex-col">
      <nav className=" px-4 py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg mb-2 hover:bg-lightGreen transition ${
                isActive ? "bg-lightGreen font-semibold" : ""
              }`
            }
          >
            <div className="flex items-center gap-2">
                {item.icon }{item.name}
            </div>
            
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
