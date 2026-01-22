import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { showSuccess, showError } from "../../Componnets/AppToaster";

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const makeAdmin = async (userId) => {
    try {
      await adminApi.put(`/admin/users/${userId}/promote`);
      showSuccess("User promoted to Admin");
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to promote user");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-800">All Users</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p>{user.email}</p>
                <p className="text-sm text-gray-600 capitalize">
                  Role: {user.role}
                </p>
              </div>

              <div>
                {user.role === "student" ? (
                  <button
                    onClick={() => makeAdmin(user._id)}
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                  >
                    Make Admin
                  </button>
                ) : (
                  <p className="text-green-700 font-semibold">Admin</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllUsers;
