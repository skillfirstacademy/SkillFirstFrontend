import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "../../Componnets/VideoPlayer";

// Create axios instance with authentication
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function UserCourseDetail() {
  const { courseId } = useParams(); // This is the course _id from the URL
  const navigate = useNavigate();

  console.log("📋 CourseId from URL params:", courseId);

  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [testsMap, setTestsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingTests, setLoadingTests] = useState(false);
  const [viewingTest, setViewingTest] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [activeStage, setActiveStage] = useState("beginner");
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [expandedVideo, setExpandedVideo] = useState(null);

  useEffect(() => {
    if (!courseId || courseId === "undefined") {
      console.error("Invalid course ID:", courseId);
      setLoading(false);
      return;
    }
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Step 1: Fetch course by ID
      console.log("📚 Fetching course by ID:", courseId);
      const courseRes = await api.get(`/courses/${courseId}`);
      const courseData = courseRes.data?.course || courseRes.data;
      
      if (!courseData || !courseData._id) {
        console.error("❌ Course not found or missing _id");
        setCourse(null);
        setLoading(false);
        return;
      }

      console.log("✅ Course fetched successfully:", courseData);
      setCourse(courseData);

      // Step 2: Fetch videos for this course using course._id
      console.log("🎥 Fetching videos for course ID:", courseData._id);
      try {
        const videosRes = await api.get(`/videos/course/${courseData._id}`);
        const videosData = videosRes.data || [];
        
        console.log(`✅ Fetched ${videosData.length} videos:`, videosData);
        setVideos(videosData);

        // Step 3: Fetch tests for each video
        if (videosData.length > 0) {
          console.log("🧪 Fetching tests for videos...");
          await fetchTestsForVideos(videosData);
        } else {
          console.log("ℹ️ No videos found for this course");
        }
      } catch (videoError) {
        console.error("❌ Error fetching videos:", videoError);
        
        if (videoError.response?.status === 401) {
          console.error("🔒 Authentication required for videos.");
          // Optionally redirect to login
          // navigate("/login");
        } else if (videoError.response?.status === 404) {
          console.log("ℹ️ No videos found for this course");
        }
        
        setVideos([]);
      }
    } catch (err) {
      console.error("❌ Error fetching course:", err);
      console.error("📋 Course ID:", courseId);
      console.error("📋 Error response:", err.response);
      
      if (err.response?.status === 401) {
        console.error("🔒 Authentication required. Please log in.");
        // Optionally redirect to login
        // navigate("/login");
      } else if (err.response?.status === 404) {
        console.error("❌ Course not found");
      }
      
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestsForVideos = async (videosList) => {
    try {
      setLoadingTests(true);
      const testsData = {};

      const testPromises = videosList.map(async (video) => {
        try {
          const response = await api.get(`/tests/video/${video._id}`);
          if (response.data) {
            testsData[video._id] = response.data;
            console.log(`✅ Test found for video: ${video.title}`);
          }
        } catch (err) {
          if (err.response?.status === 404) {
            console.log(`ℹ️ No test available for video: ${video.title}`);
          } else if (err.response?.status === 401) {
            console.error(`🔒 Authentication required for test: ${video.title}`);
          } else {
            console.error(`❌ Error fetching test for video ${video.title}:`, err.message);
          }
        }
      });

      await Promise.all(testPromises);
      setTestsMap(testsData);
      console.log(`✅ Loaded ${Object.keys(testsData).length} tests total`);
    } catch (err) {
      console.error("❌ Error fetching tests:", err);
    } finally {
      setLoadingTests(false);
    }
  };

  const groupByStage = (items) => {
    return {
      beginner: items.filter((i) => i.stage === "beginner"),
      intermediate: items.filter((i) => i.stage === "intermediate"),
      advanced: items.filter((i) => i.stage === "advanced"),
    };
  };

  const videoGroups = groupByStage(videos);

  const handlePlayVideo = (video) => {
    setPlayingVideo(video);
  };

  const handleViewTest = (test) => {
    setViewingTest(test);
  };

  const toggleVideoExpand = (videoId) => {
    setExpandedVideo(expandedVideo === videoId ? null : videoId);
  };

  const calculateProgress = () => {
    const currentStageVideos = videoGroups[activeStage];
    if (currentStageVideos.length === 0) return 0;
    const completed = currentStageVideos.filter((v) =>
      completedVideos.has(v._id)
    ).length;
    return Math.round((completed / currentStageVideos.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-purple-700 font-semibold text-lg">
            Loading your course...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-8xl mb-6">🔍</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist or you don't have access to view it.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
            >
              Explore Other Courses
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-200 transition-all"
            >
              Try Again
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Check the browser console for more details
          </p>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Courses</span>
          </button>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Course Info */}
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <span className="text-sm font-medium">
                  {course.isPaid ? `₹${course.price}` : "Free Course"}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {course.title}
              </h1>

              <p className="text-lg text-white/90 mb-6 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium">{videos.length} Videos</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="font-medium">
                    {Object.keys(testsMap).length} Practice Tests
                  </span>
                </div>
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl">
                {course.thumbnail ? (
                  <img
                    src={`http://localhost:5000${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-48 bg-white/20 rounded-xl flex items-center justify-center">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Your Progress
              </h3>
              <p className="text-sm text-gray-600">
                {completedVideos.size} of {videoGroups[activeStage].length}{" "}
                videos completed
              </p>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {progress}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Stage Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Choose Your Level
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["beginner", "intermediate", "advanced"].map((stage) => {
              const isActive = activeStage === stage;
              const stageVideos = videoGroups[stage];
              const hasContent = stageVideos.length > 0;

              return (
                <button
                  key={stage}
                  onClick={() => setActiveStage(stage)}
                  disabled={!hasContent}
                  className={`relative p-6 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-xl scale-105"
                      : hasContent
                      ? "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">
                      {stage === "beginner"
                        ? "🌱"
                        : stage === "intermediate"
                        ? "🚀"
                        : "⭐"}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isActive
                          ? "bg-white/20"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {stageVideos.length} videos
                    </span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-lg capitalize mb-1">
                      {stage}
                    </h4>
                    <p
                      className={`text-sm ${
                        isActive ? "text-white/80" : "text-gray-600"
                      }`}
                    >
                      {stage === "beginner"
                        ? "Start your journey"
                        : stage === "intermediate"
                        ? "Build your skills"
                        : "Master advanced concepts"}
                    </p>
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl ring-4 ring-purple-300 ring-opacity-50"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Content */}
        <div className="space-y-4">
          {videoGroups[activeStage].length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-7xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Content Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                We're working hard to bring you amazing content for this level.
                Stay tuned!
              </p>
              <div className="flex justify-center gap-3">
                {["beginner", "intermediate", "advanced"]
                  .filter((s) => s !== activeStage && videoGroups[s].length > 0)
                  .map((stage) => (
                    <button
                      key={stage}
                      onClick={() => setActiveStage(stage)}
                      className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium capitalize"
                    >
                      Try {stage}
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            videoGroups[activeStage].map((video, index) => {
              const test = testsMap[video._id];
              const isExpanded = expandedVideo === video._id;
              const isCompleted = completedVideos.has(video._id);

              return (
                <div
                  key={video._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  {/* Video Header */}
                  <div className="p-6 bg-gradient-to-r from-purple-50 via-white to-blue-50">
                    <div className="flex gap-4">
                      {/* Number Badge */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg ${
                            isCompleted
                              ? "bg-gradient-to-br from-green-500 to-green-600"
                              : "bg-gradient-to-br from-purple-600 to-blue-600"
                          }`}
                        >
                          {isCompleted ? "✓" : index + 1}
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {video.title}
                        </h3>

                        {video.description && isExpanded && (
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {video.description}
                          </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="font-medium">
                              {video.duration} mins
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold capitalize">
                              {video.stage}
                            </span>
                          </div>
                          {isCompleted && (
                            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Completed
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handlePlayVideo(video)}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                            {isCompleted ? "Watch Again" : "Start Learning"}
                          </button>

                          {video.description && (
                            <button
                              onClick={() => toggleVideoExpand(video._id)}
                              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all"
                            >
                              {isExpanded ? "Show Less" : "Learn More"}
                              <svg
                                className={`w-4 h-4 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Section */}
                  {loadingTests && !test ? (
                    <div className="p-6 bg-blue-50 border-t-2 border-blue-100">
                      <div className="flex items-center justify-center gap-3 text-blue-600">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-sm font-medium">
                          Loading practice test...
                        </span>
                      </div>
                    </div>
                  ) : test ? (
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-t-2 border-blue-200">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-blue-900 text-lg mb-1">
                              Practice Test Available
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-blue-700">
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {test.questions?.length || 0} questions
                              </span>
                              {test.passingScore && (
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {test.passingScore}% to pass
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewTest(test)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          Take Test
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* TEST VIEWER MODAL */}
      {viewingTest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex justify-between items-center shadow-lg z-10">
              <div>
                <h2 className="text-3xl font-bold mb-1">Practice Test</h2>
                <p className="text-white/90">
                  {viewingTest.questions?.length || 0} Questions
                  {viewingTest.passingScore &&
                    ` • ${viewingTest.passingScore}% required to pass`}
                </p>
              </div>
              <button
                onClick={() => setViewingTest(null)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Questions */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {viewingTest.questions && viewingTest.questions.length > 0 ? (
                <div className="space-y-6">
                  {viewingTest.questions.map((question, idx) => {
                    const questionText = question.question;
                    const options = question.options || [];
                    const correctAnswer = question.correctAnswer;

                    return (
                      <div
                        key={idx}
                        className="border-2 border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-white hover:border-purple-200 transition-colors"
                      >
                        {/* Question */}
                        <div className="flex gap-4 mb-6">
                          <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
                            {idx + 1}
                          </span>
                          <p className="flex-1 text-lg font-semibold text-gray-800 leading-relaxed">
                            {questionText}
                          </p>
                        </div>

                        {/* Options */}
                        {options.length > 0 ? (
                          <div className="ml-14 space-y-3">
                            {options.map((option, optIdx) => {
                              const isCorrect = correctAnswer === optIdx;

                              return (
                                <div
                                  key={optIdx}
                                  className={`group p-4 rounded-xl border-2 transition-all ${
                                    isCorrect
                                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-md"
                                      : "bg-white border-gray-300 hover:border-gray-400"
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <span
                                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                        isCorrect
                                          ? "bg-green-600 text-white shadow-lg"
                                          : "bg-gray-200 text-gray-700 group-hover:bg-gray-300"
                                      }`}
                                    >
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span
                                      className={`flex-1 ${
                                        isCorrect
                                          ? "text-green-900 font-medium"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {option}
                                    </span>
                                    {isCorrect && (
                                      <div className="flex items-center gap-2 text-green-600 font-bold">
                                        <svg
                                          className="w-6 h-6"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        <span className="hidden sm:inline">
                                          Correct Answer
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="ml-14 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-sm text-yellow-800 flex items-center gap-2">
                            <svg
                              className="w-5 h-5 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            No options available for this question
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-7xl mb-4">📝</div>
                  <p className="text-xl text-gray-600">
                    No questions available for this test
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Review all questions and answers
              </div>
              <button
                onClick={() => setViewingTest(null)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Close Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PLAYER MODAL */}
      {playingVideo && (
        <VideoPlayer
          videoUrl={`http://localhost:5000/api/videos/${playingVideo._id}/stream`}
          title={playingVideo.title}
          onClose={() => setPlayingVideo(null)}
          onError={(err) => {
            console.error("Video player error:", err);
            setPlayingVideo(null);
          }}
        />
      )}
    </div>
  );
}

export default UserCourseDetail;