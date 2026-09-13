import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import api from "../../services/api";

function Analytics() {
  const [analytics, setAnalytics] = useState({
    total_classrooms: 0,
    total_assignments: 0,
    total_submissions: 0,
    graded_submissions: 0,
    average_score: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await api.get("/analytics/");
        setAnalytics(response.data.analytics || {});
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
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
            <span>Teacher overview</span>
            <h1>Analytics</h1>
            <p>
              Track classroom activity, submissions and student
              performance.
            </p>
          </div>

          {error && (
            <p className="dashboard-error" role="alert">
              {error}
            </p>
          )}

          <section className="dashboard-stats">
            <article className="dashboard-stat-card">
              <span>Classrooms</span>
              <h2>{analytics.total_classrooms}</h2>
              <p>Total classrooms</p>
            </article>

            <article className="dashboard-stat-card">
              <span>Assignments</span>
              <h2>{analytics.total_assignments}</h2>
              <p>Total assignments</p>
            </article>

            <article className="dashboard-stat-card">
              <span>Submissions</span>
              <h2>{analytics.total_submissions}</h2>
              <p>Total submissions</p>
            </article>

            <article className="dashboard-stat-card">
              <span>Graded</span>
              <h2>{analytics.graded_submissions}</h2>
              <p>Graded submissions</p>
            </article>

            <article className="dashboard-stat-card">
              <span>Average score</span>
              <h2>{analytics.average_score}</h2>
              <p>Average marks obtained</p>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Analytics;