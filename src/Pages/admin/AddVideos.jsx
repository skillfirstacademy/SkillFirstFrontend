import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../Componnets/AppToaster";
import adminApi from "../../api/adminApi";

function AddVideos() {
  const location = useLocation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Auto-select course from URL when courses are loaded
  useEffect(() => {
    if (courses.length > 0) {
      const params = new URLSearchParams(location.search);
      const courseId = params.get("courseId");
      
      if (courseId) {
        setSelectedCourse(courseId);
      }
    }
  }, [courses, location.search]);

  const fetchCourses = async () => {
    try {
      const res = await adminApi.get("/courses");
      const coursesData = res.data?.courses || res.data || [];
      setCourses(Array.isArray(coursesData) ? coursesData : []);
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
    formData.append("description", description);
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
      setDescription("");
      setVideoFile(null);
      setOrder(order + 1); // Auto-increment for next video
      setUploadProgress(0);
      document.getElementById("videoInput").value = "";
    } catch (err) {
      showError(err.response?.data?.message || "Failed to upload video");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="mb-4 text-purple-700 font-medium hover:text-purple-900 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-900">
              Upload Course Video
            </h1>
            <p className="text-purple-600 mt-2">
              Add videos to your course with detailed descriptions
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
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
              >
                <option value="">-- Choose a Course --</option>
                {Array.isArray(courses) && courses.map((course) => (
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
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter video description (what students will learn in this video)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Optional: Add a brief description of what this video covers
              </p>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Video Order *
              </label>
              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Order in which video appears in the course (1, 2, 3, etc.)
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

              {/* Show selected file info */}
              {videoFile && (
                <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-purple-900">{videoFile.name}</p>
                        <p className="text-xs text-purple-600">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        document.getElementById("videoInput").value = "";
                      }}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {loading && (
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex justify-between text-sm text-purple-600 mb-2">
                  <span className="font-medium">Uploading video...</span>
                  <span className="font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-purple-700 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  Please don't close this page while uploading
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 text-white font-semibold py-4 rounded-lg hover:bg-purple-800 transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Video
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Upload Guidelines
            </h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• H.265 (HEVC) videos will be automatically converted to H.264</li>
              <li>• Supported formats: MP4, MOV, AVI, MKV</li>
              <li>• Maximum file size: 500MB</li>
              <li>• Videos are displayed in the order you specify</li>
              <li>• Add descriptions to help students understand video content</li>
              <li>• Upload may take time depending on your internet speed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddVideos;