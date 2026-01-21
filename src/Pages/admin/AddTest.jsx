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
    { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "" }
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
      setCourses(res.data);
    } catch (err) {
      showError("Failed to load courses");
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
      { question: "", optionA: "", optionB: "", optionC: "", optionD: "", answer: "" }
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedVideo) return showError("Please select a video");

    setLoading(true);

    try {
      await adminApi.post(`/tests/video/${selectedVideo}`, {
        courseId: selectedCourse,
        stage,
        passingScore,
        questions,
      });

      showSuccess("Test created successfully!");

      // Reset
      setSelectedCourse("");
      setSelectedVideo("");
      setStage("beginner");
      setPassingScore(70);
      setQuestions([
        { question: "", optionA: "", optionB: "", optionC: "", optionD: "", answer: "" }
      ]);

    } catch (err) {
      showError(err.response?.data?.message || "Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Add Test</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Course Selection */}
        <div>
          <label className="block mb-2 font-semibold">Select Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              fetchVideos(e.target.value);
            }}
            className="w-full border rounded p-2"
          >
            <option value="">-- Choose a Course --</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Video Selection */}
        <div>
          <label className="block mb-2 font-semibold">Select Video</label>
          <select
            value={selectedVideo}
            onChange={(e) => setSelectedVideo(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- Choose a Video --</option>
            {videos.length > 0 ? (
              videos.map((v) => (
                <option key={v._id} value={v._id}>{v.title}</option>
              ))
            ) : (
              <option disabled>No videos available</option>
            )}
          </select>
        </div>

        {/* Stage */}
        <div>
          <label className="block mb-2 font-semibold">Stage</label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Multiple Questions */}
        <div>
          <label className="block text-lg font-bold mb-4">Questions</label>

          {questions.map((q, i) => (
  <div key={i} className="border p-4 rounded-lg mb-4 bg-purple-50">
    <input
      type="text"
      placeholder="Question"
      value={q.question}
      onChange={(e) => updateQuestion(i, "question", e.target.value)}
      className="w-full mb-2 p-2 border rounded"
    />

    <input
      type="text"
      placeholder="Option A"
      value={q.optionA}
      onChange={(e) => updateQuestion(i, "optionA", e.target.value)}
      className="w-full mb-2 p-2 border rounded"
    />

    <input
      type="text"
      placeholder="Option B"
      value={q.optionB}
      onChange={(e) => updateQuestion(i, "optionB", e.target.value)}
      className="w-full mb-2 p-2 border rounded"
    />

    <input
      type="text"
      placeholder="Option C"
      value={q.optionC}
      onChange={(e) => updateQuestion(i, "optionC", e.target.value)}
      className="w-full mb-2 p-2 border rounded"
    />

    <input
      type="text"
      placeholder="Option D"
      value={q.optionD}
      onChange={(e) => updateQuestion(i, "optionD", e.target.value)}
      className="w-full mb-2 p-2 border rounded"
    />

   <select
  value={q.correctAnswer}
  onChange={(e) => updateQuestion(i, "correctAnswer", Number(e.target.value))}
  className="w-full mb-2 p-2 border rounded"
>
  <option value="">Select Correct Option</option>
  <option value={1}>Option A</option>
  <option value={2}>Option B</option>
  <option value={3}>Option C</option>
  <option value={4}>Option D</option>
</select>

  </div>
))}


          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            + Add Question
          </button>
        </div>

        {/* Passing Score */}
        <div>
          <label className="block mb-2 font-semibold">Passing Score (%)</label>
          <input
            type="number"
            value={passingScore}
            onChange={(e) => setPassingScore(e.target.value)}
            className="w-full border rounded p-2"
            min="1"
            max="100"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 text-white p-3 rounded-lg"
        >
          {loading ? "Creating..." : "Create Test"}
        </button>
      </form>
    </div>
  );
}

export default AddTest;
