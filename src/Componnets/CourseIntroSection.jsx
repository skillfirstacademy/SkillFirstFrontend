import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import adminApi from "../api/adminApi";
import { showError } from "../Componnets/AppToaster";

function CourseIntroSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("all");

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await adminApi.get("courses");
        setCourses(res.data?.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // View Course Handler
  const handleViewCourse = (course) => {
    if (!isAuthenticated) {
      showError("Please login to view course details");
      navigate("/login", {
        state: { redirectTo: `/course/${course._id}` },
      });
      return;
    }
    navigate(`/course/${course._id}`);
  };

  // Filter Courses by Level
  const filteredCourses =
    selectedLevel === "all"
      ? courses
      : courses.filter(
          (course) =>
            course.level?.toLowerCase() === selectedLevel.toLowerCase()
        );

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-700"></div>
      </div>
    );
  }

  // No Courses Found
  if (courses.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">No Courses Available</h2>
        <p className="text-gray-600 mt-2">
          Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 py-16">
      <div className="container mx-auto px-6 lg:px-20">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-purple-900">
            Explore Our Courses
          </h2>
          <p className="text-gray-600 mt-3">
            Learn from beginner to advanced levels
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex justify-center mb-10">
          <div className="bg-white shadow-md rounded-lg p-1 flex gap-2">
            {["all", "beginner", "intermediate", "advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedLevel === level
                    ? "bg-purple-700 text-white"
                    : "text-gray-700 hover:bg-purple-100"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Empty Filter Result */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold">
              No {selectedLevel} courses found
            </h3>
            <p className="text-gray-600 mt-2">
              Try selecting another level
            </p>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course, index) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="relative h-48">
                {course.thumbnail ? (
                  <img
                    // src={`http://localhost:5000${course.thumbnail}`}
                    src={`https://skillfirstbackend.onrender.com${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full bg-purple-700 flex items-center justify-center text-white">
                    No Image
                  </div>
                )}

                {/* Level Badge */}
                {course.level && (
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      course.level === "beginner"
                        ? "bg-green-100 text-green-700"
                        : course.level === "intermediate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {course.level}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800">
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {course.description}
                </p>

                {/* Price */}
                <div className="mt-4">
                  {course.isPaid ? (
                    <span className="text-xl font-bold text-purple-700">
                      ₹{course.price}
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-green-600">
                      Free
                    </span>
                  )}
                </div>

                {/* Button */}
                <button
                  onClick={() => handleViewCourse(course)}
                  className="mt-4 w-full py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
                >
                  {isAuthenticated ? "View Course" : "Login to View"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default CourseIntroSection;
