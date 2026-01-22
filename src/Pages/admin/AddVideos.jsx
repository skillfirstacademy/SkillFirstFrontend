import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { showSuccess, showError } from "../../Componnets/AppToaster";
import adminApi from "../../api/adminApi";

function AddVideos() {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [stage, setStage] = useState("beginner");
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch all courses on mount
  useEffect(() => {
    fetchCourses();
    
    // Get courseId from URL query parameters
    const params = new URLSearchParams(location.search);
    const courseIdFromUrl = params.get('courseId');
    
    if (courseIdFromUrl) {
      setSelectedCourse(courseIdFromUrl);
    }
  }, [location.search]);

  const fetchCourses = async () => {
    try {
      const res = await adminApi.get("/courses");
      setCourses(res.data?.courses || []);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to fetch courses");
       setCourses([]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["video/mp4", "video/mov", "video/avi", "video/mkv"];
      if (!validTypes.includes(file.type)) {
        showError("Please upload a valid video file (MP4, MOV, AVI, MKV)");
        e.target.value = "";
        return;
      }

      // Validate file size (max 500MB)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        showError("File size should not exceed 500MB");
        e.target.value = "";
        return;
      }

      setVideoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      showError("Please select a course");
      return;
    }

    if (!videoFile) {
      showError("Please select a video file");
      return;
    }

    if (!title.trim()) {
      showError("Please enter video title");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);
    formData.append("stage", stage);
    formData.append("order", order);

    try {
      const res = await adminApi.post(
        `/videos/${selectedCourse}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      showSuccess("Video uploaded successfully!");
      
      // Reset form (but keep the selected course if it came from URL)
      setTitle("");
      setVideoFile(null);
      setStage("beginner");
      setOrder(1);
      setUploadProgress(0);
      document.getElementById("videoInput").value = "";
    } catch (err) {
      showError(err.response?.data?.message || "Failed to upload video");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-900">
              Upload Course Video
            </h1>
            <p className="text-purple-600 mt-2">
              Add videos to your course with stage selection
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Course */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Select Course *
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">-- Choose a Course --</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Video Title */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Video Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Introduction to Variables"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Stage Selection */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Stage *
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setStage("beginner")}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    stage === "beginner"
                      ? "bg-purple-700 text-white"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  Beginner
                </button>
                <button
                  type="button"
                  onClick={() => setStage("intermediate")}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    stage === "intermediate"
                      ? "bg-purple-700 text-white"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  Intermediate
                </button>
                <button
                  type="button"
                  onClick={() => setStage("advanced")}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    stage === "advanced"
                      ? "bg-purple-700 text-white"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Video Order
              </label>
              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Order in which video appears in the stage
              </p>
            </div>

            {/* Video File */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Video File *
              </label>
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 transition">
                <input
                  id="videoInput"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="videoInput"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="w-12 h-12 text-purple-400 mb-3"
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
                  <span className="text-purple-600 font-medium">
                    {videoFile
                      ? videoFile.name
                      : "Click to upload or drag and drop"}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    MP4, MOV, AVI, MKV (max 500MB)
                  </span>
                </label>
              </div>
            </div>

            {/* Upload Progress */}
            {loading && (
              <div>
                <div className="flex justify-between text-sm text-purple-600 mb-2">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-3">
                  <div
                    className="bg-purple-700 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 text-white font-semibold py-4 rounded-lg hover:bg-purple-800 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload Video"}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">
              📝 Upload Guidelines
            </h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• H.265 (HEVC) videos will be automatically converted to H.264</li>
              <li>• Supported formats: MP4, MOV, AVI, MKV</li>
              <li>• Maximum file size: 500MB</li>
              <li>• Videos are organized by stages: Beginner, Intermediate, Advanced</li>
              <li>• Set order to control video sequence within each stage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddVideos;