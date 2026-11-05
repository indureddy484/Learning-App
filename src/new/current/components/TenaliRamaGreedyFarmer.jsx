
import React from "react";
import "./TenaliRamaGreedyFarmer.css";

function TenaliRamaGreedyFarmer({ onBack }) {
  return (
    <div className="tenali-story-page">

      <button
        className="tenali-back-button"
        onClick={onBack}
        type="button"
      >
        ← BACK
      </button>

      <div className="tenali-story-header">
        <h1>Tenali Rama and the Greedy Farmer</h1>
        <p>English - Chapter 1</p>
      </div>

      <div className="tenali-story-content">
        <h2>Chapter 1</h2>
        <p>Story content will be added here.</p>
      </div>

    </div>
  );
}

export default TenaliRamaGreedyFarmer;
