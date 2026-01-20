import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "../assets/Logo.png";
import profileImg from "../assets/icons8-account-100.png"

function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ ROLE BASED DASHBOARD ROUTE
  const dashboardRoute =
    user?.role === "admin" || user?.role === "superadmin"
      ? "/admin/dashboard"
      : "/student/dashboard";
  return (
    <nav className="bg-purple-950 border-b border-purple-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
            {/* <img src={Logo} alt="SkillFirst Logo" className="h-9 w-auto" /> */}
            <span className="text-xl md:text-2xl font-bold text-white">SkillFirst</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-purple-200 hover:text-white transition">
              Home
            </Link>
            <Link to="/about" className="text-purple-200 hover:text-white transition">
              About
            </Link>
            <Link to="/courses" className="text-purple-200 hover:text-white transition">
              Courses
            </Link>
          </div>

          {/* Right Side Auth */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="
                bg-white 
                text-purple-950 
                font-semibold 
                px-6 py-2 
                rounded-full 
                hover:bg-purple-100 
                transition
                shadow-md
                hover:shadow-lg
              "
            >
              Login
            </Link>
          ) : (
            <div className="flex flex-col items-center">
            <Link
              to={dashboardRoute}
              className="
                w-10 h-10 
                flex items-center justify-center 
                rounded-full 
                bg-purple-800 
                text-white 
                hover:bg-purple-700 
                transition
              "
              title="Account"
            >
              {/* Account Icon */}
              <img src={profileImg} alt="profile"/>
            </Link>
            <p className="text-white">{user?.name}</p>
            </div>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
