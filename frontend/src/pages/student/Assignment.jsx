import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import SubmissionForm from "../../components/assignments/SubmissionForm";
import { getAssignment } from "../../services/assignmentService";
import { submitAssignment } from "../../services/submissionService";

function Assignment() {
  const { assignmentId } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        const response = await getAssignment(assignmentId);
        setAssignment(response.assignment);
      } catch (error) {
        console.error("Failed to load assignment:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [assignmentId]);

  const handleSubmit = async (submissionData) => {
    try {
      await submitAssignment(submissionData);
      setMessage("Assignment submitted successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to submit assignment."
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!assignment) {
    return <p>Assignment not found.</p>;
  }

  return (
    <div>
      <Navbar />
      <Sidebar />

      <main>
        <div className="assignment-page">
          <div className="assignment-header">
            <span className="assignment-label">Assignment</span>

            <h1>{assignment.title}</h1>

            <p className="assignment-description">
              {assignment.description ||
                "No description available."}
            </p>

            <div className="assignment-meta">
              <span>
                <strong>Marks</strong>
                {assignment.total_marks}
              </span>

              {assignment.due_date && (
                <span>
                  <strong>Due</strong>
                  {new Date(
                    assignment.due_date
                  ).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {message && (
            <p className="assignment-message" role="status">
              {message}
            </p>
          )}

          <div className="submission-panel">
            <h2>Submit Your Work</h2>
            <p>
              Complete the assignment and submit your work
              below.
            </p>

            <SubmissionForm
              assignmentId={assignment.id}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Assignment;