function StatsCard({ title, value, description }) {
  return (
    <article className="analytics-card">
      <span>{title}</span>

      <h2>{value}</h2>

      {description && <p>{description}</p>}
    </article>
  );
}

export default StatsCard;