import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Features/authSlice";
import api from "../../api/axios";
import adminApi from "../../api/adminApi";
import { showSuccess, showError } from "../../Componnets/AppToaster";
import { useSessionValidator } from "../../hooks/useSessionValidator";

const StatCard = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    {subtitle && (
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    )}
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useSessionValidator();

  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all enrollments
  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await adminApi.get("/students/my-courses");
      console.log("Enrollments response:", res.data);

      if (!res.data?.enrollments || res.data.enrollments.length === 0) {
        setEnrollments([]);
        setSelectedEnrollment(null);
        return;
      }

      setEnrollments(res.data.enrollments);
      // Select the most recent enrollment by default
      setSelectedEnrollment(res.data.enrollments[0]);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      showError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(logout());
      localStorage.clear();
      navigate("/login");
      showSuccess("Logged out successfully");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!selectedEnrollment) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Enrollments Found
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't enrolled in any courses yet.
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = selectedEnrollment.progress || {};
  const course = selectedEnrollment.course || {};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "S"}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.name || "Student"}
            </h2>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 font-medium hover:underline"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Course Selector - Only show if multiple enrollments */}
        {enrollments.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Course:</label>
            <select
              value={selectedEnrollment._id}
              onChange={(e) => {
                const enrollment = enrollments.find(
                  (enr) => enr._id === e.target.value
                );
                setSelectedEnrollment(enrollment);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {enrollments.map((enrollment) => (
                <option key={enrollment._id} value={enrollment._id}>
                  {enrollment.course?.title || "Untitled Course"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Course Info Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">
              {course.title || "Course"}
            </h3>
            <p className="text-blue-100 text-sm">
              {selectedEnrollment.status === "completed"
                ? "✓ Completed"
                : "In Progress"}
            </p>
          </div>
          {enrollments.length > 1 && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-xs text-blue-100">Enrolled Courses</p>
              <p className="text-2xl font-bold">{enrollments.length}</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fluency */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Fluency</p>

          <div className="flex items-center justify-center">
            <div className="relative h-32 w-32">
              <svg className="transform -rotate-90 h-32 w-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 56 * (1 - (progress.fluencyPercent || 0) / 100)
                  }`}
                  className="text-blue-600 transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-900">
                  {progress.fluencyPercent || 0}%
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Fluent in{" "}
            <span className="font-medium">
              {course?.title} {course?.level}
            </span>
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <StatCard
              title="Words learned"
              value={progress.wordsLearned || 0}
            />
            <StatCard
              title="Certificates"
              value={progress.certificatesEarned || 0}
            />
          </div>
        </div>

        {/* Right Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard 
            title="Active days" 
            value={progress.activeDay || 0}
            subtitle="Days you've been active"
          />
          <StatCard 
            title="Daily streak" 
            value={progress.streak || 0}
            subtitle="🔥 Keep it going!"
          />
          <StatCard
            title="Videos watched"
            value={progress.watchedVideos?.length || 0}
            subtitle={`Out of ${progress.totalVideos || 0} total`}
          />
          <StatCard
            title="Course progress"
            value={`${Math.round(progress.progressPercentage || 0)}%`}
            subtitle={progress.completed ? "Course completed! 🎉" : "Keep learning"}
          />
        </div>
      </div>

      {/* Bottom Section - Daily Streak Visualization */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-900">
            Current Streak
          </p>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{progress.streak || 0}</p>
              <p className="text-xs text-gray-500">day{progress.streak !== 1 ? 's' : ''} streak 🔥</p>
            </div>
            {progress.lastActivityDate && (
              <div className="text-right border-l pl-3">
                <p className="text-xs text-gray-500">Last active</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(progress.lastActivityDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {(() => {
            const today = new Date();
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const currentDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
            
            // Calculate which days should be marked as active based on streak
            const streak = progress.streak || 0;
            const lastActivityDate = progress.lastActivityDate ? new Date(progress.lastActivityDate) : today;
            
            return dayNames.map((dayName, index) => {
              // Calculate days difference from today
              let daysFromToday = index - currentDayOfWeek;
              
              // Create date for this day of current week
              const thisDate = new Date(today);
              thisDate.setDate(today.getDate() + daysFromToday);
              thisDate.setHours(0, 0, 0, 0);
              
              const todayStart = new Date(today);
              todayStart.setHours(0, 0, 0, 0);
              
              const lastActivityStart = new Date(lastActivityDate);
              lastActivityStart.setHours(0, 0, 0, 0);
              
              // Check if this day should be active
              // A day is active if it's within the streak range from last activity date
              const daysDiff = Math.floor((lastActivityStart - thisDate) / (1000 * 60 * 60 * 24));
              const isActive = thisDate <= lastActivityStart && daysDiff < streak && thisDate <= todayStart;
              
              const isToday = thisDate.getTime() === todayStart.getTime();
              const isFuture = thisDate > todayStart;
              
              return (
                <div
                  key={dayName}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all ${
                    isActive
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md"
                      : isFuture
                      ? "bg-gray-50 text-gray-300 border border-dashed border-gray-200"
                      : "bg-gray-100 text-gray-400"
                  } ${isToday ? "ring-2 ring-blue-300 ring-offset-2" : ""}`}
                >
                  <span className="font-medium text-[10px]">{dayName}</span>
                  {isActive && <span className="text-xs mt-0.5">✓</span>}
                  {isToday && !isActive && <span className="text-xs mt-0.5">•</span>}
                </div>
              );
            });
          })()}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-gray-100"></div>
              <span>Inactive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded border-2 border-blue-300"></div>
              <span>Today</span>
            </div>
          </div>
          <span>{progress.activeDay || 0} total active days</span>
        </div>
      </div>

      {/* Tests Passed Section */}
      {progress.passedTests && progress.passedTests.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
          <p className="text-sm font-medium text-gray-900 mb-3">
            Tests Completed
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    ((progress.passedTests.length || 0) /
                      (progress.totalVideos || 1)) *
                    100
                  }%`,
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {progress.passedTests.length} passed
            </span>
          </div>
        </div>
      )}

      {/* Show all courses overview if multiple enrollments */}
      {enrollments.length > 1 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
          <p className="text-sm font-medium text-gray-900 mb-4">
            All Your Courses
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment._id}
                onClick={() => setSelectedEnrollment(enrollment)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedEnrollment._id === enrollment._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h4 className="font-medium text-gray-900 mb-1">
                  {enrollment.course?.title || "Untitled"}
                </h4>
                <p className="text-xs text-gray-500 mb-2">
                  {enrollment.status === "completed" ? "✓ Completed" : "In Progress"}
                </p>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{enrollment.progress?.progressPercentage || 0}% done</span>
                  <span>{enrollment.progress?.streak || 0} day streak</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;