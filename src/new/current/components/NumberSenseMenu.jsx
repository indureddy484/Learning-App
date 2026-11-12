
import "./NumberSenseMenu.css";

function NumberSenseMenu({ onBack, onSelectActivity }) {
  return (
    <div className="new-page number-sense-page">
      <button
        className="top-back-button"
        onClick={onBack}
        type="button"
      >
        ← BACK
      </button>

      <h1>Number Sense</h1>

      <p className="number-sense-subtitle">
        Choose an activity
      </p>

      <div className="game-tabs">
        {/* COMPARE NUMBERS */}
        <button
          className="game-card"
          onClick={() => onSelectActivity("compare")}
          type="button"
        >
          <div className="game-icon compare-symbols">
            <span>&lt;</span>
            <span>=</span>
            <span>&gt;</span>
          </div>
          <span>Compare Numbers</span>
        </button>

        {/* ASCENDING ORDER */}
        <button
          className="game-card"
          onClick={() => onSelectActivity("ascending")}
          type="button"
        >
          <div className="game-icon">🔢</div>
          <span>Ascending Order</span>
        </button>

        {/* WORD PROBLEMS */}
        <button
          className="game-card"
          onClick={() => onSelectActivity("numberSense")}
          type="button"
        >
          <div className="game-icon">🧩</div>
          <span>Word Problems</span>
        </button>
      </div>
    </div>
  );
}

export default NumberSenseMenu;
