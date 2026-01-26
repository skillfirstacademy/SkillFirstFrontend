import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import VideoPlayer from "../Componnets/VideoPlayer";
import { showError, showSuccess } from "../Componnets/AppToaster";
import adminApi from "../api/adminApi";

function CourseDetailsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // Get user from Redux
  const { user } = useSelector((state) => state.auth);
  
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [testsMap, setTestsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingTests, setLoadingTests] = useState(false);
  const [viewingTest, setViewingTest] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [enrollingLevel, setEnrollingLevel] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState(null);

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
      const courseRes = await adminApi.get(`/courses/${courseId}`);
      const courseData = courseRes.data?.course || courseRes.data;

      if (!courseData || !courseData._id) {
        console.error("❌ Course not found or missing _id");
        setCourse(null);
        setLoading(false);
        return;
      }

      setCourse(courseData);

      // Check enrollment status
      await checkEnrollmentStatus(courseData._id);

      try {
        const videosRes = await adminApi.get(`/videos/course/${courseData._id}`);
        const videosData = videosRes.data || [];
        setVideos(videosData);

        if (videosData.length > 0) {
          await fetchTestsForVideos(videosData);
        }
      } catch (videoError) {
        console.error("❌ Error fetching videos:", videoError);
        setVideos([]);
      }
    } catch (err) {
      console.error("❌ Error fetching course:", err);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async (courseId) => {
    try {
      // Check if user is enrolled in this course
      const response = await adminApi.get(`/students/enrollment/${courseId}`);
      if (response.data.success && response.data.enrollment) {
        setIsEnrolled(true);
        setEnrollmentData(response.data.enrollment);
      } else {
        setIsEnrolled(false);
        setEnrollmentData(null);
      }
    } catch (error) {
      console.log("Not enrolled or error checking enrollment");
      setIsEnrolled(false);
      setEnrollmentData(null);
    }
  };

  const fetchTestsForVideos = async (videosList) => {
    try {
      setLoadingTests(true);
      const testsData = {};
      const testPromises = videosList.map(async (video) => {
        try {
          const response = await adminApi.get(`/tests/video/${video._id}`);
          if (response.data) {
            testsData[video._id] = response.data;
          }
        } catch (err) {
          // Silently handle test fetch errors
        }
      });

      await Promise.all(testPromises);
      setTestsMap(testsData);
    } catch (err) {
      console.error("❌ Error fetching tests:", err);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleEnrollClick = async (level) => {
    setEnrollingLevel(level);
    try {
      const enrollmentData = {
        userName: user?.name || user?.email?.split("@")[0] || "Student",
        userEmail: user?.email || "",
        userMobile: user?.mobile || user?.phone || "Not provided",
        courseName: course.title,
        courseLevel: level, // ✅ now a string
        courseAmount: course.isPaid ? course.price : 0,
      };
  
      console.log("📧 Sending enrollment request:", enrollmentData);
  
      const response = await adminApi.post(
        "/students/buy/enroll",
        enrollmentData
      );
  
      if (response.data.success) {
        showSuccess(response.data.message);
        setIsEnrolled(true);
        checkEnrollmentStatus(course._id);
      }
    } catch (error) {
      console.error("❌ Enrollment failed:", error);
      showError(
        error.response?.data?.message || "Enrollment failed. Please try again."
      );
    } finally {
      setEnrollingLevel(null);
    }
  };
  
  

  const isVideoUnlocked = (videoIndex) => {
    if (!isEnrolled) return false;
    
    // If no enrollment data, unlock first video only
    if (!enrollmentData || !enrollmentData.unlockedVideos) {
      return videoIndex === 0;
    }

    // Check if this video is in the unlocked videos array
    const videoId = videos[videoIndex]?._id;
    return enrollmentData.unlockedVideos.includes(videoId);
  };

  const handlePlayVideo = (video, videoIndex) => {
    if (!isEnrolled) {
      showError("Please enroll in this course to watch videos");
      return;
    }

    if (!isVideoUnlocked(videoIndex)) {
      showError("This video is locked. Complete previous videos to unlock.");
      return;
    }

    setPlayingVideo(video);
  };

  const handleViewTest = (test) => {
    if (!isEnrolled) {
      showError("Please enroll in this course to access tests");
      return;
    }
    setViewingTest(test);
  };

  const toggleVideoExpand = (videoId) => {
    setExpandedVideo(expandedVideo === videoId ? null : videoId);
  };

  const calculateProgress = () => {
    if (videos.length === 0) return 0;
    const completed = videos.filter((v) => completedVideos.has(v._id)).length;
    return Math.round((completed / videos.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Loading your course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Course Not Found</h2>
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
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </button>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Course Info */}
            <div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {course.isPaid ? `₹${course.price}` : "Free Course"}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-white/90 mb-6">{course.description}</p>
              
              {/* Enrollment Status Badge */}
              {isEnrolled && (
                <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Enrolled
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{videos.length} Videos</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{Object.keys(testsMap).length} Practice Tests</span>
                </div>
              </div>

              {/* Enroll Button */}
              {!isEnrolled && (
                <button
                  onClick={() => handleEnrollClick(course.level)}
                  disabled={enrollingLevel === "enrolling"}
                  className="mt-6 w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enrollingLevel === "enrolling" ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-purple-600"></div>
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Enroll Now {course.isPaid && `- ₹${course.price}`}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Course Thumbnail */}
            <div className="flex justify-center">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="rounded-2xl shadow-2xl max-w-full h-auto"
                />
              ) : (
                <div className="w-full h-64 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg className="w-24 h-24 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Section - Only show if enrolled */}
        {isEnrolled && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Your Progress</h3>
              <span className="text-sm text-gray-600">{completedVideos.size} of {videos.length} videos completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${progress}%` }}
              >
                <span className="text-xs font-bold text-white">{progress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Course Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Videos</h2>
          
          {videos.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Content Coming Soon</h3>
              <p className="text-gray-600 mb-6">We're working hard to bring you amazing content. Stay tuned!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video, index) => {
                const test = testsMap[video._id];
                const isExpanded = expandedVideo === video._id;
                const isCompleted = completedVideos.has(video._id);
                const isUnlocked = isVideoUnlocked(index);

                return (
                  <div key={video._id} className={`border-2 rounded-xl overflow-hidden transition-colors ${isUnlocked ? 'border-gray-200 hover:border-purple-300' : 'border-gray-300 bg-gray-50'}`}>
                    <button
                      onClick={() => toggleVideoExpand(video._id)}
                      className={`w-full p-6 flex items-center gap-4 transition-colors text-left ${isUnlocked ? 'hover:bg-gray-50' : 'cursor-default'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isCompleted ? "bg-green-500 text-white" : isUnlocked ? "bg-gray-200 text-gray-700" : "bg-gray-300 text-gray-500"}`}>
                        {isCompleted ? "✓" : isUnlocked ? index + 1 : "🔒"}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-lg font-semibold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                          {video.title}
                          {!isUnlocked && <span className="ml-2 text-sm font-normal">(Locked)</span>}
                        </h4>
                        {video.description && isExpanded && (
                          <p className="text-sm text-gray-600 mt-2">{video.description}</p>
                        )}
                      </div>
                      <svg
                        className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 space-y-4 bg-gray-50">
                        {test && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="font-semibold text-blue-900">Practice Test Available</span>
                            </div>
                            <div className="text-sm text-blue-700 mb-3">
                              {test.questions?.length || 0} questions
                              {test.passingScore && (
                                <span className="ml-2">• {test.passingScore}% to pass</span>
                              )}
                            </div>
                            <button
                              onClick={() => handleViewTest(test)}
                              disabled={!isEnrolled}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              {isEnrolled ? 'Take Test' : 'Enroll to Access'}
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => handlePlayVideo(video, index)}
                          disabled={!isUnlocked}
                          className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg ${
                            isUnlocked
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-xl'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isUnlocked ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            )}
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {isUnlocked ? 'Play Video' : 'Video Locked'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* TEST VIEWER MODAL */}
      {viewingTest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div>
                <h2 className="text-2xl font-bold">Practice Test</h2>
                <p className="text-sm opacity-90">
                  {viewingTest.questions?.length || 0} Questions
                  {viewingTest.passingScore && ` • ${viewingTest.passingScore}% required to pass`}
                </p>
              </div>
              <button
                onClick={() => setViewingTest(null)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {viewingTest.questions && viewingTest.questions.length > 0 ? (
                <div className="space-y-6">
                  {viewingTest.questions.map((question, idx) => {
                    const questionText = question.question;
                    const options = question.options || [];
                    const correctAnswer = question.correctAnswer;

                    return (
                      <div key={idx} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                        <div className="flex gap-4 mb-4">
                          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                            {idx + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 flex-1">{questionText}</h3>
                        </div>
                        {options.length > 0 ? (
                          <div className="space-y-3 ml-12">
                            {options.map((option, optIdx) => {
                              const isCorrect = correctAnswer === optIdx;
                              return (
                                <div
                                  key={optIdx}
                                  className={`p-4 rounded-lg border-2 transition-colors ${
                                    isCorrect
                                      ? "bg-green-50 border-green-500"
                                      : "bg-white border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isCorrect ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </div>
                                    <span className="flex-1">{option}</span>
                                    {isCorrect && (
                                      <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                        Correct Answer
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="ml-12 text-gray-500 italic">
                            No options available for this question
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-xl text-gray-600">No questions available for this test</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600 mb-4 text-center">Review all questions and answers</p>
              <button
                onClick={() => setViewingTest(null)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl w-full"
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
          video={playingVideo}
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

export default CourseDetailsPage;