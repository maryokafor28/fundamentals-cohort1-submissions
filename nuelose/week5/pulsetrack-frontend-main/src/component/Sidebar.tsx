import { NavLink } from "react-router-dom";
import { VscHome } from "react-icons/vsc";
import { FiUsers } from "react-icons/fi";
import { BsActivity } from "react-icons/bs";
import { GiKnifeFork } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { GrDocumentText } from "react-icons/gr";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: <VscHome /> },
    { name: "Users", path: "/users", icon: <FiUsers /> },
    { name: "Activities", path: "/activities", icon: <BsActivity /> },
    { name: "Meals", path: "/meals", icon: <GiKnifeFork/> },
    { name: "Doctors", path: "/doctors", icon: <FaUserDoctor /> },
    { name: "Appointments", path: "/appointments", icon:<RiCalendarScheduleLine/>  },
    { name: "Reports", path: "/reports", icon: <GrDocumentText /> },
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
