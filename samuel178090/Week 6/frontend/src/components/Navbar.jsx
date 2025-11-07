import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  // Check authentication status on mount and location change
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    setIsLoggedIn(!!token);
    setUserId(storedUserId);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserId(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-blue-700 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            onClick={closeMenu}
            className="text-2xl font-bold text-white hover:text-blue-200 transition duration-300"
          >
            FlowServe
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                isActive('/') 
                  ? 'bg-blue-800 text-white' 
                  : 'text-white hover:bg-blue-600'
              }`}
            >
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                    isActive('/dashboard') 
                      ? 'bg-blue-800 text-white' 
                      : 'text-white hover:bg-blue-600'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/transactions"
                  className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                    isActive('/transactions') 
                      ? 'bg-blue-800 text-white' 
                      : 'text-white hover:bg-blue-600'
                  }`}
                >
                  Transactions
                </Link>

                <Link
                  to="/users"
                  className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                    isActive('/users') 
                      ? 'bg-blue-800 text-white' 
                      : 'text-white hover:bg-blue-600'
                  }`}
                >
                  Users
                </Link>
                <Link
                  to="/history"
                  className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                    isActive('/history') 
                      ? 'bg-blue-800 text-white' 
                      : 'text-white hover:bg-blue-600'
                  }`}
                >
                  History
                </Link>
                <Link
                  to="/vcc"
                  className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                    isActive('/vcc') 
                      ? 'bg-blue-800 text-white' 
                      : 'text-white hover:bg-blue-600'
                  }`}
                >
                  VCC
                </Link>
                <Link
                  to="/subaccounts"
                  className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                    isActive('/subaccounts') 
                      ? 'bg-blue-800 text-white' 
                      : 'text-white hover:bg-blue-600'
                  }`}
                >
                  Subaccounts
                </Link>
                
                {/* Dropdown for Profile/Settings */}
                <div className="relative group">
                  <button className="px-4 py-2 rounded-lg font-semibold text-white hover:bg-blue-600 transition duration-300 flex items-center">
                    Account
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 rounded-t-lg"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 rounded-b-lg"
                    >
                      Settings
                    </Link>
                  </div>
                </div>
                

                
                {/* User Profile Indicator */}
                <div className="flex items-center ml-4 pl-4 border-l border-blue-500">
                  <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                    isActive('/register') 
                      ? 'bg-blue-800 text-white' 
                      : 'text-white hover:bg-blue-600'
                  }`}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className={`px-4 py-2 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition duration-300 ml-2`}
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              // Close icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={closeMenu}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                  isActive('/') 
                    ? 'bg-blue-800 text-white' 
                    : 'text-white hover:bg-blue-600'
                }`}
              >
                Home
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                      isActive('/dashboard') 
                        ? 'bg-blue-800 text-white' 
                        : 'text-white hover:bg-blue-600'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/history"
                    onClick={closeMenu}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                      isActive('/history') 
                        ? 'bg-blue-800 text-white' 
                        : 'text-white hover:bg-blue-600'
                    }`}
                  >
                    History
                  </Link>
                  <Link
                    to="/transactions"
                    onClick={closeMenu}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                      isActive('/transactions') 
                        ? 'bg-blue-800 text-white' 
                        : 'text-white hover:bg-blue-600'
                    }`}
                  >
                    Transactions
                  </Link>

                  <Link
                    to="/users"
                    onClick={closeMenu}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                      isActive('/users') 
                        ? 'bg-blue-800 text-white' 
                        : 'text-white hover:bg-blue-600'
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    to="/vcc"
                    onClick={closeMenu}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                      isActive('/vcc') 
                        ? 'bg-blue-800 text-white' 
                        : 'text-white hover:bg-blue-600'
                    }`}
                  >
                    Virtual Cards
                  </Link>
                  <Link
                    to="/subaccounts"
                    onClick={closeMenu}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                      isActive('/subaccounts') 
                        ? 'bg-blue-800 text-white' 
                        : 'text-white hover:bg-blue-600'
                    }`}
                  >
                    Subaccounts
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                      isActive('/profile') 
                        ? 'bg-blue-800 text-white' 
                        : 'text-white hover:bg-blue-600'
                    }`}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={closeMenu}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                      isActive('/settings') 
                        ? 'bg-blue-800 text-white' 
                        : 'text-white hover:bg-blue-600'
                    }`}
                  >
                    Settings
                  </Link>

                  
                  {/* User Info */}
                  {userId && (
                    <div className="px-4 py-2 text-white text-sm border-t border-blue-500 mt-2 pt-4">
                      <div className="flex items-center mb-2">
                        <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs opacity-75">User ID: {userId.slice(0, 8)}...</span>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-300 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                      isActive('/register') 
                        ? 'bg-blue-800 text-white' 
                        : 'text-white hover:bg-blue-600'
                    }`}
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className={`px-4 py-2 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition duration-300`}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;