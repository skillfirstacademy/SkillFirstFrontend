import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { showError, showSuccess } from "../../Componnets/AppToaster";

function MakeAdmin() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged user role
  const token = localStorage.getItem("accessToken");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const isSuperAdmin = payload?.role === "superadmin";

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/admin/users");
      const adminUsers = res.data.filter(
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

    try {
      await adminApi.put(`/admin/users/${userId}/demote`);
      showSuccess("Admin demoted to User");
      fetchAdmins();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to demote admin");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-800">
        Admin Management
      </h2>

      {!isSuperAdmin && (
        <p className="text-red-600 font-semibold mb-4">
          You are not a superadmin. You can view admins but cannot modify their role.
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : admins.length === 0 ? (
        <p>No admin users found</p>
      ) : (
        <div className="space-y-4">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{admin.name}</h3>
                <p>{admin.email}</p>
                <p className="text-sm capitalize text-gray-600">
                  Role: {admin.role}
                </p>
              </div>

              <div>
                {admin.role === "admin" && isSuperAdmin ? (
                  <button
                    onClick={() => demoteAdmin(admin._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Demote
                  </button>
                ) : admin.role === "superadmin" ? (
                  <span className="text-green-700 font-bold">
                    Super Admin
                  </span>
                ) : (
                  <span className="text-gray-500">No Action</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MakeAdmin;
