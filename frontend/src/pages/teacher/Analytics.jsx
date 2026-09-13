import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import StatsCard from "../../components/dashboard/StatsCard";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
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

  const chartData = [
    {
      label: "Classrooms",
      value: analytics.total_classrooms,
    },
    {
      label: "Assignments",
      value: analytics.total_assignments,
    },
    {
      label: "Submissions",
      value: analytics.total_submissions,
    },
    {
      label: "Graded",
      value: analytics.graded_submissions,
    },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />
      <Sidebar />

      <main className="dashboard-main">
        <section className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">
              Teacher analytics
            </p>

            <h1>Analytics</h1>

            <p className="dashboard-subtitle">
              Understand classroom activity and student
              submission performance.
            </p>
          </div>

          <div className="dashboard-hero-icon">
            📊
          </div>
        </section>

        {error && (
          <div className="dashboard-error" role="alert">
            {error}
          </div>
        )}

        <section className="dashboard-stats">
          <StatsCard
            title="Classrooms"
            value={analytics.total_classrooms}
            description="Total classrooms"
          />

          <StatsCard
            title="Assignments"
            value={analytics.total_assignments}
            description="Assignments created"
          />

          <StatsCard
            title="Submissions"
            value={analytics.total_submissions}
            description="Student submissions"
          />

          <StatsCard
            title="Graded"
            value={analytics.graded_submissions}
            description="Reviewed submissions"
          />

          <StatsCard
            title="Average Score"
            value={analytics.average_score}
            description="Average marks obtained"
          />
        </section>

        <section className="dashboard-section">
          <PerformanceChart data={chartData} />
        </section>
      </main>
    </div>
  );
}

export default Analytics;