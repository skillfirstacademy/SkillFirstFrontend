import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import VideoPlayer from "../Componnets/VideoPlayer";
import { showError, showSuccess } from "../Componnets/AppToaster";
import adminApi from "../api/adminApi";
import StudentVideoplayer from "../Componnets/StudentVideoplayer";


function CourseDetailsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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
  const [testAttempts, setTestAttempts] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [showPassedModal, setShowPassedModal] = useState(false);
  const [passedTestData, setPassedTestData] = useState(null);

  // Handle test passed state from navigation
  useEffect(() => {
    if (location.state?.testPassed && location.state?.testData) {
      setPassedTestData(location.state.testData);
      setShowPassedModal(true);
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  useEffect(() => {
    if (!courseId || courseId === "undefined") {
      console.error("Invalid course ID:", courseId);
      setLoading(false);
      return;
    }
    fetchCourseData();
  }, [courseId]);

  const isVideoCompleted = (videoId) => {
    // Backend truth (Enrollment)
    if (Array.isArray(enrollmentData?.progress?.watchedVideos)) {
      return enrollmentData.progress.watchedVideos
        .map(id => id.toString())
        .includes(videoId);
    }

    // Local fallback (instant UI update)
    return completedVideos.has(videoId);
  };

  const fetchTestAttempts = async () => {
    try {
      const res = await adminApi.get("/test-attempt/my");
      // console.log("testatt", res.data)
      setTestAttempts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch test attempts");
    }
  };

  useEffect(() => {
    if (isEnrolled) {
      fetchTestAttempts();
    }
  }, [isEnrolled]);

  const isTestPassed = (videoId) => {
    if (!videoId) return false;

    const passed = testAttempts.some(
      (attempt) =>
        attempt.videoId?._id?.toString() === videoId.toString() &&
        attempt.isPassed === true
    );
    
    // console.log(`Checking test passed for video ${videoId}:`, passed);
    return passed;
  };

  const getTestPassedDate = (videoId) => {
    if (!videoId) return null;

    const passedAttempt = testAttempts.find(
      (attempt) =>
        attempt.videoId?._id?.toString() === videoId.toString() &&
        attempt.isPassed === true
    );

    return passedAttempt?.completedAt || passedAttempt?.createdAt;
  };

  const canUnlockNextVideo = (videoIndex) => {
    if (!isEnrolled || !enrollmentData) return false;
    
    // Backend controls unlocking via currentDay (updated by cron job)
    // Each video unlocks one day at a time
    const currentDay = enrollmentData.progress?.currentDay || 1;
    
    // Video at index 0 requires currentDay >= 1
    // Video at index 1 requires currentDay >= 2, etc.
    const requiredDay = videoIndex + 1;
    
    // console.log(`Video ${videoIndex} requires day ${requiredDay}, current day: ${currentDay}`);
    
    return currentDay >= requiredDay;
  };

  const getUnlockTimeRemaining = (videoIndex) => {
    if (!enrollmentData || videoIndex === 0) return null;

    const currentDay = enrollmentData.progress?.currentDay || 1;
    const requiredDay = videoIndex + 1;

    // If already unlocked, no timer needed
    if (currentDay >= requiredDay) return null;

    // Calculate time until next unlock (cron runs every 10 minutes for testing)
    const now = new Date();
    
    // For testing: next run is within 10 minutes
    const minutes = now.getMinutes();
    const nextInterval = Math.ceil(minutes / 10) * 10;
    const nextRun = new Date(now);
    
    if (nextInterval === 60) {
      nextRun.setHours(nextRun.getHours() + 1);
      nextRun.setMinutes(0);
    } else {
      nextRun.setMinutes(nextInterval);
    }
    nextRun.setSeconds(0);
    nextRun.setMilliseconds(0);

    // Calculate how many days away this video is
    const daysRemaining = requiredDay - currentDay;
    
    // Approximate time until this video unlocks
    // Each day unlocks after the cron runs, so multiply by 10 minutes per day
    const timeUntilThisVideo = nextRun - now + ((daysRemaining - 1) * 10 * 60 * 1000);
    
    if (timeUntilThisVideo <= 0) return null;

    const hours = Math.floor(timeUntilThisVideo / (1000 * 60 * 60));
    const minutes_remaining = Math.floor((timeUntilThisVideo % (1000 * 60 * 60)) / (1000 * 60));

    return { 
      hours, 
      minutes: minutes_remaining, 
      unlockDate: new Date(now.getTime() + timeUntilThisVideo),
      daysRemaining
    };
  };

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
  const users = JSON.parse(localStorage.getItem("user"));
  const userId = users?._id;

  const checkEnrollmentStatus = async (courseId) => {
    try {
      const response = await adminApi.get(`/students/enrollment/${courseId}`);
      if (response.data.success && response.data.enrollment) {
        setIsEnrolled(true);
        setEnrollmentData(response.data.enrollment);

        // Update completed videos from enrollment progress
        if (response.data.enrollment.progress?.watchedVideos) {
          setCompletedVideos(new Set(response.data.enrollment.progress.watchedVideos));
        }
      } else {
        setIsEnrolled(false);
        setEnrollmentData(null);
      }
    } catch (error) {
      // console.log("Not enrolled or error checking enrollment");
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
        courseLevel: course.level,
        courseAmount: course.isPaid ? course.price : 0,
      };

      // console.log("📧 Sending enrollment request:", enrollmentData);

      const response = await adminApi.post(
        "/students/buy/enroll",
        enrollmentData
      );

      if (response.data.success) {
        showSuccess(response.data.message || "Enrollment successful!");
        setIsEnrolled(true);

        // Set enrollment data from response
        if (response.data.enrollment) {
          setEnrollmentData(response.data.enrollment);
        }

        // Refresh enrollment status
        await checkEnrollmentStatus(course._id);
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
    return canUnlockNextVideo(videoIndex);
  };

  const handlePlayVideo = (video, videoIndex) => {
    if (!isEnrolled) {
      showError("Please enroll in this course to watch videos");
      return;
    }

    if (!isVideoUnlocked(videoIndex)) {
      const timeRemaining = getUnlockTimeRemaining(videoIndex);
      const currentDay = enrollmentData?.progress?.currentDay || 1;
      const requiredDay = videoIndex + 1;
      
      if (timeRemaining) {
        const daysText = timeRemaining.daysRemaining > 1 
          ? `${timeRemaining.daysRemaining} days` 
          : 'tomorrow';
        showError(
          `This video unlocks ${daysText}. Next unlock in ${timeRemaining.hours}h ${timeRemaining.minutes}m`
        );
      } else {
        showError(`This video unlocks on Day ${requiredDay}. You're currently on Day ${currentDay}.`);
      }
      return;
    }

    setPlayingVideo(video);
  };

  const downloadCertificate = async () => {
    try {
      const res = await adminApi.get(
        `/students/certificate/${courseId}`,
        { responseType: "blob" } // 👈 VERY IMPORTANT
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "certificate.pdf";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      showError("Failed to download certificate");
    }
  };

  const handleTestPassed = (testData) => {
    setPassedTestData(testData);
    setShowPassedModal(true);
    fetchTestAttempts(); // Refresh test attempts
  };

  const toggleVideoExpand = (videoId) => {
    setExpandedVideo(expandedVideo === videoId ? null : videoId);
  };

  const calculateProgress = () => {
    if (videos.length === 0) return 0;

    // Use enrollment data if available
    if (enrollmentData?.progress) {
      const watchedCount = enrollmentData.progress.watchedVideos?.length || 0;
      const totalVideos = enrollmentData.progress.totalVideos || videos.length;
      return Math.round((watchedCount / totalVideos) * 100);
    }

    // Fallback to local state
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
      {/* TEST PASSED MODAL */}
      {showPassedModal && passedTestData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            {/* Green gradient header */}
            <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-8 text-center relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
              </div>
              
              {/* Success icon */}
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce-slow">
                  <svg className="w-14 h-14 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">🎉 Congratulations!</h2>
              <p className="text-green-50 text-lg">You've passed the test!</p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Your Score:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {passedTestData.score}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Passing Score:</span>
                    <span className="text-lg font-semibold text-gray-600">
                      {passedTestData.passingScore}%
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-amber-900 font-semibold mb-1">Next Video Unlocks In:</p>
                      <p className="text-amber-700 text-sm">
                        24 hours from now. Come back tomorrow to continue your learning journey!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowPassedModal(false);
                  setPassedTestData(null);
                  fetchCourseData(); // Refresh the page data
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}

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
                  Enrolled • {enrollmentData?.payment?.status === 'paid' ? 'Fully Paid' : enrollmentData?.payment?.status || 'Active'}
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
                  src={`http://localhost:5000${course.thumbnail}`}
                  alt={course.title}
                  className="rounded-2xl shadow-2xl max-w-full h-auto object-cover"
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
        {isEnrolled && enrollmentData && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Your Progress</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
                  📅 Day {enrollmentData.progress?.currentDay || 1}
                </span>
                <span className="text-sm text-gray-600">
                  {enrollmentData.progress?.watchedVideos?.length || 0} of {enrollmentData.progress?.totalVideos || videos.length} videos completed
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-6">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${progress}%` }}
              >
                <span className="text-xs font-bold text-white">{progress}%</span>
              </div>
            </div>

            {/* Additional Stats - Always Show */}
            {enrollmentData.progress && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {console.log("first", enrollmentData)}
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{enrollmentData.progress.streak || 0}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{enrollmentData.progress.wordsLearned || 0}</div>
                  <div className="text-sm text-gray-600">Words Learned</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{enrollmentData.progress.fluencyPercent || 0}%</div>
                  <div className="text-sm text-gray-600">Fluency</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{enrollmentData.progress.certificatesEarned || 0}</div>
                  <div className="text-sm text-gray-600">Certificates</div>
                </div>
              </div>
            )}

            {/* Certificate Section - Check both status and progress.completed */}
            {(enrollmentData?.status === 'completed' || enrollmentData?.progress?.completed === true) ? (
              <div className="mt-6">
                {enrollmentData?.payment?.status === 'paid' ? (
                  <button
                    onClick={downloadCertificate}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    🎓 Download Certificate
                  </button>
                ) : (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-red-600 mb-2">
                          Payment Pending
                        </h4>
                        <p className="text-gray-700 mb-4">
                          <span className="text-green-600 font-semibold">🎉 Congratulations on completing the course!</span>
                          <br />
                          To download your certificate, please complete the payment.
                        </p>
                        <div className="bg-white rounded-lg p-4 mb-4 border border-red-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 font-medium">Course Amount:</span>
                            <span className="text-xl font-bold text-gray-900">
                              ₹{course?.price || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Paid Amount:</span>
                            <span className="text-lg font-semibold text-green-600">
                              ₹{enrollmentData?.payment?.amount || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t">
                            <span className="text-gray-700 font-medium">Balance Due:</span>
                            <span className="text-xl font-bold text-red-600">
                              ₹{(course?.price || 0) - (enrollmentData?.payment?.amount || 0)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t">
                            <span className="text-gray-700 font-medium">Payment Status:</span>
                            <span className="text-sm font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                              {enrollmentData?.payment?.status?.toUpperCase() || 'PENDING'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-center">
                          <p className="text-amber-800 font-medium flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Please contact admin to complete payment
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                <p className="text-blue-800 font-medium">
                  📚 Keep learning! Complete all videos to unlock your certificate.
                </p>
              </div>
            )}
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
                const isCompleted = isVideoCompleted(video._id);
                const isUnlocked = isVideoUnlocked(index);
                const testPassed = test ? isTestPassed(video._id) : false;
                const timeUntilUnlock = getUnlockTimeRemaining(index);

                return (
                  <div key={video._id} className="border-2 border-gray-200 hover:border-purple-300 rounded-xl overflow-hidden transition-all">
                    <button
                      onClick={() => toggleVideoExpand(video._id)}
                      className="w-full p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      {/* Video Thumbnail or Number Badge */}
                      <div className="relative flex-shrink-0">
                        {video.thumbnail ? (
                          <div className="relative w-32 h-20 rounded-lg overflow-hidden">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            {/* Play Icon Overlay */}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                            {/* Video Number Badge */}
                            <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                              {index + 1}
                            </div>
                            {/* Lock/Unlock Badge */}
                            {!isUnlocked && (
                              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                🔒
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : !isUnlocked
                              ? "bg-gray-400 text-white"
                              : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
                          }`}>
                            {!isUnlocked ? "🔒" : isCompleted ? "✓" : index + 1}
                          </div>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-semibold text-gray-800">
                            {video.title}
                          </h4>
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                            Day {index + 1}
                          </span>
                          {testPassed && (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Test Passed
                            </span>
                          )}
                        </div>
                        {video.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                        {/* Video Duration or Source */}
                        {(video.duration || video.source) && (
                          <div className="flex items-center gap-3 mt-2">
                            {video.duration && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {video.duration}
                              </span>
                            )}
                            {video.source && (
                              <span className="text-xs text-purple-600 font-medium">
                                {video.source}
                              </span>
                            )}
                          </div>
                        )}
                        {/* Unlock Timer */}
                        {timeUntilUnlock && (
                          <div className="mt-2 inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Unlocks in {timeUntilUnlock.hours}h {timeUntilUnlock.minutes}m
                          </div>
                        )}
                      </div>

                      {/* Expand Icon */}
                      <svg
                        className={`w-6 h-6 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-6 pb-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                        {/* Practice Test Info */}
                        {test && isVideoCompleted(video._id) && (
                          <div className={`rounded-lg p-4 border-2 ${
                            testPassed
                              ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                              : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                          }`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                testPassed ? "bg-green-600" : "bg-blue-600"
                              }`}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  {testPassed ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  )}
                                </svg>
                              </div>
                              <div className="flex-1">
                                <h5 className={`font-semibold mb-1 ${testPassed ? "text-green-900" : "text-blue-900"}`}>
                                  {testPassed ? "✅ Test Passed!" : "Practice Test Available"}
                                </h5>
                                <p className={`text-sm mb-3 ${testPassed ? "text-green-700" : "text-blue-700"}`}>
                                  {testPassed
                                    ? "Great job! You've successfully passed this test."
                                    : `Test your knowledge with ${test.questions?.length || 0} questions${test.passingScore ? ` • ${test.passingScore}% passing score` : ""}`
                                  }
                                </p>
                                {!testPassed && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/student/test/${video._id}`);
                                    }}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                                  >
                                    Start Test
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Call to Action */}
                        <div className="pt-2">
                          {isEnrolled ? (
                            isUnlocked ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlayVideo(video, index);
                                }}
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                              >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                                Watch Video
                              </button>
                            ) : (
                              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center">
                                <p className="text-amber-800 font-medium mb-2">
                                  🔒 {timeUntilUnlock
                                    ? `This video unlocks ${timeUntilUnlock.daysRemaining > 1 ? `in ${timeUntilUnlock.daysRemaining} days` : 'tomorrow'} (Day ${index + 1})`
                                    : `This video unlocks on Day ${index + 1}. You're currently on Day ${enrollmentData?.progress?.currentDay || 1}.`
                                  }
                                </p>
                                {timeUntilUnlock && (
                                  <p className="text-sm text-amber-600">
                                    Next unlock in approximately {timeUntilUnlock.hours}h {timeUntilUnlock.minutes}m
                                  </p>
                                )}
                                <p className="text-xs text-amber-600 mt-2">
                                  💡 Videos unlock automatically each day via our system
                                </p>
                              </div>
                            )
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEnrollClick(course.level);
                              }}
                              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Enroll to Watch {course.isPaid && `- ₹${course.price}`}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Enrollment CTA Section for non-enrolled users */}
        {!isEnrolled && videos.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white text-center">
            <h3 className="text-3xl font-bold mb-3">Ready to Start Learning?</h3>
            <p className="text-lg text-white/90 mb-6">
              Enroll now to access all {videos.length} videos, practice tests, and earn your certificate
            </p>
            <button
              onClick={() => handleEnrollClick(course.level)}
              disabled={enrollingLevel === "enrolling"}
              className="inline-flex items-center justify-center gap-3 bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enrollingLevel === "enrolling" ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-purple-600"></div>
                  Enrolling...
                </>
              ) : (
                <>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Enroll Now {course.isPaid && `- ₹${course.price}`}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* VIDEO PLAYER MODAL */}
      {playingVideo && (
        <StudentVideoplayer
          videoUrl={`https://skillfirstbackend.onrender.com/api/videos/${playingVideo._id}/stream`}
          title={playingVideo.title}
          videoId={playingVideo._id}
          courseId={courseId}
          onClose={() => {
            setPlayingVideo(null);
            checkEnrollmentStatus(courseId);
          }}
          onComplete={(data) => {
            console.log("Video completed:", data);
            setCompletedVideos(prev => new Set([...prev, data.videoId]));
            checkEnrollmentStatus(courseId);
            showSuccess("Great job! Video completed 🎉");
          }}
          onError={(err) => {
            showError("Failed to play video");
            setPlayingVideo(null);
          }}
        />
      )}

    </div>
  );
}

export default CourseDetailsPage;