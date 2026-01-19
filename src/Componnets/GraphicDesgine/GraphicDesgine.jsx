import React from "react";
import GraphicLevels from "../GraphicDesgine/GraphicLevels";

function GraphicDesign() {
  return (
    <>
      <section className="relative bg-white px-6 md:px-12 lg:px-20 py-12 lg:py-16 overflow-hidden">
  {/* ↑ reduced vertical padding a lot: from py-20 lg:py-32 → py-12 lg:py-16 */}

  {/* Visible square grid background – keep or make even lighter */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0 opacity-[0.20]">           {/* ← lowered from 0.1 to 0.08 */}
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, #8400ff 1px, transparent 1px),
            linear-gradient(to bottom, #8400ff 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",                            // ← slightly larger squares = less dense
        }}
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/70 to-white" /> {/* stronger fade */}
  </div>

  {/* Main Content */}
  <div className="relative max-w-5xl mx-auto text-center">
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-purple-900 tracking-tight leading-tight mb-6">
      Graphic Design Masterclass
    </h1>
    {/* ↑ reduced sizes: lg:text-7xl → lg:text-5xl, mb-8 → mb-6 */}

    <p className="text-base sm:text-lg md:text-xl text-purple-700 font-medium max-w-4xl mx-auto leading-relaxed mb-10">
      Learn Photoshop, Illustrator, branding, creative composition, and everything you need to become a professional graphic designer.
    </p>
    {/* ↑ reduced text size + margins: mb-16 → mb-10 */}

    {/* Three Level Cards – more compact */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
      {/* Beginner */}
      <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-md hover:shadow-xl hover:border-purple-400 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px]">
        <h3 className="text-3xl md:text-4xl font-bold text-purple-600 mb-3">Beginner</h3>
        <p className="text-purple-700 font-medium text-center text-sm md:text-base px-2">
          Perfect for those starting from zero — no prior experience needed
        </p>
      </div>

      {/* Intermediate */}
      <div className="bg-white border-2 border-purple-400 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:border-purple-600 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px] relative">
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm">
          Recommended
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-purple-700 mb-3">Intermediate</h3>
        <p className="text-purple-700 font-medium text-center text-sm md:text-base px-2">
          Build on basic skills — create professional-looking designs
        </p>
      </div>

      {/* Advanced */}
      <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-md hover:shadow-xl hover:border-purple-400 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px]">
        <h3 className="text-3xl md:text-4xl font-bold text-purple-800 mb-3">Advanced</h3>
        <p className="text-purple-700 font-medium text-center text-sm md:text-base px-2">
          Master complex techniques, branding systems & client-ready work
        </p>
      </div>
    </div>
    {/* ↑ reduced: p-8 → p-6, min-h-[260px] → min-h-[180px], gap-6 lg:gap-8 → gap-5 lg:gap-6 */}
  </div>
</section>
      <GraphicLevels />
    </>
  );
}

export default GraphicDesign;
