import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function AssignmentCard({ assignment }) {
  const { user } = useAuth();

  const assignmentPath =
    user?.role === "teacher"
      ? `/teacher/assignments/${assignment.id}`
      : `/student/assignments/${assignment.id}`;

  return (
    <article className="assignment-card">
      <div className="assignment-card-top">
        <span className="assignment-badge">
          Assignment
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

      <div className="assignment-meta">
        {assignment.due_date && (
          <span>
            <strong>Due</strong>
            {new Date(
              assignment.due_date
            ).toLocaleString()}
          </span>
        )}
      </div>

      <div className="assignment-card-footer">
        <Link to={assignmentPath}>
          View Assignment →
        </Link>
      </div>
    </article>
  );
}

export default AssignmentCard;