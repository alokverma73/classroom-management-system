function ClassroomHeader({ classroom }) {
  return (
    <header className="classroom-header">
      <div className="classroom-header-content">
        <span className="classroom-header-label">
          CLASSROOM
        </span>

        <h1>{classroom.name}</h1>

        {classroom.description && (
          <p className="classroom-description">
            {classroom.description}
          </p>
        )}

        <div className="classroom-meta">
          <span>
            <strong>Class Code</strong>
            {classroom.code}
          </span>

          {classroom.teacher_id && (
            <span>
              <strong>Teacher ID</strong>
              {classroom.teacher_id}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export default ClassroomHeader;