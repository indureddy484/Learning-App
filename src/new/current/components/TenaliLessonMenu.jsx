import React from "react";
import "./TenaliLessonMenu.css";

function TenaliLessonMenu({ onStory, onQuiz, onBack }) {
  return (
    <div className="tenali-menu-page">
      <button className="tenali-menu-back" onClick={onBack}>
        ← BACK
      </button>

      <h1>Tenali Rama and the Greedy Farmer</h1>
      <p className="tenali-menu-subtitle">Choose what you want to learn</p>

      <div className="tenali-menu-buttons">
        <button
          className="tenali-option-card"
          onClick={onStory}
        >
          <span className="tenali-option-icon">📖</span>
          <span>STORY</span>
        </button>

        <button
          className="tenali-option-card"
          onClick={onQuiz}
        >
          <span className="tenali-option-icon">📝</span>
          <span>QUIZ</span>
        </button>
      </div>
    </div>
  );
}

export default TenaliLessonMenu;