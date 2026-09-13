// A lightweight skeleton list shown while data is loading.
export default function LoadingState({ count = 4 }) {
  return (
    <div className="skeleton-stack" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-row" key={i}>
          <div className="skeleton-block" style={{ width: "48px", height: "48px", borderRadius: "10px" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className="skeleton-block skeleton-line" style={{ width: "60%" }} />
            <div className="skeleton-block skeleton-line" style={{ width: "35%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
