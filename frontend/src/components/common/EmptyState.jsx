function EmptyState({ title, message, action }) {
  return (
    <section className="empty-state" aria-label={title}>
      <div className="empty-state-icon">—</div>

      <h2>{title}</h2>

      <p>{message}</p>

      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </section>
  );
}

export default EmptyState;