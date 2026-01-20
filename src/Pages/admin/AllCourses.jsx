import React, { useEffect, useState } from "react";
import axios from "axios";

function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data.courses || res.data); // adjust depending on your response
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;

  if (courses.length === 0)
    return <p>No courses available yet.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Courses</h2>

      <div style={{ marginTop: "20px" }}>
        {courses.map((course) => (
          <div
            key={course._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          >
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>
              <strong>Type:</strong>{" "}
              {course.isPaid ? "Paid" : "Free"}
            </p>
            {course.isPaid && (
              <p>
                <strong>Price:</strong> ₹{course.price}
              </p>
            )}
            <p>
              <strong>Created By:</strong> {course.createdBy?.name || "Unknown"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllCourses;
