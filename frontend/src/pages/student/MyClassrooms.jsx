import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ClassroomCard from "../../components/classroom/ClassroomCard";
import { getClassrooms } from "../../services/classroomService";

function MyClassrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Navbar />
      <Sidebar />

      <main>
        <h1>My Classrooms</h1>

        {error && <p role="alert">{error}</p>}

        {!error && classrooms.length === 0 ? (
          <EmptyState
            title="No classrooms yet"
            message="You are not enrolled in any classrooms."
          />
        ) : (
          <section>
            {classrooms.map((classroom) => (
              <ClassroomCard
                key={classroom.id}
                classroom={classroom}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default MyClassrooms;