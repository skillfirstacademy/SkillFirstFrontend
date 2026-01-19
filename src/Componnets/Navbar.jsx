// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';   // ← Add this import
import Logo from '../assets/Logo.png';

function Navbar() {
  return (
    <nav className="bg-purple-950 border-b border-purple-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <img src={Logo} alt="SkillFirst Logo" className="h-9 w-auto" />
            <span className="text-xl md:text-2xl font-bold text-white">SkillFirst</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-purple-200 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-purple-200 hover:text-white transition-colors duration-200"
            >
              About
            </Link>
            <Link 
              to="/courses" 
              className="text-purple-200 hover:text-white transition-colors duration-200"
            >
              Courses
            </Link>
          </div>

          {/* Login Button - now links to /login */}
          <Link
            // to="/signup"
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
              active:scale-98
            "
          >
            Login
          </Link>

          {/* Mobile menu button (placeholder for now) */}
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