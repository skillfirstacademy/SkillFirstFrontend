import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "../../Componnets/VideoPlayer";

function UserCourseDetail() {
  const { courseId } = useParams(); // This will be the slug from the URL
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [testsMap, setTestsMap] = useState({}); // Map of videoId -> test data
  const [loading, setLoading] = useState(true);
  const [loadingTests, setLoadingTests] = useState(false);
  const [viewingTest, setViewingTest] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [activeStage, setActiveStage] = useState("beginner");

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course by slug
      const courseRes = await axios.get(`http://localhost:5000/api/courses/slug/${courseId}`);
      const courseData = courseRes.data?.course || courseRes.data;
      
      setCourse(courseData);

      // Fetch videos for this course
      const videosRes = await axios.get(`http://localhost:5000/api/videos/course/${courseData._id}`);
      const videosData = videosRes.data || [];
      
      setVideos(videosData);

      // Fetch tests for each video
      if (videosData.length > 0) {
        await fetchTestsForVideos(videosData);
      }

    } catch (err) {
      console.error("Error fetching course:", err);
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
          const response = await axios.get(`http://localhost:5000/api/tests/video/${video._id}`);
          if (response.data) {
            testsData[video._id] = response.data;
          }
        } catch (err) {
          // Test not found - that's okay
          if (err.response?.status !== 404) {
            console.error(`Error fetching test for video ${video._id}:`, err);
          }
        }
      });

      await Promise.all(testPromises);
      setTestsMap(testsData);

    } catch (err) {
      console.error("Error fetching tests:", err);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-700 mx-auto mb-4"></div>
          <p className="text-purple-700 font-semibold text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-600 text-2xl mb-4 font-bold">Course Not Found</p>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-700 text-white px-8 py-3 rounded-lg hover:bg-purple-800 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-purple-700 hover:text-purple-900 font-semibold transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </button>

        {/* COURSE HEADER */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            {course.thumbnail ? (
              <img
                src={`http://localhost:5000${course.thumbnail}`}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-600 to-purple-900"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {course.title}
              </h1>
              <p className="text-white/90 text-lg max-w-3xl">
                {course.description}
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold text-purple-900">{videos.length} Videos</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
                <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-semibold text-blue-900">{Object.keys(testsMap).length} Tests</span>
              </div>
              {course.isPaid ? (
                <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                  <span className="text-2xl">💰</span>
                  <span className="font-bold text-green-900">₹{course.price}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                  <span className="text-2xl">🎉</span>
                  <span className="font-bold text-green-900">Free Course</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STAGE TABS */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="flex gap-4 overflow-x-auto">
            {["beginner", "intermediate", "advanced"].map((stage) => (
              <button
                key={stage}
                onClick={() => setActiveStage(stage)}
                className={`px-6 py-3 rounded-lg font-semibold capitalize transition whitespace-nowrap ${
                  activeStage === stage
                    ? "bg-purple-700 text-white shadow-lg"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
              >
                {stage}
                <span className="ml-2 text-sm">
                  ({videoGroups[stage].length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* COURSE CONTENT */}
        <div className="space-y-6">
          {videoGroups[activeStage].length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No Content Yet
              </h3>
              <p className="text-gray-500">
                Content for this level is coming soon!
              </p>
            </div>
          ) : (
            videoGroups[activeStage].map((video, index) => {
              const test = testsMap[video._id];
              
              return (
                <div
                  key={video._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                >
                  {/* VIDEO SECTION */}
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-white">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-purple-900 mb-2">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-gray-600 mb-4">
                            {video.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{video.duration} mins</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium capitalize">
                              {video.stage}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handlePlayVideo(video)}
                          className="flex items-center gap-3 bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Watch Video
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* TEST SECTION */}
                  {loadingTests && !test ? (
                    <div className="p-6 bg-gray-50 border-t border-purple-100">
                      <p className="text-sm text-gray-500 text-center">
                        Loading test...
                      </p>
                    </div>
                  ) : test ? (
                    <div className="p-6 bg-blue-50 border-t border-purple-100">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h4 className="font-bold text-blue-900 text-lg">
                              Practice Test Available
                            </h4>
                          </div>
                          <p className="text-sm text-blue-700">
                            📋 {test.questions?.length || 0} questions
                            {test.passingScore && ` • ${test.passingScore}% to pass`}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleViewTest(test)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
                        >
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-purple-900">
                  Practice Test
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {viewingTest.questions?.length || 0} Questions
                  {viewingTest.passingScore && ` • ${viewingTest.passingScore}% to pass`}
                </p>
              </div>
              <button
                onClick={() => setViewingTest(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {viewingTest.questions && viewingTest.questions.length > 0 ? (
                <div className="space-y-6">
                  {viewingTest.questions.map((question, idx) => {
                    const questionText = question.question;
                    const options = question.options || [];
                    const correctAnswer = question.correctAnswer;
                    
                    return (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white"
                      >
                        <div className="flex gap-4 mb-4">
                          <span className="bg-purple-600 text-white text-sm px-4 py-2 rounded-full font-bold flex-shrink-0">
                            Q{idx + 1}
                          </span>
                          <p className="font-semibold text-gray-800 flex-1 text-lg">
                            {questionText}
                          </p>
                        </div>

                        {options.length > 0 ? (
                          <div className="ml-14 space-y-3">
                            {options.map((option, optIdx) => {
                              const isCorrect = correctAnswer === optIdx;
                              
                              return (
                                <div
                                  key={optIdx}
                                  className={`p-4 rounded-lg border-2 transition ${
                                    isCorrect
                                      ? 'bg-green-50 border-green-400'
                                      : 'bg-white border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className={`font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      isCorrect 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-200 text-gray-700'
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className={`flex-1 ${isCorrect ? 'text-green-900 font-medium' : 'text-gray-700'}`}>
                                      {option}
                                    </span>
                                    {isCorrect && (
                                      <span className="text-green-600 font-bold flex items-center gap-2">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Correct
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="ml-14 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                            ⚠️ No options available for this question
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12 text-lg">
                  No questions available
                </p>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => setViewingTest(null)}
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-lg transition"
              >
                Close
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