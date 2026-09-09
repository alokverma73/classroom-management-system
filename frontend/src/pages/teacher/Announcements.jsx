import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import EmptyState from "../../components/common/EmptyState";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "../../services/announcementService";
import { getClassrooms } from "../../services/classroomService";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    classroom_id: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [announcementResponse, classroomResponse] =
        await Promise.all([
          getAnnouncements(),
          getClassrooms(),
        ]);

      setAnnouncements(
        announcementResponse.announcements || []
      );
      setClassrooms(classroomResponse.classrooms || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load announcements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await createAnnouncement({
        ...formData,
        classroom_id: Number(formData.classroom_id),
      });

      setAnnouncements((current) => [
        response.announcement,
        ...current,
      ]);

      setFormData({
        title: "",
        message: "",
        classroom_id: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create announcement."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (announcementId) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      setDeletingId(announcementId);
      setError("");

      await deleteAnnouncement(announcementId);

      setAnnouncements((current) =>
        current.filter(
          (announcement) =>
            announcement.id !== announcementId
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete announcement."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div>Loading announcements...</div>;
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <Sidebar />

      <main className="dashboard-main">
        <div className="create-page">
          <div className="page-heading">
            <span>TEACHING TOOLS</span>
            <h1>Announcements</h1>
            <p>
              Share important updates with your
              classrooms.
            </p>
          </div>

          {error && (
            <p className="dashboard-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-panel">
            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <div>
                <label htmlFor="classroom_id">
                  Classroom
                </label>

                <select
                  id="classroom_id"
                  name="classroom_id"
                  value={formData.classroom_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select classroom
                  </option>

                  {classrooms.map((classroom) => (
                    <option
                      key={classroom.id}
                      value={classroom.id}
                    >
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title">
                  Announcement Title
                </label>

                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Fest Dress Code"
                  required
                />
              </div>

              <div>
                <label htmlFor="message">
                  Announcement
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your announcement..."
                  rows="5"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Publishing..."
                  : "Publish Announcement"}
              </button>
            </form>
          </div>

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <p className="dashboard-eyebrow">
                  RECENT UPDATES
                </p>
                <h2>Your Announcements</h2>
              </div>
            </div>

            {announcements.length === 0 ? (
              <EmptyState
                title="No announcements yet"
                message="Publish your first classroom announcement."
              />
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
                        Classroom #{announcement.classroom_id}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            announcement.id
                          )
                        }
                        disabled={
                          deletingId === announcement.id
                        }
                      >
                        {deletingId === announcement.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Announcements;