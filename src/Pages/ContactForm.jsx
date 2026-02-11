import React, { useState } from "react";
import axios from "axios";
import api from "../api/axios";
import adminApi from "../api/adminApi";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    courseName: "",
    level: "beginner",
    message:"",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await adminApi.post("/contact", formData);
      setMessage({ type: "success", text: res.data.message });
      setFormData({
        name: "",
        phone: "",
        email: "",
        courseName: "",
        level: "beginner",
        message:"",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 sm:p-8">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-950 text-center mb-2">
          Contact Us
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Get guidance about your course & level
        </p>

        {/* Alert */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-md text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
              placeholder="Your full name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
              placeholder="10-digit mobile number"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
              placeholder="example@gmail.com"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
              placeholder="Web Design / UI UX / Video Editing"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level <span className="text-red-500">*</span>
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
              placeholder="Web Design / UI UX / Video Editing"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-purple-950 text-white py-3 rounded-lg font-semibold tracking-wide hover:bg-purple-900 transition disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
