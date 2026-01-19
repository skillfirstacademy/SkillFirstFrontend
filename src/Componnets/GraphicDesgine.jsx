import React from "react";

function GraphicDesign() {
  return (
    <section className="min-h-screen bg-white px-6 md:px-12 lg:px-20 py-16">
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900">
          Graphic Design Masterclass
        </h1>
        <p className="text-lg md:text-xl text-purple-700 mt-4 max-w-2xl mx-auto">
          Learn Photoshop, Illustrator, branding, creative composition, and everything you need to become a professional graphic designer.
        </p>
      </div>

      {/* Overview */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-purple-800">What You Will Learn</h2>

          <ul className="space-y-4 text-purple-700 font-medium">
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Master Adobe Photoshop & Illustrator</li>
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Learn poster, banner, and social media design</li>
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Branding & logo design fundamentals</li>
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Color theory & modern design principles</li>
            <li className="flex gap-3"><span className="text-purple-900 text-xl">•</span>Practical real-world design projects</li>
          </ul>
        </div>

        {/* Right */}
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://thumbs.dreamstime.com/b/creative-designer-s-workspace-ai-generated-image-vibrant-graphic-design-computer-monitor-colorful-pencils-plants-378722532.jpg"
            alt="Graphic Design"
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
            "Adobe Photoshop Basics",
            "Illustrator Advanced Tools",
            "Logo & Branding Design",
            "Poster & Banner Composition",
            "Social Media Ad Design",
            "Portfolio Design Projects",
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
          Start Graphic Design Course
        </a>
      </div>
    </section>
  );
}

export default GraphicDesign;
