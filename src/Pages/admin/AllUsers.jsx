import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { showSuccess, showError } from "../../Componnets/AppToaster";

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [blockedStudents, setBlockedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/admin/users");
      const userData = res.data.users || res.data || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

const fetchBlockedStudents = async () => {
  try {
    // Change from '/admin/users/blocked' to '/admin/users/all-blocked'
    const res = await adminApi.get("/admin/users/all-blocked");
    const blockedData = res.data.students || res.data || [];
    setBlockedStudents(Array.isArray(blockedData) ? blockedData : []);
  } catch (err) {
    console.error("Blocked students error:", err);
    setBlockedStudents([]);
  }
};

  useEffect(() => {
    fetchUsers();
    fetchBlockedStudents();
  }, []);

  const makeAdmin = async (userId) => {
    if (!window.confirm("Are you sure you want to make this user an admin?")) {
      return;
    }

    setActionLoading(userId);
    try {
      await adminApi.put(`/admin/users/${userId}/promote`);
      showSuccess("User promoted to Admin");
      await fetchUsers();
      await fetchBlockedStudents();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to promote user");
    } finally {
      setActionLoading(null);
    }
  };

  const blockStudent = async (userId) => {
    if (!window.confirm("Are you sure you want to block this user?")) {
      return;
    }

    setActionLoading(userId);
    try {
      const res = await adminApi.put(`/admin/users/${userId}/block`);
      showSuccess("User blocked successfully");
      
      // Optimistic update: set isBlocked = true, isBlockedAll stays as is
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId 
            ? { 
                ...user, 
                isBlocked: true,
                blockedAt: new Date().toISOString() 
              }
            : user
        )
      );
      
      // Refresh from server to get accurate state
      await fetchUsers();
      await fetchBlockedStudents();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to block user");
      await fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const unblockStudent = async (userId) => {
    if (!window.confirm("Are you sure you want to unblock this user?")) {
      return;
    }

    setActionLoading(userId);
    try {
      await adminApi.put(`/admin/users/${userId}/unblock`);
      showSuccess("User unblocked successfully");
      
      // Optimistic update: set both isBlocked and isBlockedAll to false
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId 
            ? { 
                ...user, 
                isBlocked: false, 
                isBlockedAll: false, 
                blockedAt: null 
              }
            : user
        )
      );
      
      await fetchUsers();
      await fetchBlockedStudents();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to unblock user");
      await fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const blockAllStudents = async () => {
    if (!window.confirm("⚠️ Are you sure you want to block ALL students? This will block every student account.")) {
      return;
    }
    
    setActionLoading("blockAll");
    try {
      const res = await adminApi.post("/admin/users/block-all");
      const count = res.data.blockedCount || res.data.count || 0;
      showSuccess(`${count} student(s) blocked successfully`);
      
      // Optimistic update: set isBlockedAll = true for all students
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.role === "student" 
            ? { 
                ...user, 
                isBlockedAll: true,  // ← This should be TRUE
                blockedAt: new Date().toISOString() 
              }
            : user
        )
      );
      
      await fetchUsers();
      await fetchBlockedStudents();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to block all students");
      await fetchUsers();
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
      const count = res.data.unblockedCount || res.data.count || 0;
      showSuccess(`${count} student(s) unblocked successfully`);
      
      // Optimistic update: set both flags to false for all students
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.role === "student" 
            ? { 
                ...user, 
                isBlocked: false,      // ← FALSE
                isBlockedAll: false,   // ← FALSE
                blockedAt: null 
              }
            : user
        )
      );
      
      await fetchUsers();
      await fetchBlockedStudents();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to unblock all students");
      await fetchUsers();
    } finally {
      setActionLoading(null);
    }
  };

  const renderUserCard = (user) => {
    const isBlocked = user.isBlocked || user.isBlockedAll;
    
    return (
      <div
        key={user._id}
        className={`p-4 bg-white shadow rounded-lg flex justify-between items-center transition-all ${
          isBlocked ? "border-l-4 border-red-500 bg-red-50" : ""
        }`}
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{user.name || "N/A"}</h3>
          <p className="text-gray-700">{user.email || "N/A"}</p>
          <p className="text-sm text-gray-600 capitalize">
            Role: {user.role || "N/A"}
          </p>
          
          {/* Show blocking status */}
          {isBlocked && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600 font-semibold">⛔ Blocked</span>
                {user.isBlocked && (
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded">
                    Individual Block
                  </span>
                )}
                {user.isBlockedAll && (
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded">
                    Block All
                  </span>
                )}
              </div>
              {user.blockedAt && (
                <p className="text-xs text-red-500">
                  {new Date(user.blockedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {user.role === "student" && (
            <>
              {isBlocked ? (
                <button
                  onClick={() => unblockStudent(user._id)}
                  disabled={actionLoading === user._id}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading === user._id ? "Unblocking..." : "Unblock"}
                </button>
              ) : (
                <button
                  onClick={() => blockStudent(user._id)}
                  disabled={actionLoading === user._id}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading === user._id ? "Blocking..." : "Block"}
                </button>
              )}
              
              <button
                onClick={() => makeAdmin(user._id)}
                disabled={actionLoading === user._id || isBlocked}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={isBlocked ? "Unblock user first to promote" : "Promote to admin"}
              >
                {actionLoading === user._id ? "Promoting..." : "Make Admin"}
              </button>
            </>
          )}
          
          {(user.role === "admin" || user.role === "superadmin") && (
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
              {user.role === "superadmin" ? "🛡️ Super Admin" : "👤 Admin"}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-purple-800">User Management</h2>
          <p className="text-gray-600 mt-1">Manage user roles and access permissions</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={blockAllStudents}
            disabled={actionLoading === "blockAll"}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {actionLoading === "blockAll" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Blocking...
              </>
            ) : (
              "🚫 Block All Students"
            )}
          </button>
          
          <button
            onClick={unblockAllStudents}
            disabled={actionLoading === "unblockAll"}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {actionLoading === "unblockAll" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Unblocking...
              </>
            ) : (
              "✅ Unblock All Students"
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "all"
              ? "text-purple-700 border-b-2 border-purple-700"
              : "text-gray-600 hover:text-purple-700"
          }`}
        >
          All Users ({users.length})
        </button>
        
        <button
          onClick={() => setActiveTab("blocked")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "blocked"
              ? "text-purple-700 border-b-2 border-purple-700"
              : "text-gray-600 hover:text-purple-700"
          }`}
        >
          Blocked Students ({blockedStudents.length})
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === "all" ? (
            users.length > 0 ? (
              users.map(renderUserCard)
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">No users found</p>
              </div>
            )
          ) : (
            blockedStudents.length > 0 ? (
              blockedStudents.map(renderUserCard)
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">No blocked students</p>
                <p className="text-gray-400 text-sm mt-2">All students are currently active</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default AllUsers;