import React from 'react'

function CourseIntroSection() {
  const courses = [
    {
      id: "c1",
      title: "Graphic Design Mastery",
      shortTitle: "Graphic Design",
      image: "https://thumbs.dreamstime.com/b/creative-designer-s-workspace-ai-generated-image-vibrant-graphic-design-computer-monitor-colorful-pencils-plants-378722532.jpg",
      description: "Master the art of visual communication with our comprehensive graphic design course. Learn industry-standard tools like Adobe Photoshop, Illustrator, and InDesign. From branding to digital illustrations, develop skills that transform ideas into stunning visuals.",
      features: ["Adobe Creative Suite", "Brand Identity Design", "Typography & Color Theory", "Print & Digital Design", "Portfolio Development"]
    },
    {
      id: "c2",
      title: "Web Development",
      shortTitle: "Web Development",
      image: "https://www.shutterstock.com/shutterstock/photos/1490541647/display_1500/stock-photo-web-development-coding-and-programming-responsive-layout-internet-site-or-app-of-devices-creation-1490541647.jpg",
      description: "Build modern, responsive websites and web applications from scratch. Master HTML, CSS, JavaScript, and popular frameworks like React. Learn both front-end and back-end development to become a full-stack developer.",
      features: ["HTML, CSS & JavaScript", "React & Modern Frameworks", "Responsive Web Design", "Backend Development", "Database Integration", "Deployment & Hosting"]
    },
    {
      id: "c3",
      title: "English Communication",
      shortTitle: "English",
      image: "https://www.shutterstock.com/image-photo/asian-girl-student-online-learning-class-260nw-2294649035.jpg",
      description: "Enhance your English language skills for academic, professional, and personal growth. Improve speaking, writing, listening, and reading abilities. Build confidence in business communication, presentations, and everyday conversations.",
      features: ["Business English", "Public Speaking", "Grammar & Writing", "Listening & Comprehension", "IELTS/TOEFL Preparation"]
    },
    {
      id: "c4",
      title: "UI/UX Design",
      shortTitle: "UI/UX Design",
      image: "https://cdn-images.visual-paradigm.com/features/v15/ux-design-and-wireframe-tools/ux-design-storyboard.png",
      description: "Create intuitive and beautiful user experiences that delight users. Learn user research, wireframing, prototyping, and usability testing. Master tools like Figma and Adobe XD to design interfaces that solve real problems.",
      features: ["User Research & Testing", "Wireframing & Prototyping", "Figma & Adobe XD", "Design Systems", "Mobile & Web UI", "Interaction Design"]
    },
  ]

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 pt-16 pb-16">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200 mb-6">
            <span className="text-sm font-medium text-purple-900">Our Courses</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-purple-900">
            Transform Your Career with
            <span className="block text-transparent bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text mt-2">
              Expert-Led Courses
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive range of courses designed by industry experts
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <div 
              key={course.id} 
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Section with Overlay */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent"></div>
                
                {/* Course Number Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Course Title on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">
                    {course.title}
                  </h3>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Course Features - Only show 3 */}
                <div className="space-y-2 mb-5">
                  {course.features.slice(0, 3).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-purple-600 mt-1.5"></div>
                      <span className="text-xs text-gray-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="w-full px-4 py-2.5 bg-purple-700 text-white text-sm rounded-lg font-medium hover:bg-purple-800 transition-all duration-300">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  )
}

export default CourseIntroSection