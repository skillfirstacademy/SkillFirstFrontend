import React from "react";

function VideoEditing() {
  return (
    <section className="min-h-screen bg-white px-6 md:px-12 lg:px-20 py-16">
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900">
          Video Editing Complete Course
        </h1>
        <p className="text-lg md:text-xl text-purple-700 mt-4 max-w-2xl mx-auto">
          Learn professional video editing using Premiere Pro, After Effects, audio mixing, transitions, and storytelling techniques.
        </p>
      </div>

      {/* Overview */}
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-purple-800">What You Will Learn</h2>

          <ul className="space-y-4 text-purple-700 font-medium">
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Video editing basics & timeline control</li>
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Transitions, cuts & effects</li>
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Color grading & correction</li>
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Sound design & audio mixing</li>
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Exporting high-quality videos</li>
          </ul>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://www.shutterstock.com/shutterstock/photos/1490541647/display_1500/stock-photo-web-development-coding-and-programming-responsive-layout-internet-site-or-app-of-devices-creation-1490541647.jpg"
            alt="Video Editing"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Modules */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-10">
          Course Modules
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "Premiere Pro Basics",
            "After Effects Fundamentals",
            "Transitions & Smooth Cuts",
            "Audio Cleanup & Mixing",
            "Color Grading Techniques",
            "Final Editing Project",
          ].map((module, i) => (
            <div key={i} className="p-6 rounded-2xl bg-purple-50 border border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-bold text-purple-800">{module}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <a className="inline-block bg-purple-700 text-white text-lg font-bold px-10 py-4 rounded-xl hover:bg-purple-800 transition-all duration-300 shadow-lg">
          Start Video Editing Course
        </a>
      </div>
    </section>
  );
}

export default VideoEditing;
