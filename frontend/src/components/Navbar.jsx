import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiUser,
  FiMenu,
  FiX,
  FiBook,
} from "react-icons/fi";
import Profile from "../pages/Profile";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <FiBook className="text-white text-xl" />
              </div>
              <h1 className="hidden md:block text-xl font-bold text-blue-700">
                KHYBER PUBLIC SCHOOL
              </h1>
              <h1 className="md:hidden text-lg font-bold text-blue-700">
                KPS & C
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`
                }
              >
                <FiHome size={18} />
                <span>Home</span>
              </NavLink>

              <NavLink
                to={
                  user?.user?.role === "admin"
                    ? "/dashboard"
                    : user?.user?.role === "teacher"
                    ? "/teacherdashboard"
                    : user?.user?.role === "student"
                    ? "/studentdashboard"
                    : "/login"
                }
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`
                }
              >
                <FiGrid size={18} />
                <span>Dashboard</span>
              </NavLink>

            </div>

            <div className="flex items-center space-x-3">
              {user && (
                <div className="hidden lg:flex items-center space-x-3 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.user?.name}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">
                      {user?.user?.role}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium"
              >
                <FiUser size={18} />
                <span className="hidden sm:block">Profile</span>
              </button>

              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>

          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
            }`}
          >
            <div className="border-t border-gray-200 pt-4 space-y-2">
              {user && (
                <div className="flex items-center space-x-3 mx-2 mb-3 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.user?.name}
                    </p>
                    <p className="text-xs text-gray-600">{user?.user?.email}</p>
                    <p className="text-xs text-blue-600 capitalize font-medium">
                      {user?.user?.role}
                    </p>
                  </div>
                </div>
              )}

              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                <FiHome size={18} />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                <FiGrid size={18} />
                <span>Dashboard</span>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <Profile showProfile={showProfile} setShowProfile={setShowProfile} />
    </>
  );
};

export default Navbar;
