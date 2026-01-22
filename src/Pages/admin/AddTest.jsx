import React, { useState, useEffect } from "react";
import adminApi from "../../api/adminApi";
import { showSuccess, showError } from "../../Componnets/AppToaster";

function AddTest() {
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");
  const [stage, setStage] = useState("beginner");

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""], // Array of 4 options
      correctAnswer: 0, // Index 0-3
    },
  ]);

  const [passingScore, setPassingScore] = useState(70);
  const [loading, setLoading] = useState(false);

  // Fetch courses on load
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await adminApi.get("/courses");
      setCourses(res.data?.courses || []);
    } catch (err) {
      showError("Failed to load courses");
      setCourses([]);
    }
  };

  // Fetch videos when course selected
  const fetchVideos = async (courseId) => {
    try {
      const res = await adminApi.get(`/videos/course/${courseId}`);
      setVideos(res.data);
    } catch (err) {
      showError("Failed to load videos");
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      return showError("You must have at least one question");
    }
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse) return showError("Please select a course");
    if (!selectedVideo) return showError("Please select a video");

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        return showError(`Question ${i + 1} is empty`);
      }
      if (q.options.some(opt => !opt.trim())) {
        return showError(`All options for question ${i + 1} must be filled`);
      }
      if (q.correctAnswer === "" || q.correctAnswer === null) {
        return showError(`Please select correct answer for question ${i + 1}`);
      }
    }

    setLoading(true);

    try {
      const payload = {
        courseId: selectedCourse,
        stage,
        passingScore: Number(passingScore),
        questions: questions.map(q => ({
          question: q.question.trim(),
          options: q.options.map(opt => opt.trim()),
          correctAnswer: Number(q.correctAnswer)
        }))
      };

      console.log("Sending test data:", payload); // Debug log

      await adminApi.post(`/tests/video/${selectedVideo}`, payload);

      showSuccess("Test created successfully!");

      // Reset form
      setSelectedCourse("");
      setSelectedVideo("");
      setStage("beginner");
      setPassingScore(70);
      setVideos([]);
      setQuestions([
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ]);
    } catch (err) {
      console.error("Error creating test:", err);
      showError(err.response?.data?.message || "Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          <h2 className="text-3xl font-bold text-purple-900 mb-2">Add Test</h2>
          <p className="text-purple-600 mb-6">Create a new test for a video</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Selection */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Course *
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedVideo("");
                  setVideos([]);
                  if (e.target.value) {
                    fetchVideos(e.target.value);
                  }
                }}
                className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">-- Choose a Course --</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Video Selection */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Video *
              </label>
              <select
                value={selectedVideo}
                onChange={(e) => setSelectedVideo(e.target.value)}
                className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={!selectedCourse}
                required
              >
                <option value="">-- Choose a Video --</option>
                {videos.length > 0 ? (
                  videos.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.title} ({v.stage})
                    </option>
                  ))
                ) : (
                  <option disabled>
                    {selectedCourse ? "No videos available" : "Select a course first"}
                  </option>
                )}
              </select>
            </div>

            {/* Stage */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Stage *
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Passing Score */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Passing Score (%) *
              </label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="1"
                max="100"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum percentage required to pass (1-100)
              </p>
            </div>

            {/* Questions */}
            <div className="border-t border-purple-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <label className="text-xl font-bold text-purple-900">Questions</label>
                <span className="text-sm text-gray-600">
                  {questions.length} question{questions.length !== 1 ? 's' : ''}
                </span>
              </div>

              {questions.map((q, questionIndex) => (
                <div key={questionIndex} className="border border-purple-200 p-6 rounded-xl mb-4 bg-gradient-to-br from-purple-50 to-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-purple-900">
                      Question {questionIndex + 1}
                    </h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Question Text *
                    </label>
                    <textarea
                      placeholder="Enter your question here..."
                      value={q.question}
                      onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                      className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="2"
                      required
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mb-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Options *
                    </label>
                    {["A", "B", "C", "D"].map((letter, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-3">
                        <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                          {letter}
                        </span>
                        <input
                          type="text"
                          placeholder={`Option ${letter}`}
                          value={q.options[optionIndex]}
                          onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                          className="flex-1 p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Answer */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Correct Answer *
                    </label>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestion(questionIndex, "correctAnswer", Number(e.target.value))}
                      className="w-full p-3 border border-green-300 bg-green-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">-- Select Correct Option --</option>
                      <option value={0}>Option A: {q.options[0] || "(empty)"}</option>
                      <option value={1}>Option B: {q.options[1] || "(empty)"}</option>
                      <option value={2}>Option C: {q.options[2] || "(empty)"}</option>
                      <option value={3}>Option D: {q.options[3] || "(empty)"}</option>
                    </select>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className="w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold rounded-lg transition border-2 border-dashed border-purple-300"
              >
                ➕ Add Another Question
              </button>
            </div>

            {/* Submit Button */}
            <div className="border-t border-purple-200 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white p-4 rounded-lg font-bold text-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Test..." : "Create Test"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTest;