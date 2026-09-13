import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import { createClassroom } from "../../services/classroomService";

function CreateClassroom() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createClassroom(formData);

      navigate("/teacher/classrooms");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create classroom."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <Sidebar />

      <main>
        <div className="create-page">
          <div className="page-heading">
            <span>Teaching tools</span>
            <h1>Create Classroom</h1>
            <p>
              Set up a classroom and invite students to join.
            </p>
          </div>

          {error && (
            <p className="dashboard-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-panel">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">
                  Classroom Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Computer Engineering"
                  required
                />
              </div>

              <div>
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your classroom..."
                  rows="5"
                />
              </div>

              <div>
                <label htmlFor="code">
                  Classroom Code
                </label>

                <input
                  id="code"
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. CS2026"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Classroom"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateClassroom;