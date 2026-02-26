import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import { showError } from "../../Componnets/AppToaster";
import VideoPlayer from "../../Componnets/VideoPlayer";
import { Play, Trash2, Edit2, FileText } from "lucide-react";

function AdminCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [testsMap, setTestsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewingTest, setViewingTest] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: 0,
    level: "Beginner",
    isPaid: false,
  });

  useEffect(() => {
    fetchCourseOverview();
  }, [courseId]);

  const fetchCourseOverview = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseRes = await adminApi.get(`/courses/${courseId}`);
      setCourse(courseRes.data?.course || courseRes.data);

      // Fetch videos - handle 404 gracefully
      try {
        const videosRes = await adminApi.get(`/videos/course/${courseId}`);
        const videosList = videosRes.data || [];
        setVideos(videosList);

        if (videosList.length > 0) {
          fetchTestsForVideos(videosList);
        }
      } catch (videoError) {
        // If videos endpoint returns 404 or any error, just set empty array
        setVideos([]);
      }

    } catch (error) {
      console.error("Error fetching course:", error);
      showError("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const fetchTestsForVideos = async (videosList) => {
    const map = {};
    await Promise.all(
      videosList.map(async (video) => {
        try {
          const res = await adminApi.get(`/tests/video/${video._id}`);
          map[video._id] = res.data;
        } catch { }
      })
    );
    setTestsMap(map);
  };

  const openEditModal = () => {
    setEditForm({
      title: course.title,
      description: course.description,
      price: course.price || 0,
      level: course.level,
      isPaid: course.isPaid,
    });

    setThumbnailPreview(
      course.thumbnail
        ? `http://video-api.skillfirstacademy.com${course.thumbnail}`
        : ""
    );

    setThumbnailFile(null);
    setShowEditModal(true);
  };


  const handleDeleteCourse = async () => {
    if (!window.confirm("Delete course with all videos & tests?")) return;
    try {
      await adminApi.delete(`/courses/${courseId}`);
      navigate("/admin/courses");
    } catch {
      showError("Failed to delete course");
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await adminApi.delete(`/admin/videos/${id}`);
      setVideos(videos.filter((v) => v._id !== id));
    } catch {
      showError("Failed to delete video");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-700">
        Loading course…
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="text-purple-700 font-medium"
        >
          ← Back 
        </button>

        {/* COURSE HEADER */}
        <div className="bg-white rounded-2xl shadow p-6 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={openEditModal}
              className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleDeleteCourse}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-6">
            {course.thumbnail && (
              <img
                src={`http://video-api.skillfirstacademy.com${course.thumbnail}`}
                alt={course.title}
                className="w-36 h-36 rounded-xl object-cover border"
              />
            )}

            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-gray-600 mt-2">{course.description}</p>

              <div className="flex gap-3 mt-4 text-sm">
                <span className="px-3 py-1 bg-purple-100 rounded-full">
                  {videos.length} Videos
                </span>
                <span className="px-3 py-1 bg-purple-100 rounded-full">
                  {course.isPaid ? `₹${course.price}` : "Free"}
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full">
                  {course.level}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* VIDEOS */}
        <Section
          title="Course Videos"
          videos={videos}
          testsMap={testsMap}
          onPlay={setPlayingVideo}
          onViewTest={setViewingTest}
          onEdit={(id) => navigate(`/admin/all-videos?courseId=${course._id}`)}
          addvid={() => navigate(`/admin/add-videos?courseId=${course._id}`)}
          onDelete={handleDeleteVideo}
          onCreateTest={(id) => navigate(`/admin/tests/create/${id}`)}
        />
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-xl">
            <div className="p-6 border-b flex justify-between">
              <h2 className="text-xl font-bold">Edit Course</h2>
              <button onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <div className="p-6 space-y-4">
              <label className="text-sm text-gray-600">Thumbnail</label>

              <div className="flex justify-between items-center w-full  ">
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className=" h-40 text-center object-cover rounded-lg border mb-2"
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setThumbnailFile(file);
                  setThumbnailPreview(URL.createObjectURL(file));
                }}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Title"
              />

              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                rows={3}
              />

              <select
                value={editForm.level}
                onChange={(e) =>
                  setEditForm({ ...editForm, level: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={editForm.isPaid}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isPaid: e.target.checked })
                  }
                />
                Paid Course
              </label>

              {editForm.isPaid && (
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      price: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const formData = new FormData();

                    formData.append("title", editForm.title);
                    formData.append("description", editForm.description);
                    formData.append("level", editForm.level);
                    formData.append("isPaid", editForm.isPaid);
                    formData.append("price", editForm.price);

                    if (thumbnailFile) {
                      formData.append("thumbnail", thumbnailFile);
                    }

                    await adminApi.put(
                      `/courses/${course._id}`,
                      formData,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    );

                    setShowEditModal(false);
                    fetchCourseOverview();
                  } catch (err) {
                    console.error(err);
                    showError("Failed to update course");
                  }
                }}
                className="px-5 py-2 bg-purple-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PLAYER */}
      {playingVideo && (
        <VideoPlayer
          videoUrl={`http://video-api.skillfirstacademy.com/api/videos/${playingVideo._id}/stream`}
          title={playingVideo.title}
          onClose={() => setPlayingVideo(null)}
        />
      )}

      {/* TEST VIEW */}
      {viewingTest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full">
            <h2 className="text-xl font-bold mb-4">Test Questions</h2>
            {viewingTest.questions.map((q, i) => (
              <p key={i}>{i + 1}. {q.question}</p>
            ))}
            <button
              onClick={() => setViewingTest(null)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- SECTION ---------------- */

const Section = ({
  title,
  videos,
  testsMap,
  onPlay,
  onViewTest,
  onEdit,
  addvid,
  onDelete,
  onCreateTest,
}) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <h2 className="text-2xl font-bold mb-6">
      {title} ({videos.length})
    </h2>

    {videos.length === 0 ? (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Videos Yet
        </h3>
        <p className="text-gray-500 mb-6">
          Videos are coming soon for this course
        </p>
        <button
          onClick={addvid}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Add First Video
        </button>
      </div>
    ) : (
      videos.map((video, idx) => {
        const test = testsMap[video._id];
        return (
          <div
            key={video._id}
            className="border rounded-xl p-4 flex justify-between mb-4"
          >
            <div>
              <p className="font-semibold">
                {idx + 1}. {video.title}
              </p>

              <div className="flex gap-4 mt-2 text-sm">
                <button onClick={() => onPlay(video)} className="text-purple-600">
                  ▶ Play
                </button>

                {test ? (
                  <button onClick={() => onViewTest(test)} className="text-blue-600">
                    View Test
                  </button>
                ) : (
                  <button onClick={() => onCreateTest(video._id)} className="text-green-600">
                    + Create Test
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => onEdit(video._id)} className="bg-yellow-500 px-3 text-white rounded">
                Edit
              </button>
            </div>
          </div>
        );
      })
    )}
  </div>
);

export default AdminCourseDetail;