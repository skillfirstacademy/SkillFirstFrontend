import React, { useEffect, useMemo, useState } from "react";
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
import { useNavigate } from "react-router-dom";

function Tabs({ activeTab }) {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState("all"); // all | day | month | year
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate()

  /* ----------------------------
      DATA FETCH
  ----------------------------- */
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
      console.log("first", enrollmentsRes)
      setUsers(usersRes.data || []);
      setCourses(coursesRes.data.courses || []);
      setEnrollments(enrollmentsRes.data?.data || enrollmentsRes.data || []);
      setStats(statsRes.data?.stats || null);
    } catch (err) {
      console.error(err);
      showError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  /* ----------------------------
      FILTER LOGIC
  ----------------------------- */
  const students = useMemo(
    () => users.filter((u) => u.role === "student"),
    [users]
  );

  const filteredStudents = useMemo(() => {
    if (filterType === "all") return students;

    return students.filter((s) => {
      const createdDate = new Date(s.createdAt);

      if (filterType === "day") {
        const selected = new Date(selectedDate);
        return (
          createdDate.getDate() === selected.getDate() &&
          createdDate.getMonth() === selected.getMonth() &&
          createdDate.getFullYear() === selected.getFullYear()
        );
      }

      if (filterType === "month") {
        return (
          createdDate.getMonth() === selectedMonth &&
          createdDate.getFullYear() === selectedYear
        );
      }

      if (filterType === "year") {
        return createdDate.getFullYear() === selectedYear;
      }

      return false;
    });
  }, [students, filterType, selectedDate, selectedMonth, selectedYear]);

  const yearOptions = useMemo(() => {
    const years = students.map((s) => new Date(s.createdAt).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  }, [students]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center text-purple-700 font-semibold">
        Loading…
      </div>
    );
  }


  if (activeTab === "students") {
    const recentStudents = filteredStudents.slice(-5).reverse();

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-700" />
            </div>
            <h2 className="text-2xl font-bold text-purple-900">
              Student Management
            </h2>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded px-3 py-2 bg-white"
            >
              <option value="all">All Time</option>
              <option value="day">Specific Day</option>
              <option value="month">Specific Month</option>
              <option value="year">Specific Year</option>
            </select>

            {filterType === "day" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded px-3 py-2"
              />
            )}

            {filterType === "month" && (
              <>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="border rounded px-3 py-2 bg-white"
                >
                  {monthNames.map((month, idx) => (
                    <option key={idx} value={idx}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border rounded px-3 py-2 bg-white"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </>
            )}

            {filterType === "year" && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border rounded px-3 py-2 bg-white"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm">Total Students</p>
            <p className="text-3xl font-bold text-purple-700">
              {students.length}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm">
              {filterType === "all" ? "All Students" :
                filterType === "day" ? `Students on ${new Date(selectedDate).toLocaleDateString()}` :
                  filterType === "month" ? `Students in ${monthNames[selectedMonth]} ${selectedYear}` :
                    `Students in ${selectedYear}`}
            </p>
            <p className="text-3xl font-bold text-purple-700">
              {filteredStudents.length}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm">Admins</p>
            <p className="text-3xl font-bold text-purple-700">
              {users.filter((u) => u.role === "admin" || u.role === "superadmin").length}
            </p>
          </div>
        </div>

        {/* Recent Students */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">
            {filterType === "all" ? "Recent Students" : "Filtered Students"}
          </h3>
          {recentStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No students found for the selected filter
            </div>
          ) : (
            <div className="space-y-4">
              {recentStudents.map((s) => (
                <div
                  key={s._id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                      {s.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-sm text-gray-600">{s.email}</p>
                      <p className="text-xs text-gray-500">
                        Joined: {new Date(s.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/students/${s._id}`)}
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition">
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === "courses") {
    const recentCourses = courses.slice(-5).reverse();

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900">
              Course Management
            </h2>
          </div>

          <button
            onClick={() => navigate("/admin/add-courses")}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            + Add Course
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-blue-700">
              {courses.length}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">Paid Courses</p>
            <p className="text-3xl font-bold text-blue-700">
              {courses.filter((c) => c.isPaid).length}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">Free Courses</p>
            <p className="text-3xl font-bold text-blue-700">
              {courses.filter((c) => !c.isPaid).length}
            </p>
          </div>
        </div>

        {/* Recent Courses */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            Recent Courses
          </h3>

          {recentCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No courses found
            </div>
          ) : (
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {course.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {course.description?.slice(0, 80)}...
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Price:{" "}
                      {course.isPaid ? `₹${course.price}` : "Free"} ·
                      Created:{" "}
                      {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/courses/${course._id}`)
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === "enrollments") {
    // Calculate enrollment statistics
    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter(e => e.status === "completed").length;
    const activeEnrollments = enrollments.filter(e => e.status === "active" || e.status === "enrolled").length;
    const pendingEnrollments = totalEnrollments - completedEnrollments;

    // Calculate revenue
    const totalRevenue = enrollments.reduce((sum, enrollment) => {
      if (enrollment.payment && enrollment.payment.status === "paid") {
        return sum + (enrollment.payment.amount || 0);
      }
      return sum;
    }, 0);

    // Calculate completion rate
    const completionRate = totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

    const recentEnrollments = enrollments.slice(-10).reverse();

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <FileText className="w-6 h-6 text-amber-700" />
            </div>
            <h2 className="text-2xl font-bold text-amber-900">
              Enrollment Overview
            </h2>
          </div>
        </div>

        {/* Enrollment Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <p className="text-gray-600 text-sm mb-1">Total Enrollments</p>
            <p className="text-3xl font-bold text-purple-700">{totalEnrollments}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-gray-600 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedEnrollments}</p>
          </div>
          {/* <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-gray-600 text-sm mb-1">Active</p>
            <p className="text-3xl font-bold text-blue-600">{activeEnrollments}</p>
          </div> */}
          <div className="p-4 bg-amber-50 rounded-lg text-center">
            <p className="text-gray-600 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-600">{pendingEnrollments}</p>
          </div>
        </div>

        {/* Revenue & Completion Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-700" />
              <p className="text-sm font-medium text-green-800">Total Revenue</p>
            </div>
            <p className="text-4xl font-bold text-green-700">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border border-teal-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-teal-700" />
              <p className="text-sm font-medium text-teal-800">Completion Rate</p>
            </div>
            <p className="text-4xl font-bold text-teal-700">{completionRate}%</p>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            Recent Enrollments
          </h3>

          {recentEnrollments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No enrollments found
            </div>
          ) : (
            <div className="space-y-4">
              {recentEnrollments.map((enrollment) => (
                <div
                  key={enrollment._id}
                  className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-gray-50 rounded-xl gap-3"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {enrollment.course?.title || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Student: {enrollment.user?.name || "N/A"} ({enrollment.user?.email || "N/A"})
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>
                        Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                      </span>
                      {enrollment.completedAt && (
                        <span>
                          Completed: {new Date(enrollment.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        enrollment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : enrollment.status === "active" || enrollment.status === "enrolled"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {enrollment.status || "N/A"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        enrollment.payment?.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {enrollment.payment?.status === "paid"
                        ? `₹${enrollment.payment.amount?.toLocaleString('en-IN')}`
                        : "Unpaid"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default Tabs;