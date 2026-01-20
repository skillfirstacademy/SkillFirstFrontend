import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../Componnets/AppToaster";
import { logout } from "../../Features/authSlice";
import api from "../../api/axios";

const StatCard = ({ title, value, subtitle }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
    </div>
);

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch (err) {
            console.log("LOGOUT ERROR STATUS:", err.response?.status);
            console.log("LOGOUT ERROR DATA:", err.response?.data);
            console.log("ERROR :", err);
        } finally {
            dispatch(logout());
            localStorage.removeItem("deviceId");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            navigate("/login");
            showSuccess("Logged out successfully");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-gray-300" />
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Asif</h2>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-600 font-medium hover:underline hover:text-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Top Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fluency */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">Fluency</p>

                    <div className="flex items-center justify-center">
                        <div className="relative h-32 w-32 rounded-full border-4 border-gray-300 flex items-center justify-center">
                            <span className="text-2xl font-semibold text-gray-900">
                                1%
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Fluent in <span className="font-medium">Japanese</span>
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <StatCard title="Words learned" value="2" />
                        <StatCard title="Certificates" value="0" />
                    </div>
                </div>

                {/* Right Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <StatCard title="Corrections given" value="0" />
                    <StatCard title="Thumbs up" value="0" />
                    <StatCard title="Best corrections" value="0" />
                    <StatCard title="Active day" value="1" />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
                <p className="text-sm font-medium text-gray-900 mb-4">
                    Daily streak
                </p>

                <div className="flex gap-3">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                        <div
                            key={day}
                            className={`h-9 w-9 rounded-full flex items-center justify-center text-sm ${i === 0
                                ? "bg-gray-900 text-white"
                                : "bg-gray-200 text-gray-500"
                                }`}
                        >
                            {day[0]}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
