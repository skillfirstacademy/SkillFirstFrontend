import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { showSuccess, showError } from "../../Componnets/AppToaster";

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/admin/users");
      // Filter only students (role === "student")
      const studentUsers = (res.data.users || res.data).filter(
        (user) => user.role === "student"
      );
      setStudents(studentUsers);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to fetch students");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteStudent = async (studentId, studentName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${studentName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingStudentId(studentId);

    try {
      await adminApi.delete(`/users/${studentId}`);
      showSuccess("Student deleted successfully!");
      setStudents(students.filter((student) => student._id !== studentId));
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete student");
    } finally {
      setDeletingStudentId(null);
    }
  };

  const handleViewDetails = (student) => {
    setViewingStudent(student);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
            <p className="text-purple-600">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900">All Students</h1>
          <p className="text-purple-600 mt-2">
            Manage and view all registered students
          </p>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Search Bar */}
          <div className="md:col-span-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Total Count */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-lg p-4 text-white">
            <div className="text-sm font-medium text-purple-200">
              Total Students
            </div>
            <div className="text-3xl font-bold mt-1">{students.length}</div>
          </div>
        </div>

        {/* Students List */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <svg
              className="w-16 h-16 text-purple-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? "No students found" : "No students yet"}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Students will appear here once they register"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-700 to-purple-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Joined Date
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student._id}
                      className="hover:bg-purple-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {student.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {student.name || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {student.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {student.phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(student.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetails(student)}
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                            title="View details"
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteStudent(student._id, student.name)
                            }
                            disabled={deletingStudentId === student._id}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                            title="Delete student"
                          >
                            {deletingStudentId === student._id ? (
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student Details Modal */}
        {viewingStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-700 to-purple-900 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                      {viewingStudent.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        Student Details
                      </h2>
                      <p className="text-purple-200 text-sm mt-1">
                        Complete information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingStudent(null)}
                    className="text-white hover:text-red-300 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-purple-900 mb-1">
                      Full Name
                    </label>
                    <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                      {viewingStudent.name || "N/A"}
                    </p>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-purple-900 mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg break-all">
                      {viewingStudent.email || "N/A"}
                    </p>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-purple-900 mb-1">
                      Phone Number
                    </label>
                    <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                      {viewingStudent.phone || "N/A"}
                    </p>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-purple-900 mb-1">
                      Role
                    </label>
                    <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg capitalize">
                      {viewingStudent.role || "N/A"}
                    </p>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-purple-900 mb-1">
                      Joined Date
                    </label>
                    <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                      {formatDate(viewingStudent.createdAt)}
                    </p>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-purple-900 mb-1">
                      Student ID
                    </label>
                    <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg font-mono text-sm">
                      {viewingStudent._id}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => setViewingStudent(null)}
                    className="w-full px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllStudents;