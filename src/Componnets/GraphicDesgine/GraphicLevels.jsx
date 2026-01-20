import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Award, Clock } from "lucide-react";

function GraphicLevels() {
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
      title: "Beginner Level — Foundation",
      color: "emerald",
      duration: "4 Weeks",
      price: "$99",
      modules: [
        {
          id: "b1",
          title: "Introduction to Graphic Design",
          topics: [
            "What is Graphic Design?",
            "Types of designers (Branding, UI, Print, Motion, etc.)",
            "Understanding visual communication",
            "What tools you will learn"
          ]
        },
        {
          id: "b2",
          title: "Design Principles",
          topics: [
            "Alignment",
            "Proximity",
            "Contrast",
            "Balance",
            "White space",
            "Hierarchy"
          ],
          note: "These are the backbone of ALL designs"
        },
        {
          id: "b3",
          title: "Color Theory (Beginner)",
          topics: [
            "Primary / Secondary colors",
            "Color harmony",
            "Warm vs cool colors",
            "How to choose color palettes",
            "Contrast for readability"
          ]
        },
        {
          id: "b4",
          title: "Typography Basics",
          topics: [
            "Serif vs sans-serif",
            "Font pairings",
            "Readability rules",
            "Line height, kerning, spacing",
            "When to use bold/regular"
          ]
        },
        {
          id: "b5",
          title: "Adobe Photoshop Basics",
          topics: [
            "Interface overview",
            "Layers, masking, selection tools",
            "Image editing",
            "Retouching basics",
            "Export formats"
          ]
        },
        {
          id: "b6",
          title: "Adobe Illustrator Basics",
          topics: [
            "Artboard setup",
            "Shapes, strokes, fills",
            "Working with vector tools",
            "Understanding paths and anchor points",
            "Basic logo creation"
          ]
        }
      ]
    },
    intermediate: {
      title: "Intermediate Level — Real Projects",
      color: "amber",
      duration: "5 Weeks",
      price: "$149",
      modules: [
        {
          id: "i1",
          title: "Branding & Logo Design",
          topics: [
            "Moodboard creation",
            "Logo concepts",
            "Typography for logos",
            "Shapes, geometry & logo grids",
            "Creating a brand identity system"
          ]
        },
        {
          id: "i2",
          title: "Social Media Creative Design",
          topics: [
            "Instagram post/banners",
            "Thumbnail design",
            "Poster & marketing visuals",
            "Color styling for brands",
            "Creating consistent design styles"
          ]
        },
        {
          id: "i3",
          title: "UI Elements (without going full UI/UX)",
          topics: [
            "Buttons",
            "Cards",
            "Icons",
            "Simple website layouts",
            "Design consistency"
          ]
        },
        {
          id: "i4",
          title: "Adobe Illustrator Advanced",
          topics: [
            "Pen tool mastery",
            "Gradients & mesh tool",
            "Vector illustration",
            "Creating professional brand assets"
          ]
        },
        {
          id: "i5",
          title: "Adobe Photoshop Intermediate",
          topics: [
            "Complex selections",
            "Image manipulation",
            "Blending modes",
            "Product mockups",
            "Filters & effects"
          ]
        }
      ]
    },
    advanced: {
      title: " Advanced Level — Professional Designer Path",
      color: "blue",
      duration: "6 Weeks",
      price: "$199",
      modules: [
        {
          id: "a1",
          title: "Complete Branding Project",
          topics: [
            "Logo",
            "Color palette",
            "Typography rules",
            "Brand guidelines",
            "Mockups (business card, flyer, poster)"
          ],
          note: "You create a complete brand identity"
        },
        {
          id: "a2",
          title: "Poster & Advertisement Design",
          topics: [
            "Professional poster layout",
            "Visual hierarchy advanced techniques",
            "Consistent grids",
            "Ad design for brands"
          ]
        },
        {
          id: "a3",
          title: "Magazine / Brochure Design",
          topics: [
            "Page layout principles",
            "Columns & grids",
            "Cover design",
            "Exporting for print"
          ]
        },
        {
          id: "a4",
          title: "Portfolio Development",
          topics: [
            "Creating Behance case studies",
            "Before/After presentations",
            "Organizing projects",
            "How to pitch your design work"
          ]
        },
        {
          id: "a5",
          title: "Freelancing & Job Preparation",
          topics: [
            "How to get clients",
            "How to charge",
            "Creating invoices",
            "Interview-ready design portfolio",
            "Real-world design workflows"
          ]
        }
      ]
    }
  };

  const currentLevel = levels[activeLevel];

  return (
    <section className=" px-6 md:px-12 lg:px-20 py-16">
      {/* Level Tabs */}
      <div className="">
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
              Beginner Level — Foundation
            </button>
            <button
              onClick={() => setActiveLevel("intermediate")}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-base ${
                activeLevel === "intermediate"
                  ? "bg-amber-100 text-amber-900 shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Intermediate Level — Real Projects
            </button>
            <button
              onClick={() => setActiveLevel("advanced")}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-base ${
                activeLevel === "advanced"
                  ? "bg-blue-100 text-blue-900 shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Advanced Level — Professional Designer Path
            </button>
          </div>
        </div>

        {/* Level Title
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-purple-900">{currentLevel.title}</h3>
        </div> */}

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

export default GraphicLevels;