function PerformanceChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <section className="performance-chart">
        <h2>Performance</h2>
        <p>No performance data available.</p>
      </section>
    );
  }

  const maxValue = Math.max(
    ...data.map((item) => Number(item.value) || 0),
    1
  );

  return (
    <section className="performance-chart">
      <div className="chart-header">
        <div>
          <span>ACTIVITY OVERVIEW</span>
          <h2>Performance</h2>
        </div>
      </div>

      <div className="chart-list">
        {data.map((item, index) => {
          const value = Number(item.value) || 0;
          const percentage = (value / maxValue) * 100;

          return (
            <div
              className="chart-row"
              key={item.id || item.label || index}
            >
              <div className="chart-row-label">
                <span>{item.label}</span>
                <strong>{value}</strong>
              </div>

              <div className="chart-track">
                <div
                  className="chart-bar"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PerformanceChart;