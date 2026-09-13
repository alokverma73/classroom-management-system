import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ClassroomCard from "../../components/classroom/ClassroomCard";
import {
  deleteClassroom,
  getClassrooms,
} from "../../services/classroomService";

function ManageClassroom() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadClassrooms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getClassrooms();
      setClassrooms(response.classrooms || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load classrooms."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassrooms();
  }, []);

  const handleDelete = async (classroomId) => {
    if (!window.confirm("Delete this classroom?")) return;

    try {
      setDeletingId(classroomId);
      setError("");

      await deleteClassroom(classroomId);

      setClassrooms((current) =>
        current.filter(
          (classroom) => classroom.id !== classroomId
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete classroom."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Navbar />
      <Sidebar />

      <main>
        <div className="create-page">
          <div className="page-heading">
            <span>Teaching tools</span>
            <h1>Manage Classrooms</h1>
            <p>
              Create, manage, and organize your classrooms.
            </p>
          </div>

          <div className="page-actions">
            <Link
              to="/teacher/classrooms/create"
              className="primary-action"
            >
              + Create New Classroom
            </Link>
          </div>

          {error && (
            <p className="dashboard-error" role="alert">
              {error}
            </p>
          )}

          {classrooms.length === 0 ? (
            <EmptyState
              title="No classrooms yet"
              message="Create your first classroom to get started."
            />
          ) : (
            <section>
              {classrooms.map((classroom) => (
                <article key={classroom.id}>
                  <ClassroomCard classroom={classroom} />

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(classroom.id)
                    }
                    disabled={
                      deletingId === classroom.id
                    }
                  >
                    {deletingId === classroom.id
                      ? "Deleting..."
                      : "Delete Classroom"}
                  </button>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default ManageClassroom;