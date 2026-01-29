import React, { useState } from "react";
import { showSuccess, showError } from "../../Componnets/AppToaster";
import adminApi from "../../api/adminApi";

function AddCourses() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [level, setLevel] = useState(null);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return showError("Course title is required");
    if (!description.trim()) return showError("Course description is required");

    if (!thumbnail) return showError("Thumbnail image is required");

    if (isPaid && (!price || price <= 0)) {
      return showError("Please enter a valid price");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isPaid", isPaid);
    formData.append("price", isPaid ? price : 0);
    formData.append("thumbnail", thumbnail);
    formData.append("level", level);

    setLoading(true);

    try {
      await adminApi.post("/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSuccess("Course created successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setIsPaid(false);
      setPrice("");
      setThumbnail(null);
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

          <h1 className="text-3xl font-bold text-purple-900 mb-6">
            Create New Course
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Course Thumbnail *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="w-full"
                required
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg"
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
                className="w-full px-4 py-3 border border-purple-200 rounded-lg"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-2">
                Level *
              </label>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>


            {/* Paid Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="w-5 h-5"
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
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 text-white py-3 rounded-lg"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default AddCourses;
