
import React, { useState } from "react";
import NumberBonds from "./NumberBonds";
import "./MentalMath.css";

function MentalMath({ onBack }) {
  const [openNumberBonds, setOpenNumberBonds] = useState(false);

  if (openNumberBonds) {
    return (
      <NumberBonds
        onBack={() => setOpenNumberBonds(false)}
      />
    );
  }

  return (
    <div className="new-page mental-math-page">
      <button
        className="top-back-button"
        onClick={onBack}
        type="button"
      >
        ← BACK
      </button>

      <h1>Mental Math</h1>

      <p className="number-sense-subtitle">
        Choose an activity
      </p>

      <div className="game-tabs">
        <button
          className="game-card"
          type="button"
          onClick={() => setOpenNumberBonds(true)}
        >
          <div className="game-icon">🔢</div>
          <span>Number Bonds</span>
        </button>
      </div>
    </div>
  );
}

export default MentalMath;
