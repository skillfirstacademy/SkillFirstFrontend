import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Award } from "lucide-react";

function VideoEditingLevels() {
  const [activeLevel, setActiveLevel] = useState("beginner");
  const [expandedModules, setExpandedModules] = useState(new Set());

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const levels = {
    beginner: {
      title: "Beginner Level — Foundations",
      color: "emerald",
      duration: "4 Weeks",
      price: "$99",
      modules: [
        {
          id: "b1",
          title: "Introduction to Video Editing",
          topics: [
            "What is video editing?",
            "Types of editing styles (cinematic, vlog, commercial, etc.)",
            "Understanding the workflow",
            "Required tools (Premiere Pro / DaVinci Resolve / Final Cut)"
          ]
        },
        {
          id: "b2",
          title: "Video Editing Software Basics",
          topics: [
            "Timeline navigation",
            "Importing media",
            "Shortcuts every editor must know",
            "Layers & tracks",
            "Project organization"
          ],
          note: "Project organization is VERY important"
        },
        {
          id: "b3",
          title: "Cutting & Trimming Essentials",
          topics: [
            "Razor tool",
            "Ripple, roll, slip edits",
            "Smooth jump cuts",
            "Cutting to the beat of music"
          ]
        },
        {
          id: "b4",
          title: "Basic Transitions",
          topics: [
            "Fade in/out",
            "Cross dissolve",
            "Motion cut basics",
            "L-cut / J-cut (pro technique)"
          ]
        },
        {
          id: "b5",
          title: "Audio Essentials",
          topics: [
            "Basic audio cleanup",
            "Volume leveling",
            "Noise reduction",
            "Syncing audio with video"
          ]
        }
      ]
    },
    intermediate: {
      title: "Intermediate Level — Professional Editing",
      color: "amber",
      duration: "5 Weeks",
      price: "$149",
      modules: [
        {
          id: "i1",
          title: "Adding Effects",
          topics: [
            "Motion effects (scale, position, rotation)",
            "Text animations",
            "Lower thirds templates",
            "Green screen removal (chroma key)"
          ]
        },
        {
          id: "i2",
          title: "Color Correction",
          topics: [
            "Exposure, contrast, highlights, shadows",
            "White balance",
            "Fixing bad lighting",
            "LUT basics (Look Up Tables)"
          ]
        },
        {
          id: "i3",
          title: "Color Grading (Cinematic Look)",
          topics: [
            "Creative color grading",
            "Teal & orange look",
            "Creating custom LUTs",
            "Matching shots with each other"
          ]
        },
        {
          id: "i4",
          title: "Speed Ramp & Cinematic Motion",
          topics: [
            "Slow motion",
            "Speed ramps",
            "Timelapse creation",
            "Smooth motion transitions"
          ]
        },
        {
          id: "i5",
          title: "Advanced Audio Editing",
          topics: [
            "Equalizer (EQ)",
            "Audio transitions",
            "Background music fitting",
            "Voice clarity enhancement"
          ]
        }
      ]
    },
    advanced: {
      title: "Advanced Level — Real Projects",
      color: "blue",
      duration: "6 Weeks",
      price: "$199",
      modules: [
        {
          id: "a1",
          title: "Editing Short Films",
          topics: [
            "Story structure",
            "Scene transitions",
            "Mood building through sound",
            "Emotional rhythm control"
          ]
        },
        {
          id: "a2",
          title: "Editing YouTube Content",
          topics: [
            "Vlog editing",
            "Fast-paced cuts",
            "Meme-style pop-ups",
            "Jump-cut humor",
            "Sound effects timing"
          ]
        },
        {
          id: "a3",
          title: "Editing Commercial Ads",
          topics: [
            "Product shots",
            "High-energy transitions",
            "Motion graphics basics",
            "Text overlays",
            "Cinematic sound design"
          ]
        },
        {
          id: "a4",
          title: "Editing Reels/Shorts",
          topics: [
            "Vertical video editing",
            "Fast cuts for attention",
            "Hook creation",
            "Subtitle styles",
            "High-retention video structure"
          ]
        },
        {
          id: "a5",
          title: "Advanced Effects & Compositing",
          topics: [
            "Motion tracking",
            "Masking",
            "Object removal",
            "Multi-layer composition",
            "Basic After Effects workflows"
          ]
        },
        {
          id: "a6",
          title: "Exporting Like a Pro",
          topics: [
            "Best YouTube settings",
            "Instagram & reel export",
            "Commercial video quality settings",
            "Understanding bitrate, resolution, codecs"
          ]
        },
        {
          id: "a7",
          title: "Portfolio & Freelancing",
          topics: [
            "How to create a video editing showreel",
            "Best industries to target",
            "Client communication",
            "Pricing your work",
            "Delivering professional files"
          ]
        }
      ]
    }
  };

  const currentLevel = levels[activeLevel];

  return (
    <section className="px-6 md:px-12 lg:px-20 py-16">
      {/* Level Tabs */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-8">
          Course Curriculum
        </h2>
        
        {/* Horizontal Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-xl shadow-lg p-2 gap-2">
            <button
              onClick={() => setActiveLevel("beginner")}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-base ${
                activeLevel === "beginner"
                  ? "bg-emerald-100 text-emerald-900 shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Beginner Level — Foundations
            </button>
            <button
              onClick={() => setActiveLevel("intermediate")}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-base ${
                activeLevel === "intermediate"
                  ? "bg-amber-100 text-amber-900 shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Intermediate Level — Professional Editing
            </button>
            <button
              onClick={() => setActiveLevel("advanced")}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-base ${
                activeLevel === "advanced"
                  ? "bg-blue-100 text-blue-900 shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Advanced Level — Real Projects
            </button>
          </div>
        </div>

        

        {/* Modules Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {currentLevel.modules.map((module, index) => {
            const isExpanded = expandedModules.has(module.id);
            return (
              <div
                key={module.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100"
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-purple-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-purple-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h4 className="text-lg font-semibold text-purple-900 text-left">
                      {module.title}
                    </h4>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  )}
                </button>

                {/* Module Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 bg-purple-50/50">
                    <ul className="space-y-3">
                      {module.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0"></span>
                          <span className="text-gray-700">{topic}</span>
                        </li>
                      ))}
                    </ul>
                    {module.note && (
                      <div className="mt-4 p-3 bg-purple-100 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-900 italic">
                          💡 {module.note}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Enroll & Start Course Buttons for Current Level */}
        <div className="text-center mt-10">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 bg-purple-700 text-white text-lg font-bold px-10 py-4 rounded-xl hover:bg-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              <span>Enroll in {activeLevel.charAt(0).toUpperCase() + activeLevel.slice(1)} Level - {currentLevel.price}</span>
              <Award className="w-5 h-5" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 bg-white border-2 border-purple-700 text-purple-700 text-lg font-bold px-10 py-4 rounded-xl hover:bg-purple-50 transition-all duration-300">
              <span>Start Course</span>
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
         
        </div>
      </div>

    
    </section>
  );
}

export default VideoEditingLevels;