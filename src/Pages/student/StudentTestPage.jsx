import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import { showError, showSuccess } from "../../Componnets/AppToaster";

function StudentTestPage() {
    const { videoId } = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTest();
    }, [videoId]);

    const fetchTest = async () => {
        try {
            const res = await adminApi.get(`/tests/video/${videoId}`);
            console.log("Test loaded:", res.data);
            setTest(res.data);
        } catch (err) {
            showError("Failed to load test");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const selectAnswer = (qIndex, optionIndex) => {
        console.log("Selected:", { qIndex, optionIndex });
        setAnswers((prev) => {
            const updated = {
                ...prev,
                [qIndex]: optionIndex,
            };
            console.log("Updated answers state:", updated);
            return updated;
        });
    };

    const submitTest = async () => {
        if (!test) return;

        // Check if all questions are answered
        const unansweredCount = test.questions.length - Object.keys(answers).length;
        if (unansweredCount > 0) {
            const confirmSubmit = window.confirm(
                `You have ${unansweredCount} unanswered question(s). Submit anyway?`
            );
            if (!confirmSubmit) return;
        }

        setSubmitting(true);
        try {
            const formattedAnswers = test.questions.map(
                (_, idx) => answers[idx] ?? null
            );

            // console.log("Answers state before submit:", answers);
            // console.log("Formatted answers:", formattedAnswers);
            console.log("Payload:", { answers: formattedAnswers });

            const res = await adminApi.post(`/test-attempt/${test._id}`, {
                answers: formattedAnswers,
            });

            // console.log("Backend response:", res.data);

            showSuccess("Test submitted successfully");

            navigate(`/student/test-result/${test._id}`, {
                state: res.data,
            });
        } catch (err) {
            console.error("Submit error:", err);
            showError(err.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-lg">Loading test...</div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-lg text-red-600">Test not found</div>
            </div>
        );
    }

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = test.questions.length;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Practice Test</h1>
                    <p className="text-gray-600">
                        Progress: {answeredCount} / {totalQuestions} questions answered
                    </p>
                    <div className="mt-2 text-sm text-gray-500">
                        Debug: {JSON.stringify(answers)}
                    </div>
                </div>

                {test.questions.map((q, qIndex) => (
                    <div key={q._id} className="mb-6 pb-6 border-b last:border-b-0">
                        <p className="font-semibold mb-3">
                            {qIndex + 1}. {q.question}
                        </p>

                        <div className="space-y-2">
                            {q.options.map((opt, optIndex) => (
                                <label
                                    key={optIndex}
                                    className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${answers[qIndex] === optIndex
                                            ? "bg-purple-50 border-2 border-purple-600"
                                            : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`q-${qIndex}`}
                                        value={optIndex}
                                        checked={answers[qIndex] === optIndex}
                                        onChange={() => selectAnswer(qIndex, optIndex)}
                                        className="w-4 h-4 text-purple-600"
                                    />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                            Selected: {answers[qIndex] !== undefined ? answers[qIndex] : "None"}
                        </div>
                    </div>
                ))}

                <button
                    onClick={submitTest}
                    disabled={submitting}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
                >
                    {submitting ? "Submitting..." : "Submit Test"}
                </button>
            </div>
        </div>
    );
}

export default StudentTestPage;