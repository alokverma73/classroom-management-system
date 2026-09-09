import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import api from "../../services/api";

function StudentDashboard() {
  const [stats, setStats] = useState({
    submissions: 0,
    completed: 0,
    pending: 0,
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

  const statCards = [
    {
      title: "Total Submissions",
      value: stats.submissions,
      description: "Assignments submitted",
      icon: "📝",
    },
    {
      title: "Completed",
      value: stats.completed,
      description: "Successfully completed",
      icon: "✓",
    },
    {
      title: "Pending",
      value: stats.pending,
      description: "Awaiting submission",
      icon: "⏳",
    },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />
      <Sidebar />

      <main className="dashboard-main">
        {/* Welcome Section */}
        <section className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">
              STUDENT PORTAL
            </p>

            <h1>Student Dashboard</h1>

            <p className="dashboard-subtitle">
              Track your assignments, submissions and academic progress
              from one place.
            </p>
          </div>

          <div className="dashboard-hero-icon">
            🎓
          </div>
        </section>

        {error && (
          <div className="dashboard-error" role="alert">
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="dashboard-stats">
          {statCards.map((card) => (
            <article className="stat-card" key={card.title}>
              <div className="stat-card-top">
                <div className="stat-icon">
                  {card.icon}
                </div>
              </div>

              <h2>{card.value}</h2>

              <p className="stat-title">
                {card.title}
              </p>

              <p className="stat-description">
                {card.description}
              </p>
            </article>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="dashboard-eyebrow">
                QUICK ACCESS
              </p>

              <h2>Continue Learning</h2>
            </div>
          </div>

          <div className="quick-actions">
            <a
              href="/student/classrooms"
              className="quick-action"
            >
              <span className="quick-action-icon">🏫</span>

              <span>
                <strong>My Classrooms</strong>
                <small>View your enrolled classrooms</small>
              </span>

              <span className="quick-arrow">→</span>
            </a>

            <a
              href="/student/results"
              className="quick-action"
            >
              <span className="quick-action-icon">📊</span>

              <span>
                <strong>View Results</strong>
                <small>Check your grades and performance</small>
              </span>

              <span className="quick-arrow">→</span>
            </a>
          </div>
        </section>

        {/* Progress Overview */}
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="dashboard-eyebrow">
                OVERVIEW
              </p>

              <h2>Your Progress</h2>
            </div>
          </div>

          <article className="progress-card">
            <div className="progress-content">
              <div>
                <span className="progress-label">
                  Submission Progress
                </span>

                <h3>
                  {stats.submissions === 0
                    ? "No submissions yet"
                    : `${stats.completed} of ${stats.submissions} completed`}
                </h3>
              </div>

              <div className="progress-number">
                {stats.submissions > 0
                  ? Math.round(
                      (stats.completed / stats.submissions) * 100
                    )
                  : 0}
                %
              </div>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    stats.submissions > 0
                      ? Math.min(
                          (stats.completed / stats.submissions) * 100,
                          100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;