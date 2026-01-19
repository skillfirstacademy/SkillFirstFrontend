import React from "react";
import EnglishLevels from "./EnglishLevels";

function English() {
  return (

    <>
    <section className="relative bg-white px-6 md:px-12 lg:px-20 py-12 lg:py-16 overflow-hidden">
      {/* Visible square grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.20]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, #8400ff 1px, transparent 1px),
                linear-gradient(to bottom, #8400ff 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-white" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-purple-900 tracking-tight leading-tight mb-6">
          English Learning Mastery
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-purple-700 font-medium max-w-4xl mx-auto leading-relaxed mb-10">
          Improve your grammar, vocabulary, communication, and fluency with our beginner-to-advanced English learning course.
        </p>

       

        {/* Level Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto mb-10">
          {/* Beginner */}
          
          <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-md hover:shadow-xl hover:border-purple-400 transition-all duration-300 flex flex-col items-center justify-center min-h-[160px]">
            <h3 className="text-3xl md:text-4xl font-bold text-purple-600 mb-3">Beginner</h3>
            <p className="text-purple-700 font-medium text-center text-sm md:text-base px-2">
              Start from basics — perfect if you're new to English
            </p>
          </div>

          {/* Intermediate */}
          <div className="bg-white border-2 border-purple-400 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:border-purple-600 transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm">
              Recommended
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-purple-700 mb-3">Intermediate</h3>
            <p className="text-purple-700 font-medium text-center text-sm md:text-base px-2">
              Improve fluency & confidence in everyday conversations
            </p>
          </div>

          {/* Advanced */}
          <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-md hover:shadow-xl hover:border-purple-400 transition-all duration-300 flex flex-col items-center justify-center min-h-[160px]">
            <h3 className="text-3xl md:text-4xl font-bold text-purple-800 mb-3">Advanced</h3>
            <p className="text-purple-700 font-medium text-center text-sm md:text-base px-2">
              Master professional English, idioms & advanced communication
            </p>
          </div>
        </div>

       
      </div>
    </section>
    <EnglishLevels/>
    </>


  );
}

export default English;