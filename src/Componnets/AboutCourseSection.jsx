import React from 'react'
import { Clock, Users, Award, BookOpen, TrendingUp } from 'lucide-react'

function AboutCourseSection() {
  const courses = [
    {
      id: 1,
      title: "Graphic Design Mastery",
      description: "Master the art of visual communication and create stunning designs that captivate audiences. Learn industry-standard tools and techniques from experienced designers.",
      image: "https://thumbs.dreamstime.com/b/creative-designer-s-workspace-ai-generated-image-vibrant-graphic-design-computer-monitor-colorful-pencils-plants-378722532.jpg",
      duration: "12 Weeks",
      students: "2.5K+",
      level: "Beginner to Advanced",
      skills: ["Adobe Photoshop", "Illustrator", "Brand Identity", "Typography", "Color Theory"],
      highlights: [
        "Industry-recognized certification",
        "Real-world project portfolio",
        "1-on-1 mentor sessions",
        "Lifetime course access"
      ]
    },
    {
      id: 2,
      title: "Web Development",
      description: "Build modern, responsive websites and web applications from scratch. Master both front-end and back-end development to become a full-stack developer.",
      image: "https://www.shutterstock.com/shutterstock/photos/1490541647/display_1500/stock-photo-web-development-coding-and-programming-responsive-layout-internet-site-or-app-of-devices-creation-1490541647.jpg",
      duration: "16 Weeks",
      students: "3.2K+",
      level: "Beginner Friendly",
      skills: ["HTML & CSS", "JavaScript", "React", "Node.js", "Database Design"],
      highlights: [
        "Build 10+ real projects",
        "Job placement assistance",
        "Industry expert instructors",
        "Community support"
      ]
    },
    {
      id: 3,
      title: "English Communication",
      description: "Enhance your English language skills for academic, professional, and personal growth. Build confidence in speaking, writing, and presenting.",
      image: "https://www.shutterstock.com/image-photo/asian-girl-student-online-learning-class-260nw-2294649035.jpg",
      duration: "10 Weeks",
      students: "1.8K+",
      level: "All Levels",
      skills: ["Business English", "Public Speaking", "Grammar", "Writing", "IELTS Prep"],
      highlights: [
        "Live interactive sessions",
        "Personalized feedback",
        "Speaking practice groups",
        "Interview preparation"
      ]
    },
    {
      id: 4,
      title: "UI/UX Design",
      description: "Create intuitive and beautiful user experiences that delight users. Learn user research, wireframing, prototyping, and design systems.",
      image: "https://cdn-images.visual-paradigm.com/features/v15/ux-design-and-wireframe-tools/ux-design-storyboard.png",
      duration: "14 Weeks",
      students: "2.1K+",
      level: "Intermediate",
      skills: ["User Research", "Wireframing", "Figma", "Prototyping", "Design Systems"],
      highlights: [
        "Portfolio-ready projects",
        "Industry case studies",
        "Design critique sessions",
        "Career guidance"
      ]
    }
  ]

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200 mb-6">
            <BookOpen className="w-4 h-4 text-purple-700 mr-2" />
            <span className="text-sm font-medium text-purple-900">Our Courses</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-900 mb-4">
            Transform Your Career with
            <span className="block text-transparent bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text mt-2">
              Expert-Led Programs
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive courses designed by industry experts to help you master in-demand skills
          </p>
        </div>

        {/* Courses Grid */}
        <div className="space-y-12 md:space-y-16">
          {courses.map((course, index) => (
            <div 
              key={course.id}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}
            >
              {/* Image Section */}
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img 
                      src={course.image}
                      alt={course.title}
                      className="w-full h-64 md:h-80 object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
                    
                    {/* Course Number Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-xl font-bold text-purple-700">
                        {String(course.id).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full lg:w-1/2 space-y-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-purple-900 mb-3">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Course Info Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
                    <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-purple-900 font-semibold">{course.duration}</p>
                    <p className="text-xs text-gray-600">Duration</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
                    <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-purple-900 font-semibold">{course.students}</p>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
                    <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-purple-900 font-semibold">{course.level}</p>
                    <p className="text-xs text-gray-600">Level</p>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-base font-semibold text-purple-900 mb-3">What You'll Learn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-base font-semibold text-purple-900 mb-3">Course Highlights:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div>
                  <button className="px-8 py-3 bg-purple-700 text-white rounded-xl font-medium hover:bg-purple-800 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    Enroll in {course.title}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutCourseSection