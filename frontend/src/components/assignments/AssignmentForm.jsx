import { useEffect, useState } from "react";
import { getClassrooms } from "../../services/classroomService";

function AssignmentForm({ onSubmit }) {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    total_marks: 100,
    due_date: "",
    classroom_id: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        const response = await getClassrooms();
        setClassrooms(response.classrooms || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load classrooms."
        );
      } finally {
        setLoading(false);
      }
    };

    loadClassrooms();
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.classroom_id) {
      setError("Please select a classroom.");
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form className="assignment-form" onSubmit={handleSubmit}>
      {error && (
        <p className="dashboard-error" role="alert">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="title">Assignment Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Python Fundamentals"
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the assignment..."
          rows="5"
        />
      </div>

      <div>
        <label htmlFor="total_marks">Total Marks</label>
        <input
          id="total_marks"
          name="total_marks"
          type="number"
          min="1"
          value={formData.total_marks}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="due_date">Due Date</label>
        <input
          id="due_date"
          name="due_date"
          type="datetime-local"
          value={formData.due_date}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="classroom_id">Classroom</label>

        <select
          id="classroom_id"
          name="classroom_id"
          value={formData.classroom_id}
          onChange={handleChange}
          disabled={loading}
          required
        >
          <option value="">
            {loading
              ? "Loading classrooms..."
              : "Select classroom"}
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

      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Create Assignment"}
      </button>
    </form>
  );
}

export default AssignmentForm;