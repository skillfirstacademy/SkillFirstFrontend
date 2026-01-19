import React from "react";

function UiUx() {
  return (
    <section className="min-h-screen bg-white px-6 md:px-12 lg:px-20 py-16">
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900">
          UI/UX Design Bootcamp
        </h1>
        <p className="text-lg md:text-xl text-purple-700 mt-4 max-w-2xl mx-auto">
          Learn wireframing, prototyping, user research, accessibility, and Figma workflows to become a modern product designer.
        </p>
      </div>

      {/* Overview */}
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-purple-800">What You Will Learn</h2>

          <ul className="space-y-4 text-purple-700 font-medium">
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Figma UI Design from scratch</li>
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>User flows & wireframing</li>
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Interactive prototypes</li>
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Typography, spacing & components</li>
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Design systems & case studies</li>
          </ul>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://cdn-images.visual-paradigm.com/features/v15/ux-design-and-wireframe-tools/ux-design-storyboard.png"
            alt="UI UX Design"
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
            "Figma Essentials",
            "User Flow Mapping",
            "Wireframe Creation",
            "Interactive Prototyping",
            "Color & Typography",
            "Final Case Study Portfolio",
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
          Start UI/UX Course
        </a>
      </div>
    </section>
  );
}

export default UiUx;
