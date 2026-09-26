import React, { useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UOISystemLevelPage.css";

// Sounds
const sfxRight = new Audio("/sounds/success-1-6297.mp3");
const sfxWrong = new Audio("/sounds/fail-2-277575.mp3");
const voiceRight = new Audio("/sounds/very-good.mp3");
const voiceWrong = new Audio("/sounds/try-again.mp3");
const tapSound = new Audio("/sounds/tap.mp3");

[sfxRight, sfxWrong, voiceRight, voiceWrong, tapSound].forEach(s => s.volume = 1);

const questionsData = {
  skeletal: [
    {
      video: "/videos/skeletal-level2.mp4",
      question: "Which part protects your brain?",
      options: ["Ribs", "Skull", "Spine", "Legs"],
      answer: "Skull",
    },
    {
      question: "How many bones are in the human body?",
      options: ["206", "100", "300", "150"],
      answer: "206",
    },
  ],
  respiratory: [
    {
      video: "/videos/respiratory-level2.mp4",
      question: "Which organ helps you breathe?",
      options: ["Heart", "Liver", "Lungs", "Kidney"],
      answer: "Lungs",
    },
  ],
};

export default function UOISystemLevel2() {
  const { system } = useParams();
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const quiz = questionsData[system] || [];
  const current = quiz[currentQ];

  const play = (audio) => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const twin = (a, b) => {
    play(a);
    play(b);
  };

  const handleOptionClick = (option) => {
  play(tapSound);
  setSelectedOption(option);
  setShowFeedback(true);

  if (option === current.answer) {
    twin(sfxRight, voiceRight);
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      if (currentQ < quiz.length - 1) {
        setCurrentQ((q) => q + 1);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  } else {
    twin(sfxWrong, voiceWrong);
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      // ⛔ Stay on the same question
    }, 1500);
  }
};


  if (!quiz.length) {
    return <p>No quiz available for {system}</p>;
  }

  return (
    <div className="uoi-level-page">
      <button className="back-btn" onClick={() => navigate(-1)}>🔙 Back</button>
      <h2 className="uoi-heading">🖼️ {system.toUpperCase()} - Level 2</h2>

      {currentQ === 0 && current.video && (
        <video
          src={current.video}
          controls
          className="uoi-video"
        />
      )}

      {!isFinished && (
        <div className="question-block">
          <h3 className="question">{current.question}</h3>
          <div className="options">
            {current.options.map((opt, index) => (
              <button
                key={index}
                className={`option-btn ${
                  showFeedback
                    ? opt === current.answer
                      ? "correct"
                      : opt === selectedOption
                      ? "wrong"
                      : ""
                    : ""
                }`}
                onClick={() => handleOptionClick(opt)}
                disabled={showFeedback}
              >
                {opt}
              </button>
            ))}
          </div>
          {showFeedback && (
            <p className="feedback">
              {selectedOption === current.answer ? "✅ Correct!" : "❌ Try again!"}
            </p>
          )}
        </div>
      )}

      {isFinished && (
        <div className="completion-message">
          <p className="feedback">🎉 You completed Level 2!</p>
        </div>
      )}
    </div>
  );
}
