import React, { useState, useEffect } from "react";
import { showSuccess, showError } from "../../Componnets/AppToaster";
import adminApi from "../../api/adminApi";
import VideoPlayer from "../../Componnets/VideoPlayer";
import { useSearchParams } from "react-router-dom";

function AllVideos() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videosLoading, setVideosLoading] = useState(false);
  const [selectedStage, setSelectedStage] = useState("all");
  const [editingVideo, setEditingVideo] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const courseIdFromUrl = searchParams.get("courseId");
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    order: 1,
    videoFile: null,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
  if (!courseIdFromUrl || courses.length === 0) return;

  const course = courses.find((c) => c._id === courseIdFromUrl);

  if (course) {
    setSelectedCourse(course);
    setSelectedStage("all");
    fetchVideos(course._id);
  }
}, [courseIdFromUrl, courses]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/courses");
      const coursesData = res.data?.courses || res.data || [];
      setCourses(Array.isArray(coursesData) ? coursesData : []);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to fetch courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async (courseId, stage = "all") => {
    if (!courseId) {
      console.warn("fetchVideos called without courseId");
      setVideos([]);
      return;
    }

    setVideosLoading(true);

    try {
      const url =
        stage === "all"
          ? `/videos/course/${courseId}`
          : `/videos/course/${courseId}?stage=${stage}`;

      const res = await adminApi.get(url);
      setVideos(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setVideos([]);
      } else {
        showError(err.response?.data?.message || "Failed to fetch videos");
      }
    } finally {
      setVideosLoading(false);
    }
  };


  const fetchTest = async (videoId) => {
    setTestLoading(true);
    try {
      const res = await adminApi.get(`/tests/video/${videoId}`);
      setSelectedTest(res.data);
      showSuccess("Test loaded");
    } catch (err) {
      showError(err.response?.data?.message || "No test found for this video");
      setSelectedTest(null);
    } finally {
      setTestLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setSelectedStage("all");
    fetchVideos(course._id);
  };

  const handleStageFilter = (stage) => {
    setSelectedStage(stage);
    if (selectedCourse) {
      fetchVideos(selectedCourse._id, stage);
    }
  };

  const handleDeleteVideo = async (courseId, videoId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      await adminApi.delete(`/videos/${courseId}/${videoId}`);
      showSuccess("Video deleted successfully");
      fetchVideos(selectedCourse._id, selectedStage);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete video");
    }
  };

  const handleEditClick = (video, e) => {
    e.stopPropagation();
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      description: video.description || "",
      order: video.order,
    });
  };

  const handleVideoClick = (video) => {
    console.log("Playing video:", video);
    setPlayingVideo(video);
  };
  console.log("edi", editingVideo)

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const videoId = editingVideo._id;
    const courseId = editingVideo.courseId; // 🔥 IMPORTANT

    const formData = new FormData();
    formData.append("title", editForm.title);
    formData.append("description", editForm.description);
    formData.append("order", editForm.order);

    if (editForm.videoFile) {
      formData.append("video", editForm.videoFile);
    }

    await adminApi.put(
      `/videos/${videoId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setEditingVideo(null);
    fetchVideos(courseId); // ✅ PASS IT
  };


  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "N/A";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900">
            All Course Videos
          </h1>
          <p className="text-purple-600 mt-2">
            Manage videos across all your courses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Courses Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
              <h2 className="text-lg font-semibold text-purple-900 mb-4">
                Courses
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {courses.map((course) => (
                    <button
                      key={course._id}
                      onClick={() => handleCourseClick(course)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${selectedCourse?._id === course._id
                        ? "bg-purple-700 text-white"
                        : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                        }`}
                    >
                      <div className="font-medium truncate">{course.title}</div>
                      <div
                        className={`text-sm ${selectedCourse?._id === course._id
                          ? "text-purple-200"
                          : "text-purple-500"
                          }`}
                      >
                        {course.description?.substring(0, 30)}...
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Videos Content */}
          <div className="lg:col-span-3">
            {!selectedCourse ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <svg
                  className="w-16 h-16 text-purple-300 mx-auto mb-4"
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
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Select a Course
                </h3>
                <p className="text-gray-500">
                  Choose a course from the sidebar to view its videos
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Course Header */}
                <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-xl shadow-md p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedCourse.title}
                  </h2>
                  <p className="text-purple-200">
                    {selectedCourse.description}
                  </p>
                </div>

                {/* Stage Filter */}
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex flex-wrap gap-3">
                    <button
                      // onClick={() => handleStageFilter("all")}
                      className={`px-4 py-2 rounded-lg font-medium transition ${selectedStage === "all"
                        ? "bg-purple-700 text-white"
                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                    >
                      {selectedCourse.level}
                    </button>
                  </div>
                </div>

                {/* Videos List */}
                {videosLoading ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading videos...</p>
                  </div>
                ) : videos.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Videos Found
                    </h3>
                    <p className="text-gray-500">
                      No videos available for this course and stage
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videos.map((video) => (
                      <div
                        key={video._id}
                        onClick={() => handleVideoClick(video)}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                #{video.order}
                              </span>
                              {video.stage && (
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                                  {video.stage}
                                </span>
                              )}
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {video.title}
                            </h3>

                            {/* Video Description */}
                            {video.description && (
                              <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                                {video.description}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
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
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                  />
                                </svg>
                                {formatFileSize(video.size)}
                              </div>
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-sm text-purple-600">
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
                              Click to play video
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={(e) => handleEditClick(video, e)}
                              className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                              title="Edit"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={(e) =>
                                handleDeleteVideo(
                                  selectedCourse._id,
                                  video._id,
                                  e,
                                )
                              }
                              className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                              title="Delete"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                fetchTest(video._id);
                              }}
                              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                              title="View Test"
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
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingVideo && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              Edit Video
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Update Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setEditForm({ ...editForm, videoFile: e.target.files[0] })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  placeholder="Enter video description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={editForm.order}
                  onChange={(e) =>
                    setEditForm({ ...editForm, order: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTest && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">Test Details</h2>

            <p className="text-lg font-semibold mb-2">
              Stage: {selectedTest.stage.toUpperCase()}
            </p>
            <p className="text-sm mb-4">
              Passing Score: {selectedTest.passingScore}%
            </p>

            <h3 className="text-xl font-bold mb-3">Questions</h3>

            {selectedTest.questions.map((q, idx) => (
              <div key={idx} className="border rounded-lg p-4 mb-4 bg-purple-50">
                <p className="font-semibold mb-2">
                  Q{idx + 1}. {q.question}
                </p>
                <ul className="ml-4 space-y-1">
                  <li>A. {q.optionA}</li>
                  <li>B. {q.optionB}</li>
                  <li>C. {q.optionC}</li>
                  <li>D. {q.optionD}</li>
                </ul>
                <p className="font-bold text-green-600 mt-2">
                  ✔ Correct Answer: Option {q.correctAnswer}
                </p>
              </div>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedTest(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideo && (
        <VideoPlayer
          videoUrl={`https://skillfirstbackend.onrender.com/api/videos/${playingVideo._id}/stream`}
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

export default AllVideos;