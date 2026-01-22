import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import profileImg from "../assets/icons8-account-100.png";

function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const user = JSON.parse(localStorage.getItem("user"));
  const [open, setOpen] = useState(false);

  // ROLE BASED DASHBOARD
  const dashboardRoute =
    user?.role === "admin" || user?.role === "superadmin"
      ? "/admin/dashboard"
      : "/student/dashboard";

  return (
    <nav className="bg-purple-950 border-b border-purple-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-white"
          >
            SkillFirst
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-purple-200 hover:text-white">
              Home
            </Link>
            <Link to="/about" className="text-purple-200 hover:text-white">
              About
            </Link>
            <Link to="/courses" className="text-purple-200 hover:text-white">
              Courses
            </Link>
            <Link to="/contact" className="text-purple-200 hover:text-white">
              Contact
            </Link>
          </div>

          {/* Right Auth */}
          <div className="hidden md:flex items-center">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-white text-purple-950 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition"
              >
                Login
              </Link>
            ) : (
              <div className="flex flex-col items-center">
                <Link
                  to={dashboardRoute}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-800 hover:bg-purple-700"
                >
                  <img src={profileImg} alt="profile" className="w-6 h-6" />
                </Link>
                <p className="text-white text-xs mt-1">{user?.name}</p>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-3">
            <Link onClick={() => setOpen(false)} to="/" className="block text-purple-200 hover:text-white">
              Home
            </Link>
            <Link onClick={() => setOpen(false)} to="/about" className="block text-purple-200 hover:text-white">
              About
            </Link>
            <Link onClick={() => setOpen(false)} to="/courses" className="block text-purple-200 hover:text-white">
              Courses
            </Link>
            <Link onClick={() => setOpen(false)} to="/contact" className="block text-purple-200 hover:text-white">
              Contact
            </Link>

            {!isAuthenticated ? (
              <Link
                onClick={() => setOpen(false)}
                to="/login"
                className="inline-block mt-2 bg-white text-purple-950 px-6 py-2 rounded-full font-semibold"
              >
                Login
              </Link>
            ) : (
              <Link
                onClick={() => setOpen(false)}
                to={dashboardRoute}
                className="block text-purple-200 hover:text-white"
              >
                Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
