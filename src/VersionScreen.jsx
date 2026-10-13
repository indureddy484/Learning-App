import "./VersionScreen.css";

function VersionScreen({ onSelect }) {
  return (
    <div className="version-screen">
      <h1 className="version-title">Choose Version</h1>

      <div className="version-container">
        <button
          className="version-card old-card"
          onClick={() => onSelect("old")}
        >
          <span className="version-label">OLD</span>
          <span className="version-description">
            Previous Version
          </span>
        </button>

        <button
          className="version-card new-card"
          onClick={() => onSelect("new")}
        >
          <span className="version-label">NEW</span>
          <span className="version-description">
            Current Version
          </span>
        </button>
      </div>
    </div>
  );
}

export default VersionScreen;