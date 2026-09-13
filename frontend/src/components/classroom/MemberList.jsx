function MemberList({ members = [] }) {
  return (
    <section className="member-list">
      <div className="member-list-header">
        <span>Classroom</span>
        <h2>Class Members</h2>
      </div>

      {members.length === 0 ? (
        <p className="member-empty">No members found.</p>
      ) : (
        <ul>
          {members.map((member) => (
            <li key={member.id}>
              <div className="member-avatar">
                {member.name?.charAt(0)?.toUpperCase() || "?"}
              </div>

              <div className="member-info">
                <strong>{member.name}</strong>
                <span>{member.role}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default MemberList;