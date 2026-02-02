import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import { showError, showSuccess } from "../../Componnets/AppToaster";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Award,
    BookOpen,
    Edit2,
    Save,
    X,
    Trash2,
    CheckCircle,
    XCircle,
    BarChart,
    Clock
} from "lucide-react";

function ViewStudent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        dob: "",
    });

    const [courseForm, setCourseForm] = useState({
        status: "",
        level: "",
        price: 0,
    });

    const loadStudent = async () => {
        try {
            const res = await adminApi.get(`/users/${id}`);
            setData(res.data);
            // console.log("first", res.data.student);

            // Format date for input field (YYYY-MM-DD)
            const dobValue = res.data.student?.dob
                ? res.data.student.dob.slice(0, 10)
                : "";

            setForm({
                name: res.data.student?.name || "",
                email: res.data.student?.email || "",
                mobile: res.data.student?.mobile || "",
                dob: dobValue,
            });
        } catch {
            showError("Failed to load student");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudent();
    }, [id]);

    const handleUpdate = async () => {
        try {
            await adminApi.put(`/users/${id}`, form);
            showSuccess("Student updated successfully");
            setEditing(false);
            loadStudent();
        } catch (err) {
            showError(err.response?.data?.message || "Update failed");
        }
    };

    const handleBlockToggle = async () => {
        const isBlocked = data.student.isBlocked;

        const confirmMessage = isBlocked
            ? "Unblock this student?"
            : "Block this student?";

        if (!window.confirm(confirmMessage)) return;

        try {
            await adminApi.put(
                isBlocked
                    ? `/admin/users/${id}/unblock`
                    : `/admin/users/${id}/block`
            );

            showSuccess(isBlocked ? "Student unblocked successfully" : "Student blocked successfully");
            loadStudent();
        } catch (err) {
            showError(err.response?.data?.message || "Action failed");
        }
    };


    const handleDeleteStudent = async () => {
        if (!window.confirm("Delete this student permanently?")) return;
        try {
            await adminApi.delete(`/admin/users/${id}`);
            showSuccess("Student deleted");
            navigate("/admin/all-students");
        } catch {
            showError("Delete failed");
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
            </div>
        );
    }

    if (!data) return null;

    const { student, courses, stats } = data;

    const renderField = (icon, label, field, type = "text") => {
        const Icon = icon;
        return (
            <div className="bg-gray-50 p-4 rounded-lg" key={field}>
                <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-purple-600" />
                    <label className="text-sm font-medium text-gray-600">{label}</label>
                </div>
                {editing ? (
                    <input
                        type={type}
                        value={form[field] || ""}
                        onChange={(e) => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                ) : (
                    <p className="font-semibold text-gray-900">
                        {field === "dob" && student?.[field]
                            ? formatDate(student[field])
                            : student?.[field] || "—"}
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* HEADER */}
            <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
                    <p className="text-gray-500 text-sm mt-1">ID: {student._id}</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-purple-600 hover:underline"
                >
                    ← Back
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Courses", value: stats.totalCourses },
                    { label: "Completed", value: stats.completedCourses },
                    { label: "Certificates", value: stats.certificatesEarned },
                    { label: "Role", value: student.role },
                ].map((s, i) => (
                    <div
                        key={i}
                        className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl p-6 shadow"
                    >
                        <p className="text-purple-200 text-sm">{s.label}</p>
                        <p className="text-3xl font-bold mt-2">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* PERSONAL INFO */}
            <div className="bg-white rounded-2xl shadow p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Personal Information</h2>
                    <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${student.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                            }`}
                    >
                        {student.isBlocked ? "Blocked" : "Active"}
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {renderField(User, "Name", "name")}
                    {renderField(Mail, "Email", "email")}
                    {renderField(Phone, "Mobile", "mobile")}
                    {renderField(Calendar, "DOB", "dob", "date")}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                    {editing ? (
                        <>
                            <button
                                onClick={handleUpdate}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                            >
                                <Save className="w-4 h-4" /> Save
                            </button>
                            <button
                                onClick={() => setEditing(false)}
                                className="flex items-center gap-2 bg-gray-300 px-5 py-2 rounded-lg"
                            >
                                <X className="w-4 h-4" /> Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
                        >
                            <Edit2 className="w-4 h-4" /> Edit
                        </button>
                    )}

                    <button
                        onClick={handleBlockToggle}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white ${student.isBlocked
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-orange-600 hover:bg-orange-700"
                            }`}
                    >
                        {student.isBlocked ? <CheckCircle /> : <XCircle />}{" "}
                        {student.isBlocked ? "Unblock" : "Block"}
                    </button>

                    <button
                        onClick={handleDeleteStudent}
                        className="ml-auto flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
            </div>

            {/* COURSES */}
            <div className="bg-white rounded-2xl shadow p-8">
                <h2 className="text-2xl font-bold mb-6">Enrolled Courses</h2>

                {courses.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        <BookOpen className="w-14 h-14 mx-auto mb-3 opacity-40" />
                        No courses enrolled
                    </div>
                ) : (
                    <div className="space-y-6">
                        {courses.map((c) => (
                            <div
                                key={c.enrollmentId}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                            >
                                {/* HEADER */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{c.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Level: <span className="font-medium">{c.level}</span>
                                        </p>
                                    </div>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-blue-100 text-blue-700"
                                            }`}
                                    >
                                        {c.status.toUpperCase()}
                                    </span>
                                </div>

                                {/* STATS */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-500 mb-1">Fluency</p>
                                        <p className="text-lg font-bold text-purple-600">
                                            {c.progress.fluencyPercent}%
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-500 mb-1">Words Learned</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {c.progress.wordsLearned}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-500 mb-1">Streak</p>
                                        <p className="text-lg font-bold text-orange-600">
                                            {c.progress.streak} days
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs text-gray-500 mb-1">Certificates</p>
                                        <p className="text-lg font-bold text-green-600">
                                            {c.progress.certificatesEarned}
                                        </p>
                                    </div>
                                </div>

                                {/* FOOTER */}
                                <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-500 border-t pt-4">
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Enrolled on <b>{formatDate(c.enrolledAt)}</b>
                                    </span>

                                    {c.completedAt && (
                                        <span className="flex items-center gap-2 text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            Completed on <b>{formatDate(c.completedAt)}</b>
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewStudent;