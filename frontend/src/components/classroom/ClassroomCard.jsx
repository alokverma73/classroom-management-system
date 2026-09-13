import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ClassroomCard({ classroom }) {
  const { user } = useAuth();

  const classroomPath =
    user?.role === "teacher"
      ? `/teacher/classrooms/${classroom.id}`
      : `/student/classrooms/${classroom.id}`;

  return (
    <article className="classroom-card">
      <div className="classroom-card-top">
        <span className="classroom-badge">Classroom</span>
        <span className="classroom-code">
          {classroom.code}
        </span>
      </div>

      <h3>{classroom.name}</h3>

      <p>
        {classroom.description ||
          "No description available."}
      </p>

      <div className="classroom-card-footer">
        <span>Classroom workspace</span>

        <Link to={classroomPath}>
          View Classroom →
        </Link>
      </div>
    </article>
  );
}

export default ClassroomCard;