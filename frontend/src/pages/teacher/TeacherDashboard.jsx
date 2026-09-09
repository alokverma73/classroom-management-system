import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import api from "../../services/api";

function TeacherDashboard() {
  const [stats, setStats] = useState({
    classrooms: 0,
    assignments: 0,
    submissions: 0,
    graded_submissions: 0,
    pending_submissions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard/");
        setStats(response.data.stats || {});
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Navbar />
      <Sidebar />

      <main>
        <div className="teacher-dashboard">
          <div className="page-heading">
            <span>TEACHER OVERVIEW</span>
            <h1>Teacher Dashboard</h1>
            <p>
              Manage your classrooms, assignments and student
              submissions.
            </p>
          </div>

          {error && (
            <p className="dashboard-error" role="alert">
              {error}
            </p>
          )}

          <section className="dashboard-stats">
            <article className="dashboard-stat-card">
              <span>CLASSROOMS</span>
              <h2>{stats.classrooms}</h2>
              <p>Active classrooms</p>
            </article>

            <article className="dashboard-stat-card">
              <span>ASSIGNMENTS</span>
              <h2>{stats.assignments}</h2>
              <p>Total assignments</p>
            </article>

            <article className="dashboard-stat-card">
              <span>SUBMISSIONS</span>
              <h2>{stats.submissions}</h2>
              <p>Student submissions</p>
            </article>

            <article className="dashboard-stat-card">
              <span>PENDING</span>
              <h2>{stats.pending_submissions}</h2>
              <p>Waiting for grading</p>
            </article>

            <article className="dashboard-stat-card">
              <span>GRADED</span>
              <h2>{stats.graded_submissions}</h2>
              <p>Completed reviews</p>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;