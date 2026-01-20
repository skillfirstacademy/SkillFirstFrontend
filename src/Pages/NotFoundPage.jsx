// pages/NotFound.jsx  (or 404.jsx)
import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center px-6 md:px-12 lg:px-20 py-16 overflow-hidden">
      {/* Subtle grid background - same as course pages */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, #a855f7 1px, transparent 1px),
                linear-gradient(to bottom, #a855f7 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
      </div>

      {/* Main 404 Content */}
      <div className="relative text-center max-w-3xl mx-auto z-10">
        <div className="mb-8">
          <h1 className="text-5xl md:text-9xl lg:text-[8rem] font-extrabold text-purple-900 tracking-tighter leading-none">
            404
          </h1>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-3xl font-bold text-purple-800 mb-6">
          Page Not Found
        </h2>

        <p className="text-lg md:text-lg text-purple-700 mb-10 max-w-2xl mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Don't
          worry — let's get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link
            to="/"
            className="inline-block bg-purple-700 text-white font-bold text-lg px-10 py-4 rounded-xl hover:bg-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
