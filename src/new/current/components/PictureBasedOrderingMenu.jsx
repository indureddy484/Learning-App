
import "./NumberSenseMenu.css";

function PictureBasedOrderingMenu({ onBack, onSelectActivity }) {
  return (
    <div className="new-page number-sense-page">
      <button
        className="top-back-button"
        onClick={onBack}
        type="button"
      >
        ← BACK
      </button>

      <h1>Picture Based Ordering</h1>
      <p className="number-sense-subtitle">
        Choose an activity
      </p>

      <div className="game-tabs">
        {/* ASCENDING ORDER */}
        <button
          className="game-card"
          onClick={() => onSelectActivity("ascendingNew")}
          type="button"
        >
          <div className="game-icon">📈</div>
          <span>Ascending Order</span>
        </button>

        {/* DESCENDING ORDER */}
        <button
          className="game-card"
          onClick={() => onSelectActivity("descending")}
          type="button"
        >
          <div className="game-icon">📉</div>
          <span>Descending Order</span>
        </button>

        {/* MIXED ORDER */}
        <button
          className="game-card"
          onClick={() => onSelectActivity("mixed")}
          type="button"
        >
          <div className="game-icon">🎯</div>
          <span>Mixed</span>
        </button>
      </div>
    </div>
  );
}

export default PictureBasedOrderingMenu;
