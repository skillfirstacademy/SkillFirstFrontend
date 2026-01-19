import React from "react";
import { Link } from "react-router-dom";

function CourseIntroSection() {
  const courses = [
    {
      id: "c1",
      slug: "graphic-design",
      title: "Graphic Design Mastery",
      shortTitle: "Graphic Design",
      image:
        "https://thumbs.dreamstime.com/b/creative-designer-s-workspace-ai-generated-image-vibrant-graphic-design-computer-monitor-colorful-pencils-plants-378722532.jpg",
      description:
        "Master the art of visual communication with Adobe Photoshop & Illustrator. Learn branding, typography and create stunning visuals.",
      features: [
        "Adobe Creative Suite",
        "Brand Identity Design",
        "Typography & Color Theory",
        "Print & Digital Design",
        "Portfolio Development",
      ],
    },
    {
      id: "c2",
      slug: "video-editing ",
      title: "video editing ",
      shortTitle: "video editing",
      image:
        "https://www.shutterstock.com/shutterstock/photos/1490541647/display_1500/stock-photo-web-development-coding-and-programming-responsive-layout-internet-site-or-app-of-devices-creation-1490541647.jpg",
      description:
        "Learn HTML, CSS, JavaScript, React, backend development, databases, and deployment to become a full-stack developer.",
      features: [
        "HTML, CSS & JavaScript",
        "React Framework",
        "Backend Development",
        "Responsive Design",
        "Database Integration",
        "Hosting & Deployment",
      ],
    },
    {
      id: "c3",
      slug: "english",
      title: "English Communication",
      shortTitle: "English",
      image:
        "https://www.shutterstock.com/image-photo/asian-girl-student-online-learning-class-260nw-2294649035.jpg",
      description:
        "Improve your speaking, grammar, vocabulary, and communication skills. Boost your confidence for interviews & daily conversations.",
      features: [
        "Business English",
        "Public Speaking",
        "Grammar & Writing",
        "Listening Practice",
        "IELTS/TOEFL Tips",
      ],
    },
    {
      id: "c4",
      slug: "ui-ux",
      title: "UI/UX Design",
      shortTitle: "UI/UX Design",
      image:
        "https://cdn-images.visual-paradigm.com/features/v15/ux-design-and-wireframe-tools/ux-design-storyboard.png",
      description:
        "Master Figma, wireframing, prototyping, design systems, and usability testing. Build stunning UI/UX case studies.",
      features: [
        "User Research",
        "Wireframing & Prototyping",
        "Figma & Adobe XD",
        "Design Systems",
        "UI Fundamentals",
        "Interaction Design",
      ],
    },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 pt-16 pb-16">
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200 mb-6">
            <span className="text-sm font-medium text-purple-900">
              Our Courses
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-purple-900">
            Transform Your Career with
            <span className="block text-transparent bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text mt-2">
              Expert-Led Courses
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive range of courses designed by industry
            professionals.
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <Link
              to={`/course/${course.slug}`}
              key={course.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 block"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent"></div>

                {/* Number Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">
                    {course.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-5">
                  {course.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5"></div>
                      <span className="text-xs text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button className="w-full px-4 py-2.5 bg-purple-700 text-white text-sm rounded-lg font-medium hover:bg-purple-800 transition-all duration-300">
                  Enroll Now
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseIntroSection;
