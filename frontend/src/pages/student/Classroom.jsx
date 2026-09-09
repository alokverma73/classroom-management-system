import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import ClassroomHeader from "../../components/classroom/ClassroomHeader";
import AssignmentCard from "../../components/assignments/AssignmentCard";
import { getClassroomAnnouncements } from "../../services/announcementService";
import api from "../../services/api";

function Classroom() {
  const { classroomId } = useParams();

  const [classroom, setClassroom] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClassroom = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          classroomResponse,
          assignmentResponse,
          announcementResponse,
        ] = await Promise.all([
          api.get(`/classrooms/${classroomId}`),
          api.get("/assignments/"),
          getClassroomAnnouncements(classroomId),
        ]);

        setClassroom(classroomResponse.data.classroom);

        setAssignments(
          (assignmentResponse.data.assignments || []).filter(
            (assignment) =>
              Number(assignment.classroom_id) ===
              Number(classroomId)
          )
        );

        setAnnouncements(
          announcementResponse.announcements || []
        );
      } catch (error) {
        console.error(
          "Failed to load classroom:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load classroom."
        );
      } finally {
        setLoading(false);
      }
    };

    loadClassroom();
  }, [classroomId]);

  if (loading) {
    return <Loader />;
  }

  if (!classroom) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <Sidebar />

        <main>
          <div className="dashboard-error" role="alert">
            {error || "Classroom not found."}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <Sidebar />

      <main className="dashboard-main">
        <ClassroomHeader classroom={classroom} />

        {error && (
          <div className="dashboard-error" role="alert">
            {error}
          </div>
        )}

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="dashboard-eyebrow">
                CLASSROOM UPDATES
              </p>

              <h2>Announcements</h2>
            </div>

            <span className="assignment-count">
              {announcements.length}{" "}
              {announcements.length === 1
                ? "Announcement"
                : "Announcements"}
            </span>
          </div>

          {announcements.length === 0 ? (
            <article className="empty-state">
              <div className="empty-state-icon">📢</div>

              <h3>No announcements yet</h3>

              <p>
                Your teacher hasn't posted any announcements
                for this classroom.
              </p>
            </article>
          ) : (
            <div className="assignment-list">
              {announcements.map((announcement) => (
                <article
                  className="assignment-card"
                  key={announcement.id}
                >
                  <div className="assignment-card-top">
                    <span className="assignment-badge">
                      ANNOUNCEMENT
                    </span>

                    <span>
                      {new Date(
                        announcement.created_at
                      ).toLocaleString()}
                    </span>
                  </div>

                  <h3>{announcement.title}</h3>

                  <p>{announcement.message}</p>

                  <div className="assignment-card-footer">
                    <span>
                      Posted by{" "}
                      <strong>
                        {announcement.author_name ||
                          "Teacher"}
                      </strong>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="dashboard-eyebrow">
                CLASSROOM WORK
              </p>

              <h2>Assignments</h2>
            </div>

            <span className="assignment-count">
              {assignments.length}{" "}
              {assignments.length === 1
                ? "Assignment"
                : "Assignments"}
            </span>
          </div>

          {assignments.length === 0 ? (
            <article className="empty-state">
              <div className="empty-state-icon">📚</div>

              <h3>No assignments yet</h3>

              <p>
                Your teacher hasn't added any assignments
                to this classroom yet.
              </p>
            </article>
          ) : (
            <div className="assignment-list">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Classroom;