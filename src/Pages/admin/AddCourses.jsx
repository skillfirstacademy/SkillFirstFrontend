import React, { useState } from "react";
import { showSuccess, showError } from "../../Componnets/AppToaster";
import adminApi from "../../api/adminApi";

function AddCourses() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showError("Course title is required");
      return;
    }

    if (!description.trim()) {
      showError("Course description is required");
      return;
    }

    if (isPaid && (!price || price <= 0)) {
      showError("Please enter a valid price");
      return;
    }

    setLoading(true);

    try {
      await adminApi.post("/courses", {
        title,
        description,
        isPaid,
        price: isPaid ? Number(price) : 0,
      });

      showSuccess("Course created successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setIsPaid(false);
      setPrice("");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-900">
              Create New Course
            </h1>
            <p className="text-purple-600 mt-2">
              Add a new course to your platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full Stack Web Development"
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Description *
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Course description..."
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Paid Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="w-5 h-5 text-purple-600"
              />
              <label className="text-purple-800 font-medium">
                Paid Course?
              </label>
            </div>

            {/* Price */}
            {isPaid && (
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter course price"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 text-white font-semibold py-4 rounded-lg hover:bg-purple-800 transition disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-700">
              📌 Free courses will automatically have price set to ₹0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCourses;
