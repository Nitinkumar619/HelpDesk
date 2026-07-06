import React, { useEffect, useState } from "react";
import { Building2, ArrowLeft, LogOut, User, Menu, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = ({ isLoggedIn, onLogout }) => {
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserName(decoded.name || "User");
        } catch (err) {
          console.error("Invalid token", err);
        }
      }
    }
  }, [isLoggedIn]);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (<>
    <header className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {location.pathname !== "/" && (
              <button
                onClick={handleBackClick}
                className="text-white hover:bg-indigo-700 p-2 rounded-lg transition-all duration-300 ease-in-out"
                aria-label="Back to Home"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-white p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                <Building2 className="h-6 w-6 text-indigo-700" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors duration-300">
                IIITA <span className="text-indigo-300">Help Desk</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            {!isLoggedIn ? (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-white border border-indigo-400 hover:bg-indigo-700 rounded-lg transition-all duration-300 flex items-center gap-2 hover:shadow-lg"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 text-sm font-medium text-indigo-800 bg-white hover:bg-gray-100 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 bg-indigo-700 text-white rounded-lg font-medium text-sm hover:bg-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <div className="bg-white text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-inner">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span>{userName}</span>
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="bg-rose-700 px-5 py-2.5 text-sm cursor-pointer font-medium text-white hover:bg-rose-600 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:bg-indigo-700 p-2 rounded-lg transition duration-300"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-indigo-700 mt-4 animate-fade-in-down">
            {!isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 rounded-lg transition duration-300 flex items-center gap-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-3 text-sm font-medium text-indigo-800 bg-white hover:bg-gray-100 rounded-lg transition duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="bg-white text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span>{userName}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogoutClick();
                    setMenuOpen(false);
                  }}
                  className="bg-rose-700 px-4 py-3 text-sm cursor-pointer font-medium text-white hover:bg-rose-600 rounded-lg transition duration-300 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  </>
    
  );
};

export default Header;