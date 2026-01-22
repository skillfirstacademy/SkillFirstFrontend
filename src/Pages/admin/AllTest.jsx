import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { showError, showSuccess } from "../../Componnets/AppToaster";

function AllTest() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTest, setEditingTest] = useState(null);
  const [viewingTest, setViewingTest] = useState(null); // NEW: For viewing test
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

  const handleEditTest = (test) => {
    setEditingTest(test);
    setEditForm({
      passingScore: test.passingScore,
      questions: JSON.parse(JSON.stringify(test.questions)) // deep clone
    });
  };

  const handleViewTest = (test) => {
    setViewingTest(test);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...editForm.questions];
    updated[questionIndex].options[optionIndex] = value;
    setEditForm({ ...editForm, questions: updated });
  };

  const saveTestChanges = async () => {
    try {
      // Validate before saving
      for (let i = 0; i < editForm.questions.length; i++) {
        const q = editForm.questions[i];
        if (!q.question.trim()) {
          return showError(`Question ${i + 1} text is empty`);
        }
        if (q.options.some(opt => !opt.trim())) {
          return showError(`All options for question ${i + 1} must be filled`);
        }
        if (q.correctAnswer === "" || q.correctAnswer === null) {
          return showError(`Please select correct answer for question ${i + 1}`);
        }
      }

      await adminApi.put(`/tests/${editingTest._id}`, editForm);
      showSuccess("Test updated successfully!");
      setEditingTest(null);
      fetchTests();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update test");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          <h2 className="text-3xl font-bold text-purple-900 mb-2">All Tests</h2>
          <p className="text-purple-600 mb-6">Manage all course tests</p>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
              <p className="text-purple-700">Loading tests...</p>
            </div>
          ) : tests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600 text-lg">No tests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tests.map((test) => (
                <div
                  key={test._id}
                  className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 rounded-xl p-6 shadow-md hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                          {test.stage?.toUpperCase()}
                        </span>
                        <h3 className="font-bold text-xl text-purple-900">
                          {test.courseId?.title || "Unknown Course"}
                        </h3>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-700">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Video:</span>
                          <span className="text-purple-700">{test.videoId?.title || "Unknown Video"}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Questions:</span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {test.questions?.length || 0}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Passing Score:</span>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            {test.passingScore}%
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleViewTest(test)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleEditTest(test)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteTest(test._id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* VIEW TEST MODAL */}
      {viewingTest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-purple-900">
                  {viewingTest.courseId?.title || "Test Details"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Video: {viewingTest.videoId?.title} • 
                  {viewingTest.questions?.length || 0} Questions • 
                  {viewingTest.passingScore}% to pass
                </p>
              </div>
              <button
                onClick={() => setViewingTest(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {viewingTest.questions && viewingTest.questions.length > 0 ? (
                <div className="space-y-6">
                  {viewingTest.questions.map((question, idx) => {
                    const questionText = question.question;
                    const options = question.options || [];
                    const correctAnswer = question.correctAnswer;
                    
                    return (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-5 bg-gray-50"
                      >
                        <div className="flex gap-3 mb-4">
                          <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full font-medium flex-shrink-0">
                            Q{idx + 1}
                          </span>
                          <p className="font-medium text-gray-800 flex-1">
                            {questionText}
                          </p>
                        </div>

                        {options.length > 0 ? (
                          <div className="ml-12 space-y-2">
                            {options.map((option, optIdx) => {
                              const isCorrect = correctAnswer === optIdx;
                              
                              return (
                                <div
                                  key={optIdx}
                                  className={`p-3 rounded-lg border transition ${
                                    isCorrect
                                      ? 'bg-green-50 border-green-400 text-green-900'
                                      : 'bg-white border-gray-300 text-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className={`font-bold text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      isCorrect 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-200 text-gray-700'
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className="flex-1">{option}</span>
                                    {isCorrect && (
                                      <span className="text-green-600 font-bold flex items-center gap-1">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Correct
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="ml-12 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                            ⚠️ No options available for this question
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No questions available
                </p>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3">
              <button
                onClick={() => setViewingTest(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEditTest(viewingTest);
                  setViewingTest(null);
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
              >
                Edit Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TEST MODAL */}
      {editingTest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">
              Edit Test for: {editingTest.videoId?.title}
            </h2>

            {/* Passing Score */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Passing Score (%)
              </label>
              <input
                type="number"
                value={editForm.passingScore}
                min="1"
                max="100"
                onChange={(e) =>
                  setEditForm({ ...editForm, passingScore: Number(e.target.value) })
                }
                className="w-full border border-purple-200 p-3 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Questions */}
            <h3 className="text-xl font-bold mb-4">Questions</h3>

            {editForm.questions.map((q, index) => (
              <div
                key={index}
                className="bg-purple-50 p-5 rounded-lg mb-4 border border-purple-200"
              >
                <div className="flex justify-between items-center mb-3">
                  <label className="font-bold text-purple-900">Question {index + 1}</label>
                  <button
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                    onClick={() => {
                      if (editForm.questions.length === 1) {
                        return showError("Test must have at least one question");
                      }
                      const updated = editForm.questions.filter((_, i) => i !== index);
                      setEditForm({ ...editForm, questions: updated });
                    }}
                  >
                    🗑️ Remove
                  </button>
                </div>

                {/* Question Text */}
                <label className="block text-sm font-semibold mb-2">Question Text</label>
                <textarea
                  value={q.question}
                  onChange={(e) => {
                    const updated = [...editForm.questions];
                    updated[index].question = e.target.value;
                    setEditForm({ ...editForm, questions: updated });
                  }}
                  className="w-full border border-purple-200 p-3 rounded-lg mb-3 focus:ring-2 focus:ring-purple-500"
                  rows="2"
                />

                {/* Options */}
                <label className="block text-sm font-semibold mb-2">Options</label>
                {["A", "B", "C", "D"].map((letter, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-3 mb-2">
                    <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {letter}
                    </span>
                    <input
                      type="text"
                      value={q.options[optIdx]}
                      placeholder={`Option ${letter}`}
                      onChange={(e) => updateOption(index, optIdx, e.target.value)}
                      className="flex-1 border border-purple-200 p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                ))}

                {/* Correct Answer */}
                <label className="block text-sm font-semibold mt-4 mb-2">
                  Correct Answer
                </label>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => {
                    const updated = [...editForm.questions];
                    updated[index].correctAnswer = Number(e.target.value);
                    setEditForm({ ...editForm, questions: updated });
                  }}
                  className="w-full border border-green-300 bg-green-50 p-3 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Select Correct Answer --</option>
                  <option value={0}>Option A: {q.options[0] || "(empty)"}</option>
                  <option value={1}>Option B: {q.options[1] || "(empty)"}</option>
                  <option value={2}>Option C: {q.options[2] || "(empty)"}</option>
                  <option value={3}>Option D: {q.options[3] || "(empty)"}</option>
                </select>
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
                      options: ["", "", "", ""],
                      correctAnswer: 0,
                    },
                  ],
                })
              }
              className="w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-lg mb-4 border-2 border-dashed border-purple-300"
            >
              ➕ Add Question
            </button>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 gap-3 border-t pt-4">
              <button
                onClick={() => setEditingTest(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveTestChanges}
                className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllTest;