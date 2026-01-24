import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { showSuccess, showError } from "../../Componnets/AppToaster";

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [blockedStudents, setBlockedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "blocked"
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      showError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedStudents = async () => {
    try {
      const res = await adminApi.get("/admin/users/blocked");
      setBlockedStudents(res.data.students || []);
    } catch (err) {
      showError("Failed to fetch blocked students");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBlockedStudents();
  }, []);

  const makeAdmin = async (userId) => {
    setActionLoading(userId);
    try {
      await adminApi.put(`/admin/users/${userId}/promote`);
      showSuccess("User promoted to Admin");
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to promote user");
    } finally {
      setActionLoading(null);
    }
  };

  const blockStudent = async (userId) => {
    setActionLoading(userId);
    try {
      await adminApi.put(`/admin/users/${userId}/block`);
      showSuccess("User blocked successfully");
      fetchUsers();
      fetchBlockedStudents();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to block user");
    } finally {
      setActionLoading(null);
    }
  };

  const unblockStudent = async (userId) => {
    setActionLoading(userId);
    try {
      await adminApi.put(`/admin/users/${userId}/unblock`);
      showSuccess("User unblocked successfully");
      fetchUsers();
      fetchBlockedStudents();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to unblock user");
    } finally {
      setActionLoading(null);
    }
  };

  const blockAllStudents = async () => {
    if (!window.confirm("Are you sure you want to block ALL students?")) {
      return;
    }
    
    setActionLoading("blockAll");
    try {
      const res = await adminApi.post("/admin/users/block-all");
      showSuccess(`${res.data.blockedCount} students blocked successfully`);
      fetchUsers();
      fetchBlockedStudents();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to block all students");
    } finally {
      setActionLoading(null);
    }
  };

  const unblockAllStudents = async () => {
    if (!window.confirm("Are you sure you want to unblock ALL students?")) {
      return;
    }
    
    setActionLoading("unblockAll");
    try {
      const res = await adminApi.post("/admin/users/unblock-all");
      showSuccess(`${res.data.unblockedCount} students unblocked successfully`);
      fetchUsers();
      fetchBlockedStudents();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to unblock all students");
    } finally {
      setActionLoading(null);
    }
  };

  const renderUserCard = (user) => (
    <div
      key={user._id}
      className={`p-4 bg-white shadow rounded-lg flex justify-between items-center ${
        user.isBlocked || user.isBlockedAll ? "border-l-4 border-red-500" : ""
      }`}
    >
      <div>
        <h3 className="text-lg font-semibold">{user.name}</h3>
        <p className="text-gray-700">{user.email}</p>
        <p className="text-sm text-gray-600 capitalize">
          Role: {user.role}
        </p>
        {(user.isBlocked || user.isBlockedAll) && (
          <p className="text-sm text-red-600 font-semibold mt-1">
            ⛔ Blocked {user.blockedAt && `• ${new Date(user.blockedAt).toLocaleDateString()}`}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        {user.role === "student" && (
          <>
            {user.isBlocked || user.isBlockedAll ? (
              <button
                onClick={() => unblockStudent(user._id)}
                disabled={actionLoading === user._id}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === user._id ? "..." : "Unblock"}
              </button>
            ) : (
              <button
                onClick={() => blockStudent(user._id)}
                disabled={actionLoading === user._id}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === user._id ? "..." : "Block"}
              </button>
            )}
            
            <button
              onClick={() => makeAdmin(user._id)}
              disabled={actionLoading === user._id}
              className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === user._id ? "..." : "Make Admin"}
            </button>
          </>
        )}
        
        {(user.role === "admin" || user.role === "superadmin") && (
          <p className="text-green-700 font-semibold">
            {user.role === "superadmin" ? "Super Admin" : "Admin"}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-purple-800">User Management</h2>
        
        <div className="flex gap-2">
          <button
            onClick={blockAllStudents}
            disabled={actionLoading === "blockAll"}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === "blockAll" ? "Blocking..." : "Block All Students"}
          </button>
          
          <button
            onClick={unblockAllStudents}
            disabled={actionLoading === "unblockAll"}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === "unblockAll" ? "Unblocking..." : "Unblock All Students"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "all"
              ? "text-purple-700 border-b-2 border-purple-700"
              : "text-gray-600 hover:text-purple-700"
          }`}
        >
          All Users ({users.length})
        </button>
        
        <button
          onClick={() => setActiveTab("blocked")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "blocked"
              ? "text-purple-700 border-b-2 border-purple-700"
              : "text-gray-600 hover:text-purple-700"
          }`}
        >
          Blocked Students ({blockedStudents.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === "all" ? (
            users.length > 0 ? (
              users.map(renderUserCard)
            ) : (
              <p className="text-center text-gray-500 py-8">No users found</p>
            )
          ) : (
            blockedStudents.length > 0 ? (
              blockedStudents.map(renderUserCard)
            ) : (
              <p className="text-center text-gray-500 py-8">No blocked students</p>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default AllUsers;