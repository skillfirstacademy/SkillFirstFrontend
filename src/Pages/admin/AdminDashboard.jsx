import React, { useState, useEffect } from "react";
import { Users, BookOpen, FileText, BarChart3, Award } from "lucide-react";
import Tabs from "./Tabs";
import adminApi from "../../api/adminApi";
import { showError } from "../../Componnets/AppToaster";
import { useSessionValidator } from "../../hooks/useSessionValidator";

const AdminDashboard = () => {
  useSessionValidator();

  const [activeTab, setActiveTab] = useState("students");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [usersRes, coursesRes, enrollmentStatsRes] = await Promise.all([
        adminApi.get("/admin/users"),
        adminApi.get("/courses"),
        adminApi.get("/admin/enrollments"),
      ]);

      setUsers(usersRes.data);
      setCourses(coursesRes.data);
      setStats(enrollmentStatsRes.data.data);

    } catch (err) {
      console.log(err);
      showError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Calculate dynamic values from enrollment data
  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalSuperAdmins = users.filter((u) => u.role === "superadmin").length;

  // Calculate enrollment statistics
  const enrollments = Array.isArray(stats) ? stats : [];
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

  // Calculate certificates issued
  const totalCertificates = enrollments.reduce((sum, enrollment) => {
    return sum + (enrollment.progress?.certificatesEarned || 0);
  }, 0);

  // Calculate completion rate
  const completionRate = totalEnrollments > 0
    ? Math.round((completedEnrollments / totalEnrollments) * 100)
    : 0;

  const statsCards = [
    {
      id: "students",
      icon: Users,
      label: "Total Students",
      value: totalStudents,
      change: "+12%",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-700",
    },
    {
      id: "courses",
      icon: BookOpen,
      label: "Total Courses",
      value: courses.count || 0,
      change: "+3",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      id: "enrollments",
      icon: FileText,
      label: "Total Enrollments",
      value: totalEnrollments,
      change: "+8%",
      bgColor: "bg-amber-100",
      iconColor: "text-amber-700",
    },
    {
      id: "revenue",
      icon: BarChart3,
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: "+15%",
      bgColor: "bg-green-100",
      iconColor: "text-green-700",
    },
    {
      id: "certificates",
      icon: Award,
      label: "Certificates Issued",
      value: totalCertificates,
      change: "+22%",
      bgColor: "bg-pink-100",
      iconColor: "text-pink-700",
    },
    {
      id: "instructors",
      icon: Users,
      label: "Active Admins",
      value: totalAdmins + totalSuperAdmins,
      change: "+5",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-700",
    },
    {
      id: "completion",
      icon: BarChart3,
      label: "Completion Rate",
      value: `${completionRate}%`,
      change: "+6%",
      bgColor: "bg-teal-100",
      iconColor: "text-teal-700",
    },
  ];

  // Additional stats for detailed view
  const detailedStats = {
    totalEnrollments,
    completedEnrollments,
    activeEnrollments,
    pendingEnrollments,
    totalRevenue,
    completionRate,
    totalCertificates,
  };

  if (loading)
    return (
      <div className="p-10 text-center text-purple-600 font-semibold">
        Loading Dashboard…
      </div>
    );

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card) => {
          const Icon = card.icon;
          const isClickable = ["students", "courses", "enrollments"].includes(card.id);
          
          return (
            <div
              key={card.id}
              onClick={isClickable ? () => setActiveTab(card.id) : undefined}
              className={`bg-white rounded-2xl shadow-lg p-6 border transition-all duration-300 ${
                isClickable ? "cursor-pointer" : "cursor-default"
              } ${
                activeTab === card.id && isClickable
                  ? "border-purple-500 shadow-xl ring-2 ring-purple-300"
                  : "border-purple-100"
              } ${
                isClickable ? "hover:shadow-xl" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${card.bgColor} rounded-lg`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                {/* <span className="text-sm font-medium text-green-600">
                  {card.change}
                </span> */}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {card.label}
              </h3>
              <p className="text-3xl font-bold text-purple-900">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tabs — Students / Courses / Enrollments / Admins etc */}
      <Tabs
        activeTab={activeTab}
        users={users}
        courses={courses}
        stats={stats}
        detailedStats={detailedStats}
      />
    </>
  );
};

export default AdminDashboard;