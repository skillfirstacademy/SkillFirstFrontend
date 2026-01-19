import React, { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Award } from "lucide-react";

function EnglishLevels() {
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
      title: "Beginner Level — Basics",
      color: "emerald",
      duration: "4 Weeks",
      price: "$99",
      modules: [
        {
          id: "b1",
          title: "Introduction to English",
          topics: [
            "Why English is important today",
            "Common mistakes beginners make",
            "English sentence structure (Subject–Verb–Object)",
            "Understanding basic tenses"
          ]
        },
        {
          id: "b2",
          title: "Basic Grammar",
          topics: [
            "Parts of speech",
            "Articles (a, an, the)",
            "Singular & plural",
            "Pronouns",
            "Prepositions"
          ]
        },
        {
          id: "b3",
          title: "Vocabulary Building (Beginner)",
          topics: [
            "Daily-use words",
            "Synonyms & antonyms",
            "Common phrases",
            "Numbers, time, dates",
            "Greetings & introductions"
          ]
        },
        {
          id: "b4",
          title: "Basic Speaking Skills",
          topics: [
            "Pronunciation basics",
            "Correct sounds (vowels & consonants)",
            "Simple conversations",
            "Asking & answering questions"
          ]
        },
        {
          id: "b5",
          title: "Listening & Reading Basics",
          topics: [
            "Understanding spoken English",
            "Listening practice with audio",
            "Reading short stories",
            "Comprehension exercises"
          ]
        }
      ]
    },
    intermediate: {
      title: "Intermediate Level — Communication",
      color: "amber",
      duration: "5 Weeks",
      price: "$149",
      modules: [
        {
          id: "i1",
          title: "Intermediate Grammar",
          topics: [
            "Tenses (present, past, future)",
            "Active & passive voice",
            "Direct & indirect speech",
            "Modal verbs"
          ]
        },
        {
          id: "i2",
          title: "Sentence Formation",
          topics: [
            "Framing long sentences",
            "Question formation",
            "Negative sentences",
            "Conditional sentences"
          ]
        },
        {
          id: "i3",
          title: "Vocabulary Expansion",
          topics: [
            "Professional vocabulary",
            "Idioms & phrasal verbs",
            "Common expressions",
            "Word usage in context"
          ]
        },
        {
          id: "i4",
          title: "Speaking Fluency",
          topics: [
            "Daily conversation practice",
            "Role plays",
            "Group discussions",
            "Storytelling techniques"
          ]
        },
        {
          id: "i5",
          title: "Writing Skills",
          topics: [
            "Email writing",
            "Formal & informal writing",
            "Paragraph writing",
            "Resume basics"
          ]
        }
      ]
    },
    advanced: {
      title: "Advanced Level — Fluency & Confidence",
      color: "blue",
      duration: "6 Weeks",
      price: "$199",
      modules: [
        {
          id: "a1",
          title: "Advanced Grammar",
          topics: [
            "Complex sentence structures",
            "Error correction techniques",
            "Advanced verb usage",
            "Sentence transformation"
          ]
        },
        {
          id: "a2",
          title: "Public Speaking",
          topics: [
            "Confidence building",
            "Body language",
            "Speech structure",
            "Presentation skills"
          ]
        },
        {
          id: "a3",
          title: "Business English",
          topics: [
            "Office communication",
            "Meetings & negotiations",
            "Professional email writing",
            "Interview preparation"
          ]
        },
        {
          id: "a4",
          title: "Accent & Pronunciation",
          topics: [
            "Stress & intonation",
            "Neutral accent training",
            "Connected speech",
            "Pronunciation drills"
          ]
        },
        {
          id: "a5",
          title: "Listening & Comprehension (Advanced)",
          topics: [
            "Understanding fast speech",
            "News & podcast listening",
            "Note-taking techniques",
            "Critical listening"
          ]
        },
        {
          id: "a6",
          title: "Exam Preparation (Optional)",
          topics: [
            "IELTS basics",
            "TOEFL overview",
            "Common exam strategies",
            "Speaking & writing tasks"
          ]
        },
        {
          id: "a7",
          title: "Fluency Mastery & Confidence",
          topics: [
            "Thinking in English",
            "Speaking without hesitation",
            "Real-life conversations",
            "Confidence-building exercises"
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
              Beginner Level — Basics
            </button>
            <button
              onClick={() => setActiveLevel("intermediate")}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-base ${
                activeLevel === "intermediate"
                  ? "bg-amber-100 text-amber-900 shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Intermediate Level — Communication
            </button>
            <button
              onClick={() => setActiveLevel("advanced")}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 text-base ${
                activeLevel === "advanced"
                  ? "bg-blue-100 text-blue-900 shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Advanced Level — Fluency & Confidence
            </button>
          </div>
        </div>

        {/* Level Title */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-purple-900">{currentLevel.title}</h3>
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

export default EnglishLevels;