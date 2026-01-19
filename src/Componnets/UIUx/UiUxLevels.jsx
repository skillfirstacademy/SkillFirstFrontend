import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Award } from "lucide-react";

function UiUxLevels() {
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
      title: " Beginner Level — Foundations of UI/UX",
      color: "emerald",
      duration: "4 Weeks",
      price: "$99",
      modules: [
        {
          id: "b1",
          title: "Introduction to UI/UX",
          topics: [
            "What is UI design?",
            "What is UX design?",
            "UI vs UX vs Product Design",
            "UX design process overview",
            "Tools you'll use: Figma, Adobe XD, FigJam"
          ]
        },
        {
          id: "b2",
          title: "Design Basics",
          topics: [
            "Principles of good design",
            "Layout, spacing, grids",
            "Visual hierarchy",
            "Color basics",
            "Typography basics"
          ]
        },
        {
          id: "b3",
          title: "Understanding Users (UX Research)",
          topics: [
            "What is user research?",
            "User personas",
            "Empathy mapping",
            "Competitive analysis",
            "Finding user pain points"
          ]
        },
        {
          id: "b4",
          title: "UX Flows & Journey Mapping",
          topics: [
            "User journey mapping",
            "Task analysis",
            "Creating user flow diagrams",
            "Identifying friction points"
          ]
        },
        {
          id: "b5",
          title: "Wireframing Basics",
          topics: [
            "Low-fidelity vs high-fidelity",
            "Sketching UI",
            "Wireframing tools in Figma",
            "Creating simple app screens"
          ]
        }
      ]
    },
    intermediate: {
      title: " Intermediate Level — UI Design Skills",
      color: "amber",
      duration: "5 Weeks",
      price: "$149",
      modules: [
        {
          id: "i1",
          title: "UI Design Foundations",
          topics: [
            "Creating clean, modern UI",
            "Understanding spacing & padding",
            "Iconography",
            "Shadows, borders, shapes",
            "Creating card-based layouts"
          ]
        },
        {
          id: "i2",
          title: "Figma Essentials",
          topics: [
            "Frames & layouts",
            "Auto-layout mastery",
            "Components & variants",
            "Constraints & responsive design",
            "Design tokens"
          ]
        },
        {
          id: "i3",
          title: "Prototyping",
          topics: [
            "Interactive prototypes",
            "Clickable buttons",
            "Page transitions",
            "Flow simulation",
            "Usability best practices"
          ]
        },
        {
          id: "i4",
          title: "Mobile & Web Design",
          topics: [
            "Mobile-first design",
            "Breakpoints",
            "Navigation patterns",
            "Form design",
            "Dashboard layout",
            "Landing page design"
          ]
        },
        {
          id: "i5",
          title: "Accessibility & UI Standards",
          topics: [
            "Color contrast",
            "Readability standards",
            "Accessible components",
            "Tab navigation",
            "Screen-reader-friendly structure"
          ]
        }
      ]
    },
    advanced: {
      title: " Advanced Level — Professional / Job-Ready",
      color: "blue",
      duration: "6 Weeks",
      price: "$199",
      modules: [
        {
          id: "a1",
          title: "User Testing & Improvements",
          topics: [
            "Conducting usability testing",
            "A/B testing",
            "Gathering feedback",
            "Refining screens",
            "Iterative improvements"
          ]
        },
        {
          id: "a2",
          title: "Design Systems",
          topics: [
            "What is a design system?",
            "Buttons, forms, modals, cards",
            "Component libraries",
            "Atomic design methodology",
            "Brand style guide creation"
          ]
        },
        {
          id: "a3",
          title: "Interaction Design (Advanced UI)",
          topics: [
            "Motion principles",
            "Micro-interactions",
            "Hover effects",
            "Smooth animations",
            "Advanced prototyping"
          ]
        },
        {
          id: "a4",
          title: "Portfolio Projects",
          topics: [
            "A complete mobile app",
            "A full web dashboard",
            "A landing page",
            "Case study documentation"
          ],
          note: "You will design complete projects for your portfolio"
        },
        {
          id: "a5",
          title: "Creating UX Case Studies",
          topics: [
            "Problem + Solution framing",
            "Designing flows visually",
            "Showing before/after",
            "Presenting insights",
            "Building Behance/Dribbble portfolio"
          ]
        },
        {
          id: "a6",
          title: "Career / Freelancing",
          topics: [
            "How to become a UI/UX freelancer",
            "How to charge clients",
            "How to structure project files",
            "Real interview questions",
            "Whiteboard challenge tips"
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
              Beginner Level — Foundations of UI/UX
            </button>
            <button
              onClick={() => setActiveLevel("intermediate")}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-base ${
                activeLevel === "intermediate"
                  ? "bg-amber-100 text-amber-900 shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Intermediate Level — UI Design Skills
            </button>
            <button
              onClick={() => setActiveLevel("advanced")}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-base ${
                activeLevel === "advanced"
                  ? "bg-blue-100 text-blue-900 shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Advanced Level — Professional / Job-Ready
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

export default UiUxLevels;