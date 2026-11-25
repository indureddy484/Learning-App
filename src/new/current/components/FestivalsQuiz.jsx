
import React from "react";
import "./FestivalsQuiz.css";

function FestivalsQuiz({ onBack }) {
  return (
    <div className="festivals-quiz-page">
      <div className="festivals-quiz-header">
        <button
          className="festivals-quiz-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK TO VIDEOS
        </button>

        <h1>Festivals Quiz</h1>
      </div>

      <div className="festivals-quiz-levels">
        <button
          className="festivals-level-button"
          type="button"
        >
          <span className="festivals-level-icon">📚</span>
          <span className="festivals-level-title">LEVEL - 1</span>
        </button>
      </div>
    </div>
  );
}

export default FestivalsQuiz;
