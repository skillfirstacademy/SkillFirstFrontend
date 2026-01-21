// HeroSection.jsx
import React from 'react';
import Englishtow from "../assets/English.jpg"

function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center overflow-hidden px-6 md:px-12 lg:px-16 xl:px-24 py-20">
      <div className="max-w-7xl w-full">
        
        {/* Main Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE - Text Content */}
          <div className="lg:col-span-5 text-left space-y-6 z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-300 rounded-full px-5 py-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-purple-800">AI-Powered Learning Platform</span>
            </div>

            <h1 className="text-4xl sm:text-4xl lg:text-5xl font-black text-purple-900 leading-[1.1] tracking-tight">
              Your Next Level of
              <span className="block mt-2 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-900 bg-clip-text text-transparent">
                Learning Starts Here
              </span>
            </h1>

            <p className="text-base sm:text-lg text-purple-700 leading-relaxed max-w-lg font-normal">
              SkillFirst brings you expert-crafted courses and AI-powered learning materials designed to accelerate your growth.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="/join"
                className="group inline-flex items-center justify-center bg-purple-700 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-2xl hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 shadow-xl shadow-purple-400/30 hover:shadow-2xl hover:shadow-purple-400/40 hover:-translate-y-1"
              >
                Join the Class
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>

              <a
                href="/courses"
                className="inline-flex items-center justify-center bg-white border-2 border-purple-700 text-purple-700 font-bold text-sm sm:text-base px-6 py-3 rounded-2xl hover:bg-purple-50 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 hover:-translate-y-1"
              >
                Explore More
              </a>
            </div>

            {/* Stats Section - Horizontal */}
            <div className="flex items-center gap-8 pt-6 border-t border-purple-200">
              <div>
                <div className="text-3xl lg:text-4xl font-black text-purple-900">10K+</div>
                <div className="text-purple-600 font-medium mt-1 text-sm">Active Students</div>
              </div>

              <div className="w-px h-12 bg-purple-200"></div>

              <div>
                <div className="text-3xl lg:text-4xl font-black text-purple-900">5+</div>
                <div className="text-purple-600 font-medium mt-1 text-sm">Years Experience</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Stacked Card Layout */}
          <div className="lg:col-span-7 relative">
            <div className="relative w-full max-w-xl mx-auto lg:ml-auto">
              
              {/* Background Gradient Blob */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full blur-3xl opacity-30 animate-morph"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-purple-400 to-purple-600 rounded-full blur-3xl opacity-20 animate-morph" style={{animationDelay: '3s'}}></div>

              {/* Main Card Stack */}
              <div className="relative space-y-4">
                
                {/* Top Row - Large Featured Card */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-100 transform transition-all duration-500 hover:scale-[1.02] hover:-rotate-1">
                    <div className="aspect-[16/9] relative">
                      <img
                        src="https://thumbs.dreamstime.com/b/creative-designer-s-workspace-ai-generated-image-vibrant-graphic-design-computer-monitor-colorful-pencils-plants-378722532.jpg"
                        alt="Graphic Design Workspace"
                        className="w-full h-full object-cover"
                      />
                     
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="inline-block bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                          FEATURED
                        </div>
                        <h3 className="text-white text-xl font-bold">Graphic Design Mastery</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row - Three Cards */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  
                  {/* Card 1 */}
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-purple-100 transform transition-all duration-500 hover:scale-105 hover:rotate-2">
                      <div className="aspect-square relative">
                        <img
                          src="https://www.shutterstock.com/shutterstock/photos/1490541647/display_1500/stock-photo-web-development-coding-and-programming-responsive-layout-internet-site-or-app-of-devices-creation-1490541647.jpg"
                          alt="Web Design"
                          className="w-full h-full object-cover"
                        />
                       
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <h4 className="text-white text-xs font-bold">Web Dev</h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-purple-100 transform transition-all duration-500 hover:scale-105 hover:-rotate-2">
                      <div className="aspect-square relative">
                        <img
                          src="https://www.shutterstock.com/image-photo/asian-girl-student-online-learning-class-260nw-2294649035.jpg"
                          alt="English Learning"
                          className="w-full h-full object-cover"
                        />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <h4 className="text-white text-xs font-bold">English</h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-purple-100 transform transition-all duration-500 hover:scale-105 hover:rotate-2">
                      <div className="aspect-square relative">
                        <img
                          src="https://cdn-images.visual-paradigm.com/features/v15/ux-design-and-wireframe-tools/ux-design-storyboard.png"
                          alt="UI/UX Design"
                          className="w-full h-full object-cover"
                        />
                    
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <h4 className="text-white text-xs font-bold">UI/UX</h4>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300 rounded-full opacity-20 animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-purple-400 rounded-full opacity-30 animate-float pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-15 animate-float pointer-events-none" style={{animationDelay: '2s'}}></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
    </section>
  );
}

export default HeroSection;