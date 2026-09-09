function RecentActivity({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <section className="recent-activity">
        <div className="activity-header">
          <span>UPDATES</span>
          <h2>Recent Activity</h2>
        </div>

        <p className="activity-empty">
          No recent activity.
        </p>
      </section>
    );
  }

  return (
    <section className="recent-activity">
      <div className="activity-header">
        <span>UPDATES</span>
        <h2>Recent Activity</h2>
      </div>

      <ul>
        {activities.map((activity, index) => (
          <li key={activity.id || index}>
            <div className="activity-dot" />

            <div className="activity-content">
              <strong>{activity.title}</strong>

              {activity.description && (
                <p>{activity.description}</p>
              )}

              {activity.created_at && (
                <small>
                  {new Date(
                    activity.created_at
                  ).toLocaleString()}
                </small>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RecentActivity;