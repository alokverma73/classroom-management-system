import { useState } from "react";

function SubmissionForm({ assignmentId, onSubmit }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Submission content is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onSubmit({
        assignment_id: assignmentId,
        content: trimmedContent,
      });

      setContent("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit assignment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="submission-form" onSubmit={handleSubmit}>
      {error && (
        <p className="dashboard-error" role="alert">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="submission-content">
          Your Submission
        </label>

        <textarea
          id="submission-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Enter your assignment submission..."
          rows="8"
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Assignment"}
      </button>
    </form>
  );
}

export default SubmissionForm;