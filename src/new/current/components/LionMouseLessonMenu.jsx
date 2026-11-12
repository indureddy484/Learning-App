
import React from "react";
import "./LionMouseLessonMenu.css";

function LionMouseLessonMenu({ onVideo, onQuiz, onBack }) {
  return (
    <div className="lion-mouse-menu-page">
      <button
        className="lion-mouse-menu-back"
        onClick={onBack}
        type="button"
      >
        ← BACK
      </button>

      <h1>Lion and the Mouse</h1>

      <p className="lion-mouse-menu-subtitle">
        Choose what you want to learn
      </p>

      <div className="lion-mouse-menu-buttons">
        {/* VIDEOS */}
        <button
          className="lion-mouse-option-card"
          onClick={onVideo}
          type="button"
        >
          <span className="lion-mouse-option-icon">🎬</span>
          <span>Videos</span>
        </button>

        {/* QUIZ */}
        <button
          className="lion-mouse-option-card"
          onClick={onQuiz}
          type="button"
        >
          <span className="lion-mouse-option-icon">📝</span>
          <span>QUIZ</span>
        </button>
      </div>
    </div>
  );
}

export default LionMouseLessonMenu;
