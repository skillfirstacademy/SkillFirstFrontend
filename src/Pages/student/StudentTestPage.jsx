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
    }, []);

    const fetchTest = async () => {
        try {
            const res = await adminApi.get(`/tests/video/${videoId}`);
            setTest(res.data);
        } catch (err) {
            showError("Failed to load test");
        } finally {
            setLoading(false);
        }
    };

    const selectAnswer = (qIndex, optionIndex) => {
        setAnswers((prev) => ({
            ...prev,
            [qIndex]: optionIndex,
        }));
    };

    const submitTest = async () => {
        if (!test) return;

        setSubmitting(true);
        try {
            const formattedAnswers = test.questions.map(
                (_, idx) => answers[idx] ?? null
            );

            const res = await adminApi.post(`/test-attempt/${test._id}`, {
                answers: formattedAnswers,
            });

            showSuccess("Test submitted successfully");

            navigate(`/student/test-result/${test._id}`, {
                state: res.data,
            });
        } catch (err) {
            showError(err.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) return <div className="p-6">Loading test...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
                <h1 className="text-2xl font-bold mb-6">Practice Test</h1>

                {test.questions.map((q, qIndex) => (
                    <div key={q._id} className="mb-6">
                        <p className="font-semibold mb-3">
                            {qIndex + 1}. {q.question}
                        </p>

                        <div className="space-y-2">
                            {q.options.map((opt, optIndex) => (
                                <label
                                    key={optIndex}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={`q-${qIndex}`}
                                        checked={answers[qIndex] === optIndex}
                                        onChange={() => selectAnswer(qIndex, optIndex)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    onClick={submitTest}
                    disabled={submitting}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
                >
                    {submitting ? "Submitting..." : "Submit Test"}
                </button>
            </div>
        </div>
    );
}

export default StudentTestPage;
