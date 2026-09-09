import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import AssignmentForm from "../../components/assignments/AssignmentForm";
import EmptyState from "../../components/common/EmptyState";
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
  updateAssignment,
} from "../../services/assignmentService";

function CreateAssignment() {
  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadAssignments = async () => {
    try {
      setLoadingAssignments(true);
      setError("");

      const response = await getAssignments();
      setAssignments(response.assignments || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load assignments."
      );
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleCreate = async (formData) => {
    try {
      setError("");

      await createAssignment({
        ...formData,
        total_marks: Number(formData.total_marks),
        classroom_id: Number(formData.classroom_id),
      });

      await loadAssignments();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create assignment."
      );
    }
  };

  const handleEdit = async (assignment) => {
    const title = window.prompt(
      "Assignment title:",
      assignment.title
    );

    if (title === null || !title.trim()) return;

    const description = window.prompt(
      "Assignment description:",
      assignment.description || ""
    );

    if (description === null) return;

    const marksInput = window.prompt(
      "Total marks:",
      assignment.total_marks
    );

    if (marksInput === null) return;

    const totalMarks = Number(marksInput);

    if (!Number.isInteger(totalMarks) || totalMarks < 1) {
      setError("Total marks must be a positive number.");
      return;
    }

    try {
      setEditingId(assignment.id);
      setError("");

      const response = await updateAssignment(
        assignment.id,
        {
          title: title.trim(),
          description: description.trim(),
          total_marks: totalMarks,
          due_date: assignment.due_date
            ? assignment.due_date.slice(0, 16)
            : "",
        }
      );

      setAssignments((current) =>
        current.map((item) =>
          item.id === assignment.id
            ? response.assignment
            : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update assignment."
      );
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (assignmentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this assignment?"
      )
    ) {
      return;
    }

    try {
      setDeletingId(assignmentId);
      setError("");

      await deleteAssignment(assignmentId);

      setAssignments((current) =>
        current.filter(
          (assignment) => assignment.id !== assignmentId
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete assignment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <Sidebar />

      <main className="dashboard-main">
        <div className="create-page">
          <div className="page-heading">
            <span>TEACHING TOOLS</span>

            <h1>Create Assignment</h1>

            <p>
              Create and manage assignments for your
              classrooms.
            </p>
          </div>

          {error && (
            <p className="dashboard-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-panel">
            <AssignmentForm onSubmit={handleCreate} />
          </div>

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <p className="dashboard-eyebrow">
                  ASSIGNMENT MANAGEMENT
                </p>

                <h2>Your Assignments</h2>
              </div>

              <span className="assignment-count">
                {assignments.length}{" "}
                {assignments.length === 1
                  ? "Assignment"
                  : "Assignments"}
              </span>
            </div>

            {loadingAssignments ? (
              <p>Loading assignments...</p>
            ) : assignments.length === 0 ? (
              <EmptyState
                title="No assignments yet"
                message="Create your first assignment above."
              />
            ) : (
              <div className="assignment-list">
                {assignments.map((assignment) => (
                  <article
                    className="assignment-card"
                    key={assignment.id}
                  >
                    <div className="assignment-card-top">
                      <span className="assignment-badge">
                        ASSIGNMENT
                      </span>

                      <span className="assignment-marks">
                        {assignment.total_marks} Marks
                      </span>
                    </div>

                    <h3>{assignment.title}</h3>

                    <p>
                      {assignment.description ||
                        "No description available."}
                    </p>

                    {assignment.due_date && (
                      <div className="assignment-meta">
                        <span>
                          <strong>Due</strong>
                          {new Date(
                            assignment.due_date
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="assignment-card-footer">
                      <Link
                        to={`/teacher/assignments/${assignment.id}`}
                      >
                        View Assignment →
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(assignment)
                        }
                        disabled={
                          editingId === assignment.id ||
                          deletingId === assignment.id
                        }
                      >
                        {editingId === assignment.id
                          ? "Saving..."
                          : "Edit"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(assignment.id)
                        }
                        disabled={
                          deletingId === assignment.id ||
                          editingId === assignment.id
                        }
                      >
                        {deletingId === assignment.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default CreateAssignment;