import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import { showError } from "../../Componnets/AppToaster";
import VideoPlayer from "../../Componnets/VideoPlayer";

function AdminCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [testsMap, setTestsMap] = useState({}); // Map of videoId -> test data
  const [loading, setLoading] = useState(true);
  const [loadingTests, setLoadingTests] = useState(false);
  const [viewingTest, setViewingTest] = useState(null); // For viewing test modal
  const [playingVideo, setPlayingVideo] = useState(null); // For video player modal

  useEffect(() => {
    fetchCourseOverview();
  }, [courseId]);

  const fetchCourseOverview = async () => {
    try {
      setLoading(true);
      
      // Step 1: Fetch course and videos
      const [courseRes, videosRes] = await Promise.all([
        adminApi.get(`/courses/${courseId}`),
        adminApi.get(`/videos/course/${courseId}`)
      ]);

      const courseData = courseRes.data?.course || courseRes.data;
      const videosData = videosRes.data || [];

      setCourse(courseData);
      setVideos(videosData);

      // Step 2: Fetch tests for each video
      if (videosData.length > 0) {
        await fetchTestsForVideos(videosData);
      }

    } catch (err) {
      console.error(err);
      showError("Failed to load course overview");
    } finally {
      setLoading(false);
    }
  };

  const fetchTestsForVideos = async (videosList) => {
    try {
      setLoadingTests(true);
      const testsData = {};

      // Fetch tests for each video (in parallel for better performance)
      const testPromises = videosList.map(async (video) => {
        try {
          const response = await adminApi.get(`/tests/video/${video._id}`);
          if (response.data) {
            testsData[video._id] = response.data;
          }
        } catch (err) {
          // Test not found for this video - that's okay
          if (err.response?.status !== 404) {
            console.error(`Error fetching test for video ${video._id}:`, err);
          }
        }
      });

      await Promise.all(testPromises);
      setTestsMap(testsData);

    } catch (err) {
      console.error("Error fetching tests:", err);
      showError("Failed to load some tests");
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

  // Count tests by stage
  const countTestsByStage = (stage) => {
    return videoGroups[stage].filter(video => testsMap[video._id]).length;
  };

  const handleViewTest = (test) => {
    setViewingTest(test);
  };

  const handlePlayVideo = (video) => {
    console.log("Playing video:", video);
    setPlayingVideo(video);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-purple-700 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">Course Not Found</p>
          <button
            onClick={() => navigate("/admin/courses")}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const totalTests = Object.keys(testsMap).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/admin/courses")}
          className="mb-4 flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium"
        >
          ← Back to All Courses
        </button>

        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 mb-6">
          <div className="flex gap-6">
            {course.thumbnail ? (
              <img
                src={`http://localhost:5000${course.thumbnail}`}
                alt={course.title}
                className="w-40 h-40 object-cover rounded-xl shadow-md"
              />
            ) : (
              <div className="w-40 h-40 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700">
                No Image
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-purple-900 mb-2">
                {course.title}
              </h1>

              <p className="text-gray-700 mb-4">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="bg-purple-50 px-3 py-1 rounded">
                  <span className="font-semibold">Created By:</span> {course.createdBy?.name || "Unknown"}
                </div>
                <div className="bg-purple-50 px-3 py-1 rounded">
                  <span className="font-semibold">Videos:</span> {videos.length}
                </div>
                <div className="bg-purple-50 px-3 py-1 rounded">
                  <span className="font-semibold">Tests:</span> {totalTests}
                </div>
                <div className={`px-3 py-1 rounded ${course.isPaid ? 'bg-purple-700 text-white' : 'bg-green-100 text-green-700'}`}>
                  {course.isPaid ? `₹${course.price}` : 'Free'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COURSE CONTENT BY STAGE */}
        {["beginner", "intermediate", "advanced"].map((level) => (
          <div key={level} className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-purple-800 capitalize flex items-center gap-3">
                <span className="bg-purple-100 px-4 py-1 rounded-full">
                  {level}
                </span>
                <span className="text-sm text-gray-500 font-normal">
                  {videoGroups[level].length} videos • {countTestsByStage(level)} tests
                </span>
              </h2>
            </div>

            {videoGroups[level].length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No content in this level yet
              </p>
            ) : (
              <div className="space-y-4">
                {videoGroups[level].map((video, index) => {
                  const test = testsMap[video._id];
                  
                  return (
                    <div
                      key={video._id}
                      className="border border-purple-200 rounded-lg overflow-hidden hover:shadow-md transition"
                    >
                      {/* VIDEO SECTION */}
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-white">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                VIDEO {index + 1}
                              </span>
                              <h3 className="font-semibold text-gray-800">
                                {video.title}
                              </h3>
                            </div>
                            {video.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {video.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                              <span>⏱️ {video.duration} mins</span>
                              {video.order && <span>Order: {video.order}</span>}
                            </div>
                            
                            {/* Play Video Button */}
                            <button
                              onClick={() => handlePlayVideo(video)}
                              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium transition"
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
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Play Video
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* TEST SECTION */}
                      {loadingTests && !test ? (
                        <div className="p-4 bg-gray-50 border-t border-purple-100">
                          <p className="text-sm text-gray-500 text-center">
                            Loading test...
                          </p>
                        </div>
                      ) : test ? (
                        <div className="p-4 bg-blue-50 border-t border-purple-100">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                  TEST
                                </span>
                                <h4 className="font-medium text-gray-800">
                                  Test for {video.title}
                                </h4>
                              </div>
                              <p className="text-xs text-gray-600">
                                📋 {test.questions?.length || 0} questions
                                {test.passingScore && ` • Passing: ${test.passingScore}%`}
                              </p>
                            </div>
                            <button 
                              onClick={() => handleViewTest(test)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                            >
                              View Test
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 border-t border-purple-100">
                          <p className="text-sm text-gray-500 text-center">
                            No test available for this video
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* EMPTY STATE */}
        {videos.length === 0 && (
          <div className="bg-white p-12 rounded-xl shadow-lg border border-purple-100 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-purple-900 mb-2">
              No Videos Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start building this course by adding videos
            </p>
            <button
              onClick={() => navigate(`/admin/add-videos?courseId=${courseId}`)}
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg"
            >
              Add Your First Video
            </button>
          </div>
        )}
      </div>

      {/* TEST VIEWER MODAL */}
      {viewingTest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-purple-900">
                  Test Questions
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {viewingTest.questions?.length || 0} Questions
                  {viewingTest.passingScore && ` • ${viewingTest.passingScore}% to pass`}
                </p>
              </div>
              <button
                onClick={() => setViewingTest(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
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
                        className="border border-gray-200 rounded-lg p-5 bg-gray-50"
                      >
                        <div className="flex gap-3 mb-4">
                          <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full font-medium flex-shrink-0">
                            Q{idx + 1}
                          </span>
                          <p className="font-medium text-gray-800 flex-1">
                            {questionText}
                          </p>
                        </div>

                        {options.length > 0 ? (
                          <div className="ml-12 space-y-2">
                            {options.map((option, optIdx) => {
                              const isCorrect = correctAnswer === optIdx;
                              
                              return (
                                <div
                                  key={optIdx}
                                  className={`p-3 rounded-lg border transition ${
                                    isCorrect
                                      ? 'bg-green-50 border-green-400 text-green-900'
                                      : 'bg-white border-gray-300 text-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className={`font-bold text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      isCorrect 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-200 text-gray-700'
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="flex-1">{option}</span>
                                    {isCorrect && (
                                      <span className="text-green-600 font-bold flex items-center gap-1">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
                          <div className="ml-12 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                            ⚠️ No options available for this question
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No questions available
                </p>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3">
              <button
                onClick={() => setViewingTest(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
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
            showError("Failed to play video");
            setPlayingVideo(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminCourseDetail;