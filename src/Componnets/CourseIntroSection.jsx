import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function CourseIntroSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        const coursesData = res.data?.courses || [];
        
        console.log("✅ Fetched courses:", coursesData);
        
        setCourses(coursesData);
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-700 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-purple-700">
            Loading courses...
          </p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 pt-16 pb-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Courses Available
            </h3>
            <p className="text-gray-600">
              Check back soon for new courses!
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          {courses.map((course, index) => {
            // Use _id for the course link
            const courseLink = `/course/${course._id}`;

            return (
              <Link
                to={courseLink}
                key={course._id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 block"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  {course.thumbnail ? (
                    <img
                      src={`http://localhost:5000${course.thumbnail}`}
                      alt={course.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        console.error(`Failed to load thumbnail for course: ${course.title}`);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-600 to-purple-900 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-white/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent"></div>

                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

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
                  {course.features && course.features.length > 0 && (
                    <div className="space-y-2 mb-5">
                      {course.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5"></div>
                          <span className="text-xs text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Price & Button */}
                  <div className="flex items-center justify-between mb-4">
                    {course.isPaid ? (
                      <span className="text-2xl font-bold text-purple-700">
                        ₹{course.price}
                      </span>
                    ) : (
                      <span className="text-lg font-bold text-green-600">
                        Free
                      </span>
                    )}
                  </div>

                  <button className="w-full px-4 py-2.5 bg-purple-700 text-white text-sm rounded-lg font-medium hover:bg-purple-800 transition-all duration-300">
                    Enroll Now
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CourseIntroSection;