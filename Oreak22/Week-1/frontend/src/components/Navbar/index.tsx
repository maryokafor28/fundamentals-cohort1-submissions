import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type NavLink = {
  name: string;
  to: string;
};

const navLinks: NavLink[] = [
  { name: "Home", to: "/" },
  { name: "Shop", to: "/shop" },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [cartNumber, setcartNumber] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("brave_user");
    if (user) {
      JSON.parse(user).name && setUserName(JSON.parse(user).name);
    }
  }, []);
  useEffect(() => {
    const cart = async () => {
      const stringCart = localStorage.getItem("braveCart");
      if (stringCart) {
        const mycartNumber = JSON.parse(stringCart).length;
        setcartNumber(mycartNumber);
      }
    };
    cart();
  }, []);

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="text-2xl font-bold text-[#766DF4]">
            BaveCommerce
          </Link>
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="text-gray-700 hover:text-[#766DF4] px-3 py-2 rounded-md text-md font-medium transition"
            >
              {link.name}
            </Link>
          ))}
        </div>
        {/* Cart & User Icons */}
        <div className="hidden md:flex items-center gap-5 space-x-4">
          <button
            className="relative cursor-pointer w-10 aspect-square flex justify-center items-center active:outline-1 active:outline-gray-300 rounded-full"
            onClick={() => navigate("/mycart")}
          >
            <span className="material-symbols-outlined text-gray-700 text-4xl">
              shopping_cart
            </span>
            {cartNumber > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {cartNumber}
              </span>
            )}
          </button>
          {userName !== "" ? (
            <button
              title={userName !== "" ? userName : "login / signup"}
              className="cursor-pointer active:outline-1 aspect-square active:outline-gray-300 rounded-full w-10 outline outline-indigo-700 shadow-sm bg-gray-200 text-indigo-700 font-bold"
            >
              {userName.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              title={userName !== "" ? userName : "login / signup"}
              className="cursor-pointer active:outline-1 active:outline-gray-300 rounded "
            >
              <span className="material-symbols-outlined text-gray-700 text-2xl">
                person
              </span>
            </button>
          )}
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="block text-gray-700 hover:text-[#766DF4] px-3 py-2 rounded-md text-base font-medium transition"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 px-3 gap-5 py-2">
              <button
                className="relative w-10 aspect-square flex justify-center items-center active:outline-1 active:outline-gray-300 rounded-full"
                onClick={() => navigate("/mycart")}
              >
                <span className="text-gray-700 text-2xl material-symbols-outlined">
                  shopping_cart
                </span>
                {cartNumber > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                    {cartNumber}
                  </span>
                )}
              </button>
              {userName !== "" ? (
                <button
                  title={userName !== "" ? userName : "login / signup"}
                  className="cursor-pointer active:outline-1 aspect-square active:outline-gray-300 rounded-full w-10 outline outline-indigo-700 shadow-sm bg-gray-200 text-indigo-700 font-bold"
                >
                  {userName.charAt(0).toUpperCase()}
                </button>
              ) : (
                <button
                  title={userName !== "" ? userName : "login / signup"}
                  className="cursor-pointer active:outline-1 active:outline-gray-300 rounded outline outline-indigo-400"
                >
                  <span className="material-symbols-outlined text-gray-700 text-2xl">
                    person
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
