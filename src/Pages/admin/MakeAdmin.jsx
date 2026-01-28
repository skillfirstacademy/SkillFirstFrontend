import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { showError, showSuccess } from "../../Componnets/AppToaster";

function MakeAdmin() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    password: "",
  });

  // Get logged user role
  const token = localStorage.getItem("accessToken");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const isSuperAdmin = payload?.role === "superadmin";

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/admin/users");
      const userData = res.data.users || res.data || [];
      const adminUsers = userData.filter(
        (user) => user.role === "admin" || user.role === "superadmin"
      );
      setAdmins(adminUsers);
    } catch (err) {
      showError("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const demoteAdmin = async (userId) => {
    if (!isSuperAdmin) return showError("Only superadmin can demote admins!");

    if (!window.confirm("Are you sure you want to demote this admin to student?")) {
      return;
    }

    try {
      await adminApi.put(`/admin/users/${userId}/demote`);
      showSuccess("Admin demoted to Student");
      fetchAdmins();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to demote admin");
    }
  };

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

  const handleCreateAdmin = async (e) => {
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
      await adminApi.post("/admin/create-admin", formData);
      
      showSuccess("Admin created successfully");
      
      resetForm();
      setShowCreateModal(false);
      fetchAdmins(); // Refresh the list
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create admin");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-purple-800">
            Admin Management
          </h2>
          <p className="text-gray-600 mt-1">
            View and manage admin users
          </p>
        </div>

        {/* Create Admin Button - Only for Superadmin */}
        {isSuperAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Admin
          </button>
        )}
      </div>

      {/* Permission Warning */}
      {!isSuperAdmin && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Only superadmin can create or demote admins.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admins List */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mb-4"></div>
          <p className="text-gray-600">Loading admins...</p>
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <p className="text-gray-500 text-lg">No admin users found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="p-4 bg-white shadow rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-lg font-semibold">{admin.name}</h3>
                <p className="text-gray-700">{admin.email}</p>
                {admin.mobile && (
                  <p className="text-sm text-gray-600">{admin.mobile}</p>
                )}
                <p className="text-sm capitalize text-gray-600 mt-1">
                  Role: <span className="font-semibold">{admin.role}</span>
                </p>
              </div>

              <div>
                {admin.role === "admin" && isSuperAdmin ? (
                  <button
                    onClick={() => demoteAdmin(admin._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Demote to Student
                  </button>
                ) : admin.role === "superadmin" ? (
                  <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                    🛡️ Super Admin
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">No Action Available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-700 to-purple-900 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Create Admin</h2>
                  <p className="text-purple-200 text-sm mt-1">
                    Fill in the details below
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-white hover:text-red-300 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Enter mobile number"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Enter password (min 6 characters)"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Admin"
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

export default MakeAdmin;