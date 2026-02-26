import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { showError } from "../../Componnets/AppToaster";

function StudentTestAttemptsPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const res = await adminApi.get("/test-attempt/my");
      setAttempts(res.data || []);
    } catch (err) {
      showError("Failed to load test attempts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading attempts...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Test Attempts</h1>

        {attempts.length === 0 ? (
          <p>No test attempts found</p>
        ) : (
          <div className="space-y-4">
            {attempts.map((a) => (
              <div
                key={a._id}
                className="bg-white rounded-xl shadow p-5 border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      📘 Course: {a.videoId?.courseId?.title}
                    </h3>
                    <p className="text-gray-700">
                      🎥 Video: {a.videoId?.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Attempted on{" "}
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      Score: {a.score}%
                    </p>
                    <p
                      className={`font-semibold ${
                        a.isPassed
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {a.isPassed ? "PASSED" : "FAILED"}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  Correct: {a.correctCount} / {a.totalQuestions}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentTestAttemptsPage;
