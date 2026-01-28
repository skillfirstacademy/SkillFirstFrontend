import React, { useState } from "react";
import adminApi from "../../api/adminApi";
import AllStudent from "./AllStudents"
import { showSuccess, showError } from "../../Componnets/AppToaster";


function AddStudents() {
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      dob: "",
      password: "",
    });
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.password) {
      return showError("Name, email, and password are required");
    }

    // Validate password length
    if (formData.password.length < 6) {
      return showError("Password must be at least 6 characters");
    }

    setCreating(true);

    try {
      await adminApi.post("/admin/create-student", formData);
      
      showSuccess("Student created successfully!");
      resetForm();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create student");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900">Add New Student</h1>
          <p className="text-purple-600 mt-2">
            Create a new student account manually
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          <form onSubmit={handleCreateStudent} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Enter student's full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Enter email address"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Student will use this email to log in
              </p>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Enter mobile number (optional)"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-purple-900 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Enter password (min 6 characters)"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Info Box
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg 
                  className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <div>
                  <h3 className="font-semibold text-purple-900 mb-1">
                    Important Information
                  </h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• The student will be able to log in immediately after creation</li>
                    <li>• Make sure to share the login credentials securely</li>
                    <li>• Email must be unique and not already registered</li>
                    <li>• You can enroll the student in courses from the "All Students" page</li>
                  </ul>
                </div>
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                disabled={creating}
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Student
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        
      </div>
    </div>

    <AllStudent/>
    </>
    
  );
}

export default AddStudents;