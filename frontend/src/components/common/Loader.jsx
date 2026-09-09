function Loader() {
  return (
    <div className="loader-container">
      <div
        className="loader"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      ></div>

      <p>Loading...</p>
    </div>
  );
}

export default Loader;