import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { getMySubmissions } from "../../services/submissionService";

function Results() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const response = await getMySubmissions();
        setSubmissions(response.submissions || []);
      } catch (error) {
        console.error("Failed to load results:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Navbar />
      <Sidebar />

      <main>
        <div className="results-page">
          <div className="page-heading">
            <span>ACADEMIC PERFORMANCE</span>
            <h1>My Results</h1>
            <p>
              Track your assignment submissions, grades and
              teacher feedback.
            </p>
          </div>

          {submissions.length === 0 ? (
            <EmptyState
              title="No results yet"
              message="Your assignment results will appear here."
            />
          ) : (
            <section className="results-list">
              {submissions.map((submission) => (
                <article
                  className="result-card"
                  key={submission.id}
                >
                  <div className="result-card-header">
                    <div>
                      <span className="result-label">
                        ASSIGNMENT
                      </span>
                      <h3>
                        Assignment #{submission.assignment_id}
                      </h3>
                    </div>

                    <span className="result-status">
                      {submission.status}
                    </span>
                  </div>

                  {submission.result ? (
                    <div className="result-details">
                      <div className="result-marks">
                        <span>Marks</span>
                        <strong>
                          {submission.result.marks_obtained}
                        </strong>
                      </div>

                      {submission.result.feedback && (
                        <div className="result-feedback">
                          <span>Teacher Feedback</span>
                          <p>
                            {submission.result.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="not-graded">
                      Not graded yet.
                    </p>
                  )}
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Results;