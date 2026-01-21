import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { showError, showSuccess } from "../../Componnets/AppToaster";

function AllTest() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTest, setEditingTest] = useState(null);
  const [editForm, setEditForm] = useState({
  passingScore: "",
  questions: []
});


  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await adminApi.get("/tests");
      setTests(res.data);
    } catch (err) {
      showError("Failed to fetch tests");
    } finally {
      setLoading(false);
    }
  };

  const deleteTest = async (testId) => {
    if (!window.confirm("Are you sure? This test will be deleted permanently."))
      return;

    try {
      await adminApi.delete(`/tests/${testId}`);
      showSuccess("Test deleted successfully");
      fetchTests();
    } catch (err) {
      showError("Failed to delete test");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">All Tests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : tests.length === 0 ? (
        <p>No tests found</p>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => (
            <div
              key={test._id}
              className="bg-white border rounded-lg p-5 flex justify-between items-center shadow"
            >
              <div>
                <p className="font-bold text-lg">
                  Course: {test.courseId?.title}
                </p>
                <p className="text-purple-700">Video: {test.videoId?.title}</p>
                <p className="text-sm">
                  Stage: <b>{test.stage}</b>
                </p>
                <p className="text-sm">Questions: {test.questions.length}</p>
              </div>

              <div className="flex gap-3">
                <button
  onClick={() => {
    setEditingTest(test);
    setEditForm({
      passingScore: test.passingScore,
      questions: JSON.parse(JSON.stringify(test.questions)) // deep clone
    });
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  Edit
</button>


                <button
                  onClick={() => deleteTest(test._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
    {editingTest && (
  <div key={editingTest._id}>

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">
              Edit Test for: {editingTest.videoId?.title}
            </h2>

            {/* Passing Score */}
            <div className="mb-6">
              <label className="block font-semibold mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                value={editForm.passingScore}
                min="1"
                max="100"
                onChange={(e) =>
                  setEditForm({ ...editForm, passingScore: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Questions */}
            <h3 className="text-xl font-bold mb-3">Questions</h3>

            {editForm.questions.map((q, index) => (
              <div
                key={index}
                className="bg-purple-50 p-4 rounded-lg mb-4 border"
              >
                <label className="font-semibold">Question {index + 1}</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => {
                    const updated = [...editForm.questions];
                    updated[index].question = e.target.value;
                    setEditForm({ ...editForm, questions: updated });
                  }}
                  className="w-full border p-2 rounded mt-2"
                />

                {/* Options */}
                {["optionA", "optionB", "optionC", "optionD"].map((opt) => (
                  <input
                    key={opt}
                    type="text"
                    value={q[opt]}
                    placeholder={opt.toUpperCase()}
                    onChange={(e) => {
                      const updated = [...editForm.questions];
                      updated[index][opt] = e.target.value;
                      setEditForm({ ...editForm, questions: updated });
                    }}
                    className="w-full border p-2 rounded mt-2"
                  />
                ))}

                {/* Correct Answer */}
                <label className="block font-semibold mt-3">
                  Correct Answer (1–4)
                </label>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => {
                    const updated = [...editForm.questions];
                    updated[index].correctAnswer = Number(e.target.value);
                    setEditForm({ ...editForm, questions: updated });
                  }}
                  className="w-full border p-2 rounded mt-2"
                >
                  <option value="">Select Correct Answer</option>
                  <option value={1}>Option A</option>
                  <option value={2}>Option B</option>
                  <option value={3}>Option C</option>
                  <option value={4}>Option D</option>
                </select>

                {/* Delete Question */}
                <button
                  className="mt-3 px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => {
                    const updated = editForm.questions.filter(
                      (_, i) => i !== index,
                    );
                    setEditForm({ ...editForm, questions: updated });
                  }}
                >
                  Remove Question
                </button>
              </div>
            ))}

            {/* Add Question */}
            <button
              onClick={() =>
                setEditForm({
                  ...editForm,
                  questions: [
                    ...editForm.questions,
                    {
                      question: "",
                      optionA: "",
                      optionB: "",
                      optionC: "",
                      optionD: "",
                      correctAnswer: "",
                    },
                  ],
                })
              }
              className="px-4 py-2 bg-purple-700 text-white rounded mb-4"
            >
              + Add Question
            </button>

            {/* Save Button */}
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={() => setEditingTest(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await adminApi.put(`/tests/${editingTest._id}`, editForm);
                    showSuccess("Test updated successfully!");
                    setEditingTest(null);
                    fetchTests();
                  } catch (err) {
                    showError("Failed to update test");
                  }
                }}
                className="px-4 py-2 bg-purple-700 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
        </div>
      )}
      
    </div>
  
  );
}

export default AllTest;
