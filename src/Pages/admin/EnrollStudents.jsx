import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { showError, showSuccess } from "../../Componnets/AppToaster";

function EnrollStudents() {
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState(null);
  const [adminEnrollments, setAdminEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    additionalPayment: "",
    paymentMethod: "cash",
    paymentNotes: "",
    level: ""
  });
  const [updating, setUpdating] = useState(false);

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
      console.log("All enrollments response:", res.data);
      setEnrollments(res.data.data || res.data || []);
    } catch (err) {
      showError("Failed to load enrollments");
      console.error("Fetch enrollments error:", err);
    }
  };

  // 🔵 2) Fetch Statistics
  const fetchStats = async () => {
    try {
      const res = await adminApi.get("/admin/enrollments/stats");
      setStats(res.data.stats || res.data);
    } catch (err) {
      showError("Failed to load stats");
      console.error("Fetch stats error:", err);
    }
  };

  // 🟠 3) Fetch Enrollments by Current Admin
  const fetchAdminEnrollments = async () => {
    try {
      const res = await adminApi.get("/admin/enrollments/by-admin");
      console.log("Admin enrollments response:", res.data);
      setAdminEnrollments(res.data.data || res.data || []);
    } catch (err) {
      showError("Failed to load admin enrollments");
      console.error("Fetch admin enrollments error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPaymentModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    const currentAmount = enrollment.payment?.amount || 0;
    const coursePrice = enrollment.course?.price || 0;
    const remaining = Math.max(0, coursePrice - currentAmount);
    
    setPaymentForm({
      additionalPayment: remaining.toString(),
      paymentMethod: "cash",
      paymentNotes: "",
      level: enrollment.level || ""
    });
    setPaymentModal(true);
  };

  const handleUpdatePayment = async () => {
    if (!paymentForm.additionalPayment || parseFloat(paymentForm.additionalPayment) <= 0) {
      return showError("Please enter a valid payment amount");
    }

    setUpdating(true);

    try {
      const res = await adminApi.put(
        `/admin/enrollments/${selectedEnrollment._id}/payment`,
        {
          additionalPayment: parseFloat(paymentForm.additionalPayment),
          paymentMethod: paymentForm.paymentMethod,
          paymentNotes: paymentForm.paymentNotes,
          level: paymentForm.level || undefined
        }
      );

      showSuccess("Payment updated successfully!");
      
      // Refresh data
      await fetchAllEnrollments();
      await fetchStats();
      await fetchAdminEnrollments();
      
      // Close modal
      setPaymentModal(false);
      setSelectedEnrollment(null);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update payment");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading enrollments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* 📊 Stats Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold">Enrollment Dashboard</h2>
        <p className="text-purple-200 mt-1">Overview of all enrollments</p>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <StatBox title="Total Enrollments" value={stats.totalEnrollments || 0} />
            <StatBox title="Admin Enrollments" value={stats.adminEnrollments || 0} />
            <StatBox title="Paid Enrollments" value={stats.paidEnrollments || 0} />
            <StatBox 
              title="Total Revenue" 
              value={`₹${stats.totalRevenue || 0}`} 
            />
          </div>
        )}
      </div>

      {/* 🟣 ALL ENROLLED STUDENTS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-purple-900">All Enrolled Students</h2>
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {enrollments.length} total
          </span>
        </div>
        <EnrollmentTable 
          enrollments={enrollments} 
          onUpdatePayment={handleOpenPaymentModal}
        />
      </section>

      {/* 🔵 ENROLLMENTS BY THIS ADMIN */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-purple-900">
            Enrollments Done By You (Admin)
          </h2>
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {adminEnrollments.length} total
          </span>
        </div>
        <EnrollmentTable 
          enrollments={adminEnrollments}
          onUpdatePayment={handleOpenPaymentModal}
        />
      </section>

      {/* Payment Update Modal */}
      {paymentModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-700 to-purple-900 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Update Payment</h2>
                  <p className="text-purple-200 text-sm mt-1">
                    {selectedEnrollment.user?.name} - {selectedEnrollment.course?.title}
                  </p>
                </div>
                <button
                  onClick={() => setPaymentModal(false)}
                  className="text-white hover:text-red-300 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Payment Info */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Current Payment Status</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Course Price:</span>
                    <span className="font-semibold text-purple-900">
                      ₹{selectedEnrollment.course?.price || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Amount Paid:</span>
                    <span className="font-semibold text-purple-900">
                      ₹{selectedEnrollment.payment?.amount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-purple-200 pt-1 mt-1">
                    <span className="text-purple-700 font-medium">Remaining:</span>
                    <span className="font-bold text-red-600">
                      ₹{Math.max(0, (selectedEnrollment.course?.price || 0) - (selectedEnrollment.payment?.amount || 0))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Payment */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-2">
                  Additional Payment Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={paymentForm.additionalPayment}
                    onChange={(e) => setPaymentForm({ ...paymentForm, additionalPayment: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    placeholder="Enter amount"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the amount being paid now
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Level (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-2">
                  Student Level (Optional)
                </label>
                <select
                  value={paymentForm.level}
                  onChange={(e) => setPaymentForm({ ...paymentForm, level: e.target.value })}
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">-- No Change --</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Payment Notes */}
              <div>
                <label className="block text-sm font-semibold text-purple-900 mb-2">
                  Payment Notes (Optional)
                </label>
                <textarea
                  value={paymentForm.paymentNotes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentNotes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  placeholder="Add any notes about this payment..."
                />
              </div>

              {/* Summary */}
              {paymentForm.additionalPayment && parseFloat(paymentForm.additionalPayment) > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900">
                        Payment Summary
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        New Total: ₹{(selectedEnrollment.payment?.amount || 0) + parseFloat(paymentForm.additionalPayment)}
                        <br />
                        {(selectedEnrollment.payment?.amount || 0) + parseFloat(paymentForm.additionalPayment) >= (selectedEnrollment.course?.price || 0) && (
                          <span className="font-semibold text-green-800">
                            ✓ Status will change to PAID
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setPaymentModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                  disabled={updating}
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdatePayment}
                  disabled={updating || !paymentForm.additionalPayment || parseFloat(paymentForm.additionalPayment) <= 0}
                  className="flex-1 px-4 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Payment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 📌 Small Reusable Component */
function StatBox({ title, value }) {
  return (
    <div className="bg-purple-800 p-4 rounded-lg shadow text-center hover:bg-purple-900 transition">
      <div className="text-purple-300 text-sm">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

/* 📌 Table Component */
function EnrollmentTable({ enrollments, onUpdatePayment }) {
  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-500 text-lg font-medium">No enrollments found</p>
        <p className="text-gray-400 text-sm mt-1">Enrollments will appear here once students are enrolled</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-purple-100 text-purple-900">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">#</th>
              <th className="p-3 text-left text-sm font-semibold">Student</th>
              <th className="p-3 text-left text-sm font-semibold">Email</th>
              <th className="p-3 text-left text-sm font-semibold">Course</th>
              <th className="p-3 text-left text-sm font-semibold">Status</th>
              <th className="p-3 text-left text-sm font-semibold">Amount</th>
              <th className="p-3 text-left text-sm font-semibold">Enrolled By</th>
              <th className="p-3 text-left text-sm font-semibold">Date</th>
              <th className="p-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {enrollments.map((e, index) => {
              const amount = e.payment?.amount || e.amount || e.price || 0;
              const coursePrice = e.course?.price || 0;
              const isPaid = amount >= coursePrice;
              
              return (
                <tr key={e._id} className="border-t hover:bg-purple-50 transition">
                  <td className="p-3 text-sm text-gray-600">{index + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold text-sm">
                        {e.user?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <span className="font-medium text-gray-900">
                        {e.user?.name || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {e.user?.email || "N/A"}
                  </td>
                  <td className="p-3 text-sm font-medium text-gray-900">
                    {e.course?.title || "N/A"}
                  </td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      e.status === 'active' || e.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : e.status === 'completed'
                        ? 'bg-blue-100 text-blue-700'
                        : e.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {e.status || "N/A"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        ₹{amount}
                      </span>
                      {!isPaid && coursePrice > 0 && (
                        <span className="text-xs text-red-600">
                          of ₹{coursePrice}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {e.enrolledBy?.name || "Admin"}
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {e.startedAt || e.createdAt 
                      ? new Date(e.startedAt || e.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onUpdatePayment(e)}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                        title="Update payment"
                      >
                        Update Payment
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnrollStudents;