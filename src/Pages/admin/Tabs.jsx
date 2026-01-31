import React, { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  FileText,
  DollarSign,
  Award,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import adminApi from "../../api/adminApi";
import { showError } from "../../Componnets/AppToaster";

function Tabs({ activeTab }) {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data for tabs
  const loadData = async () => {
    try {
      setLoading(true);

      const [usersRes, coursesRes, enrollmentsRes, statsRes] =
        await Promise.all([
          adminApi.get("/admin/users"),
          adminApi.get("/courses"),
          adminApi.get("/admin/enrollments"),
          adminApi.get("/admin/enrollments/stats"),
        ]);

      setUsers(usersRes.data);
      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data.data || enrollmentsRes.data);
      setStats(statsRes.data.stats);
    } catch (err) {
      console.log(err);
      showError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  if (loading)
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center text-purple-700 font-semibold">
        Loading…
      </div>
    );

  /* ----------------------------
        📌 STUDENTS TAB
  ----------------------------- */
  if (activeTab === "students") {
    const recentStudents = users
      .filter((u) => u.role === "student")
      .slice(-5)
      .reverse();

    const totalStudents = users.filter((u) => u.role === "student").length;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Users className="w-6 h-6 text-purple-700" />
          </div>
          <h2 className="text-2xl font-bold text-purple-900">
            Student Management
          </h2>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm">Total Students</p>
            <p className="text-3xl font-bold text-purple-700">
              {totalStudents}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm">New This Week</p>
            <p className="text-3xl font-bold text-purple-700">
              {Math.floor(totalStudents / 5)}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm">Admins</p>
            <p className="text-3xl font-bold text-purple-700">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
        </div>

        {/* Recent Users */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Students</h3>

          <div className="space-y-4">
            {recentStudents.map((student) => (
              <div
                key={student._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    {student.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>

                <button className="px-4 py-2 bg-purple-700 text-white rounded-lg">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------
        📌 COURSES TAB
  ----------------------------- */
  if (activeTab === "courses") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-700" />
          </div>
          <h2 className="text-2xl font-bold text-purple-900">Courses</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.isArray(courses) && courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course._id}
                className="p-4 bg-blue-50 rounded-lg border"
              >
                <h4 className="font-semibold">{course.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {
                    enrollments.filter((e) => e.course?._id === course._id)
                      .length
                  }{" "}
                  students enrolled
                </p>
                <button className="mt-3 text-purple-700 hover:underline">
                  Manage →
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No courses available
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ----------------------------
        📌 ENROLLMENTS TAB
  ----------------------------- */
  if (activeTab === "enrollments") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-100 rounded-lg">
            <FileText className="w-6 h-6 text-amber-700" />
          </div>
          <h2 className="text-2xl font-bold text-purple-900">
            All Enrollments
          </h2>
        </div>

        <div className="space-y-4">
          {enrollments.map((en) => (
            <div
              key={en._id}
              className="p-4 bg-gray-50 rounded-lg flex justify-between"
            >
              <div>
                <p className="font-semibold">{en.user?.name}</p>
                <p className="text-sm text-gray-600">{en.course?.title}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full ${
                  en.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {en.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ----------------------------
        📌 REVENUE TAB
  ----------------------------- */
  if (activeTab === "revenue") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-700" />
          </div>
          <h2 className="text-2xl font-bold text-purple-900">Revenue</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-green-700">
              ₹{stats?.totalRevenue}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm">Paid Enrollments</p>
            <p className="text-3xl font-bold text-green-700">
              {stats?.paidEnrollments}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm">Admin Enrollments</p>
            <p className="text-3xl font-bold text-green-700">
              {stats?.adminEnrollments}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------
        📌 CERTIFICATES TAB
  ----------------------------- */
  if (activeTab === "certificates") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-pink-100 rounded-lg">
            <Award className="w-6 h-6 text-pink-700" />
          </div>
          <h2 className="text-2xl font-bold text-purple-900">
            Certificates (Coming Soon)
          </h2>
        </div>
        <p className="text-gray-600">
          Certificate tracking will be added after completion module is ready.
        </p>
      </div>
    );
  }

  /* ----------------------------
        📌 ADMINS TAB
  ----------------------------- */
  if (activeTab === "instructors") {
    const admins = users.filter(
      (u) => u.role === "admin" || u.role === "superadmin",
    );

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <UserCheck className="w-6 h-6 text-indigo-700" />
          </div>
          <h2 className="text-2xl font-bold text-purple-900">Admins</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {admins.map((a) => (
            <div
              key={a._id}
              className="p-4 bg-indigo-50 rounded-lg text-center"
            >
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-full mx-auto flex items-center justify-center text-xl font-bold">
                {a.name.charAt(0)}
              </div>
              <h4 className="font-semibold mt-3">{a.name}</h4>
              <p className="text-sm text-gray-600">{a.email}</p>
              <p className="text-xs text-purple-600 uppercase mt-1">{a.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ----------------------------
        📌 COMPLETION TAB
  ----------------------------- */
  if (activeTab === "completion") {
    const completionRate = stats
      ? Math.floor(
          (stats.paidEnrollments / (stats.totalEnrollments || 1)) * 100,
        )
      : 0;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-teal-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-teal-700" />
          </div>
          <h2 className="text-2xl font-bold text-purple-900">
            Completion Rate
          </h2>
        </div>

        <div className="p-4 bg-teal-50 rounded-lg">
          <p className="text-sm">Overall Completion</p>
          <p className="text-4xl font-bold text-teal-700">{completionRate}%</p>
        </div>
      </div>
    );
  }

  return null;
}

export default Tabs;
