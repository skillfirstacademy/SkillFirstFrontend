import React from "react";

function English() {
  return (
    <section className="min-h-screen bg-white px-6 md:px-12 lg:px-20 py-16">
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900">
          English Learning Mastery
        </h1>
        <p className="text-lg md:text-xl text-purple-700 mt-4 max-w-2xl mx-auto">
          Improve your grammar, vocabulary, communication, and fluency with our beginner-to-advanced English learning course.
        </p>
      </div>

      {/* Course Overview */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Side: What You Will Learn */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-purple-800">What You Will Learn</h2>

          <ul className="space-y-4 text-purple-700 font-medium">
            <li className="flex gap-3">
              <span className="text-purple-900 text-xl">•</span>
              Improve your English speaking fluency
            </li>
            <li className="flex gap-3">
              <span className="text-purple-900 text-xl">•</span>
              Master essential grammar rules with ease
            </li>
            <li className="flex gap-3">
              <span className="text-purple-900 text-xl">•</span>
              Build strong vocabulary for daily conversation
            </li>
            <li className="flex gap-3">
              <span className="text-purple-900 text-xl">•</span>
              Learn accent polishing and pronunciation tips
            </li>
            <li className="flex gap-3">
              <span className="text-purple-900 text-xl">•</span>
              Practice with real-world speaking examples
            </li>
          </ul>
        </div>

        {/* Right Side: Course Image */}
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://www.shutterstock.com/image-photo/asian-girl-student-online-learning-class-260nw-2294649035.jpg"
            alt="English Learning"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Modules Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-10">
          Course Modules
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Module Cards */}
          {[
            "Basics of English Grammar",
            "Vocabulary Development",
            "Sentence Formation",
            "Daily Conversation Practice",
            "Pronunciation & Accent",
            "Speaking Confidence Training"
          ].map((module, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl shadow-xl bg-purple-50 border border-purple-200 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-purple-800">{module}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <a
          href="#"
          className="inline-block bg-purple-700 text-white text-lg font-bold px-10 py-4 rounded-xl hover:bg-purple-800 transition-all duration-300 shadow-lg"
        >
          Start English Course
        </a>
      </div>
    </section>
  );
}

export default English;
