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
    isActive: true
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

  const handleEditClick = (course, e) => {
    e.stopPropagation();
    setEditingCourse(course);
    setEditForm({
      title: course.title,
      description: course.description,
      price: course.price || 0,
      isPaid: course.isPaid,
      isActive: course.isActive !== undefined ? course.isActive : true
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editForm.title.trim()) {
      showError("Course title is required");
      return;
    }

    if (!editForm.description.trim()) {
      showError("Course description is required");
      return;
    }

    if (editForm.isPaid && (!editForm.price || editForm.price <= 0)) {
      showError("Please enter a valid price for paid course");
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        price: editForm.isPaid ? Number(editForm.price) : 0,
        isPaid: editForm.isPaid,
        isActive: editForm.isActive
      };

      await adminApi.put(`/courses/${editingCourse._id}`, updateData);
      
      showSuccess("Course updated successfully!");
      
      // Update the course in the local state
      setCourses(courses.map(course => 
        course._id === editingCourse._id 
          ? { ...course, ...updateData }
          : course
      ));
      
      setEditingCourse(null);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingCourseId(courseId);

    try {
      await adminApi.delete(`/courses/${courseId}`);
      showSuccess("Course deleted successfully!");
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete course");
    } finally {
      setDeletingCourseId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
            <p className="text-purple-600 text-center">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
            <p className="text-purple-600 text-center">
              No courses available yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-900">All Courses</h1>
            <p className="text-purple-600 mt-2">Manage your course library</p>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="relative group border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-purple-50"
              >
                {/* Action Buttons - Show on hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  {/* Edit Button */}
                  <button
                    onClick={(e) => handleEditClick(course, e)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-md"
                    title="Edit course"
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

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteCourse(course._id, course.title)}
                    disabled={deletingCourseId === course._id}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md disabled:opacity-50"
                    title="Delete course"
                  >
                    {deletingCourseId === course._id ? (
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
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
                    )}
                  </button>
                </div>

                <h3 className="text-xl font-bold text-purple-900 mb-3 pr-12">
                  {course.title}
                </h3>

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-800">
                      Type:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        course.isPaid
                          ? "bg-purple-700 text-white"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {course.isPaid ? "Paid" : "Free"}
                    </span>
                  </div>

                  {course.isPaid && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-800">
                        Price:
                      </span>
                      <span className="text-lg font-bold text-purple-900">
                        ₹{course.price}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-800">
                      Status:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {course.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-800">
                      Created By:
                    </span>
                    <span className="text-sm text-gray-700">
                      {course.createdBy?.name || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Add Video Button */}
                <button
                  onClick={() => handleAddVideo(course._id)}
                  className="w-full bg-purple-700 text-white font-semibold py-3 rounded-lg hover:bg-purple-800 transition shadow-md flex items-center justify-center gap-2"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Video
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-700 to-purple-900 text-white p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold">Edit Course</h2>
              <p className="text-purple-200 text-sm mt-1">
                Update course information
              </p>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  placeholder="Enter course title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-2">
                  Description *
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                  rows="4"
                  placeholder="Enter course description"
                  required
                />
              </div>

              {/* Course Type */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-3">
                  Course Type *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={!editForm.isPaid}
                      onChange={() =>
                        setEditForm({ ...editForm, isPaid: false, price: 0 })
                      }
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">Free Course</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={editForm.isPaid}
                      onChange={() =>
                        setEditForm({ ...editForm, isPaid: true })
                      }
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">Paid Course</span>
                  </label>
                </div>
              </div>

              {/* Price - Only show if paid */}
              {editForm.isPaid && (
                <div>
                  <label className="block text-sm font-semibold text-purple-900 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    placeholder="Enter price"
                    min="1"
                    required
                  />
                </div>
              )}

              {/* Course Status */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-3">
                  Course Status
                </label>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={(e) =>
                        setEditForm({ ...editForm, isActive: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {editForm.isActive ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {editForm.isActive
                    ? "Course is visible to students"
                    : "Course is hidden from students"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Changes
                    </>
                  )}
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