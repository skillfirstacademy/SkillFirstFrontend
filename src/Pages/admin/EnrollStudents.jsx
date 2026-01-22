import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { showError } from "../../Componnets/AppToaster";

function EnrollStudents() {
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState(null);
  const [adminEnrollments, setAdminEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---- Filters ----
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    fetchAllEnrollments();
    fetchStats();
    fetchAdminEnrollments();
  }, []);

  // 🟣 1) Fetch All Enrolled Students
  const fetchAllEnrollments = async () => {
    try {
      const res = await adminApi.get("/admin/enrollments");
      setEnrollments(res.data.data);
    } catch (err) {
      showError("Failed to load enrollments");
    }
  };

  // 🔵 2) Fetch Statistics
  const fetchStats = async () => {
    try {
      const res = await adminApi.get("/admin/enrollments/stats");
      setStats(res.data.stats);
    } catch (err) {
      showError("Failed to load stats");
    }
  };

  // 🟠 3) Fetch Enrollments by Current Admin
  const fetchAdminEnrollments = async () => {
    try {
      const res = await adminApi.get("/admin/enrollments/by-admin");
      setAdminEnrollments(res.data.data);
    } catch (err) {
      showError("Failed to load admin enrollments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-8">

      {/* 📊 Stats Header */}
      <div className="bg-purple-700 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold">Enrollment Dashboard</h2>
        <p className="text-purple-200 mt-1">Overview of all enrollments</p>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <StatBox title="Total Enrollments" value={stats.totalEnrollments} />
            <StatBox title="Admin Enrollments" value={stats.adminEnrollments} />
            <StatBox title="Paid Enrollments" value={stats.paidEnrollments} />
            <StatBox 
              title="Total Revenue" 
              value={`₹${stats.totalRevenue}`} 
            />
          </div>
        )}
      </div>

      {/* 🟣 ALL ENROLLED STUDENTS */}
      <section>
        <h2 className="text-xl font-semibold mb-3">All Enrolled Students</h2>
        <EnrollmentTable enrollments={enrollments} />
      </section>

      {/* 🔵 ENROLLMENTS BY THIS ADMIN */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          Enrollments Done By You (Admin)
        </h2>
        <EnrollmentTable enrollments={adminEnrollments} />
      </section>
    </div>
  );
}

/* 📌 Small Reusable Component */
function StatBox({ title, value }) {
  return (
    <div className="bg-purple-800 p-4 rounded-lg shadow text-center">
      <div className="text-purple-300 text-sm">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

/* 📌 Table Component */
function EnrollmentTable({ enrollments }) {
  if (enrollments.length === 0)
    return <p className="text-gray-500">No enrollments found.</p>;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-purple-100 text-purple-900">
          <tr>
            <th className="p-3 text-left">Student</th>
            <th className="p-3 text-left">Course</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Enrolled By</th>
          </tr>
        </thead>

        <tbody>
          {enrollments.map((e) => (
            <tr key={e._id} className="border-t hover:bg-purple-50">
              <td className="p-3">{e.user?.name}</td>
              <td className="p-3">{e.course?.title}</td>
              <td className="p-3 capitalize">{e.status}</td>
              <td className="p-3">₹{e.payment?.amount}</td>
              <td className="p-3">
                {e.enrolledBy?.name || "Admin"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EnrollStudents;
