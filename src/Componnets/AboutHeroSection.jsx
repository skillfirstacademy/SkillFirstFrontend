import React from 'react'
import { Users, Award } from 'lucide-react'

function AboutHeroSection() {
  return (
    <section className="relative min-h-[60vh] bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center overflow-hidden px-6 md:px-12 lg:px-16 xl:px-24 py-20">
      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Content */}
        <div className="text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-300 rounded-full px-5 py-2">
            <Award className="w-4 h-4 text-purple-700" />
            <span className="text-sm font-semibold text-purple-900">About SkillFirst</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-purple-900 leading-tight">
            Empowering Learners
            <span className="block mt-2 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 bg-clip-text text-transparent">
              Around The World
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make quality education accessible to everyone. With expert instructors, 
            cutting-edge curriculum, and AI-powered learning tools, we help students achieve their goals.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 lg:gap-16 pt-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-6 h-6 text-purple-700" />
                <div className="text-3xl lg:text-4xl font-bold text-purple-900">10K+</div>
              </div>
              <div className="text-purple-600 font-medium">Active Students</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-6 h-6 text-purple-700" />
                <div className="text-3xl lg:text-4xl font-bold text-purple-900">98%</div>
              </div>
              <div className="text-purple-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-purple-300 rounded-full opacity-20 animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-32 right-16 w-12 h-12 bg-purple-400 rounded-full opacity-30 animate-float pointer-events-none"></div>
    </section>
  )
}

export default AboutHeroSection