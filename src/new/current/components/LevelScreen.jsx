import "./LevelScreen.css";

function LevelScreen({ onBack, onSelectLevel }) {
  return (
    <div className="level-screen">

      {/* BACK BUTTON */}
      <button
        className="level-back-button"
        onClick={onBack}
      >
        ← BACK
      </button>

      {/* TITLE */}
      <h1 className="level-main-title">
        Day & Date
      </h1>

      <p className="level-subtitle">
        Choose a Level
      </p>

      {/* LEVEL CARDS */}
      <div className="level-grid">

        {/* LEVEL 1 */}
        <button
          className="level-card"
          onClick={() => onSelectLevel("level1")}
        >
          <div className="level-number">
            Level 1
          </div>

          <div className="level-topic">
            (Days & Dates)
          </div>

          <div className="level-icon">
            📅
          </div>
        </button>

        {/* LEVEL 2 */}
        <button
          className="level-card"
          onClick={() => onSelectLevel("level2")}
        >
          <div className="level-number">
            Level 2
          </div>

          <div className="level-topic">
            (Birthdays)
          </div>

          <div className="level-icon">
            🎂
          </div>
        </button>

      </div>

    </div>
  );
}

export default LevelScreen;