import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../Componnets/AppToaster";

function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: 0,
    isPaid: false,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await adminApi.get("/courses");
      setCourses(res.data.courses || res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddVideo = (courseId) => {
    navigate(`/admin/add-videos?courseId=${courseId}`);
  };

  const handleOpenCourseDetail = (courseId) => {
    navigate(`/admin/courses/${courseId}`);
  };

  const handleEditClick = (course, e) => {
    e.stopPropagation();
    setEditingCourse(course);
    setEditForm({
      title: course.title,
      description: course.description,
      price: course.price || 0,
      isPaid: course.isPaid,
      isActive: course.isActive !== undefined ? course.isActive : true,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editForm.title.trim()) return showError("Course title is required");
    if (!editForm.description.trim())
      return showError("Course description is required");
    if (editForm.isPaid && (!editForm.price || editForm.price <= 0))
      return showError("Please enter a valid price");

    setSaving(true);

    try {
      const updateData = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        price: editForm.isPaid ? Number(editForm.price) : 0,
        isPaid: editForm.isPaid,
        isActive: editForm.isActive,
      };

      await adminApi.put(`/courses/${editingCourse._id}`, updateData);

      showSuccess("Course updated successfully!");

      setCourses(
        courses.map((c) =>
          c._id === editingCourse._id ? { ...c, ...updateData } : c,
        ),
      );

      setEditingCourse(null);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId, title) => {
    if (!window.confirm(`Delete "${title}" permanently?`)) return;

    setDeletingCourseId(courseId);

    try {
      await adminApi.delete(`/courses/${courseId}`);
      showSuccess("Course deleted!");
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeletingCourseId(null);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-700">
        Loading courses...
      </div>
    );
  }

  // NO COURSES
  if (courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-700">
        No courses available yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          {/* HEADER */}
          <h1 className="text-3xl font-bold text-purple-900 mb-2">
            All Courses
          </h1>
          <p className="text-purple-600 mb-8">Manage your course library</p>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
  key={course._id}
  onClick={(e) => {
    // Prevent navigation if clicking on buttons
    if (e.target.closest('button')) return;
    handleOpenCourseDetail(course._id);
  }}
  className="relative group border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-purple-50 cursor-pointer"
>
                {/* Thumbnail */}
                {course.thumbnail ? (
                  <img
                    src={`https://skillfirstbackend.onrender.com${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-lg mb-4 shadow-md"
                  />
                ) : (
                  <div className="w-full h-40 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center mb-4">
                    No Thumbnail
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
                  {/* Edit */}
                  <button
                    onClick={(e) => handleEditClick(course, e)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md"
                  >
                    ✏️
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteCourse(course._id, course.title)}
                    disabled={deletingCourseId === course._id}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md"
                  >
                    {deletingCourseId === course._id ? "⏳" : "🗑️"}
                  </button>
                </div>

                {/* TITLE */}
                <h3 className="text-xl font-bold text-purple-900 mb-2">
                  {course.title}
                </h3>

                <p className="text-gray-700 mb-3 line-clamp-3">
                  {course.description}
                </p>

                {/* DETAILS */}
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Type:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded ${
                        course.isPaid
                          ? "bg-purple-700 text-white"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {course.isPaid ? "Paid" : "Free"}
                    </span>
                  </p>

                  {course.isPaid && (
                    <p>
                      <strong>Price:</strong> ₹{course.price}
                    </p>
                  )}

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded ${
                        course.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {course.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>

                  <p>
                    <strong>Created By:</strong>{" "}
                    {course.createdBy?.name || "Unknown"}
                  </p>
                </div>

                {/* ADD VIDEO */}
                <button
                  onClick={() => handleAddVideo(course._id)}
                  className="w-full mt-4 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg shadow-md"
                >
                  ➕ Add Video
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold text-purple-900 mb-4">
              Edit Course
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="w-full border p-3 rounded"
                placeholder="Course Title"
              />

              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full border p-3 rounded"
                rows="4"
                placeholder="Description"
              />

              {/* PAID TOGGLE */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.isPaid}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      isPaid: e.target.checked,
                      price: e.target.checked ? editForm.price : 0,
                    })
                  }
                />
                Paid Course?
              </label>

              {editForm.isPaid && (
                <input
                  type="number"
                  className="w-full border p-3 rounded"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  placeholder="Course Price"
                  min="1"
                />
              )}

              {/* ACTIVE TOGGLE */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      isActive: e.target.checked,
                    })
                  }
                />
                Active?
              </label>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="flex-1 bg-gray-200 py-3 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-purple-700 text-white py-3 rounded"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllCourses;