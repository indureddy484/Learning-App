import { useState, useRef } from "react";
import "./BirthdayQuiz.css";

const birthdayQuestions = [
  {
    question: "Amma birthday em date?",
    options: [
      "October 5th",
      "October 7th",
      "October 10th",
      "September 7th",
    ],
    answer: "October 7th",
  },

  {
    question: "Pinni birthday em date?",
    options: [
      "September 18th",
      "September 28th",
      "October 28th",
      "August 28th",
    ],
    answer: "September 28th",
  },

  {
    question: "Sreshta birthday em day padindi?",
    options: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
    ],

    // TEMPORARY
    // Change this after checking Sreshta's birthday.
    answer: "Wednesday",
  },
];

function BirthdayQuiz({ onBack }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showWrong, setShowWrong] = useState(false);

  const [completed, setCompleted] = useState(false);

  const locked = useRef(false);

  const successAudio = useRef(
    new Audio("/sounds/success-1-6297.mp3")
  );

  const failAudio = useRef(
    new Audio("/sounds/fail-2-2777575.mp3")
  );

  const veryGoodAudio = useRef(
    new Audio("/sounds/very-good.mp3")
  );

  const tryAgainAudio = useRef(
    new Audio("/sounds/try-again.mp3")
  );

  const playAudio = (audio) => {
    audio.currentTime = 0;

    audio.play().catch(() => {});
  };

  const playCorrectSounds = () => {
    playAudio(successAudio.current);

    setTimeout(() => {
      playAudio(veryGoodAudio.current);
    }, 500);
  };

  const playWrongSounds = () => {
    playAudio(failAudio.current);

    setTimeout(() => {
      playAudio(tryAgainAudio.current);
    }, 500);
  };

  const currentQuestion =
    birthdayQuestions[questionIndex];

  const handleAnswer = (answer) => {
    if (locked.current) {
      return;
    }

    locked.current = true;

    setSelectedAnswer(answer);

    // =========================
    // CORRECT
    // =========================

    if (answer === currentQuestion.answer) {
      playCorrectSounds();

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);

        if (
          questionIndex ===
          birthdayQuestions.length - 1
        ) {
          setCompleted(true);
        } else {
          setQuestionIndex(
            (previous) => previous + 1
          );

          setSelectedAnswer(null);
        }

        locked.current = false;
      }, 2500);

      return;
    }

    // =========================
    // WRONG
    // =========================

    playWrongSounds();

    setShowWrong(true);

    setTimeout(() => {
      setShowWrong(false);

      setSelectedAnswer(null);

      locked.current = false;
    }, 2500);
  };

  // =========================
  // COMPLETED
  // =========================

  if (completed) {
    return (
      <div className="birthday-quiz">

        <button
          className="birthday-back-button"
          onClick={onBack}
        >
          ← BACK
        </button>

        <div className="birthday-complete-box">

          <div className="birthday-complete-icon">
            🎂
          </div>

          <h1>
            Level 2 Complete!
          </h1>

          <p>
            Super! Birthdays quiz complete chesavu!
          </p>

          <button
            className="birthday-back-level"
            onClick={onBack}
          >
            ← LEVELS
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="birthday-quiz">

      {/* BACK */}
      <button
        className="birthday-back-button"
        onClick={onBack}
      >
        ← BACK
      </button>

      {/* =========================
          HEADING
      ========================= */}

      <h1 className="birthday-level-title">
        Level 2
      </h1>

      <div className="birthday-level-topic">
        (Birthdays)
      </div>

      {/* PROGRESS */}

      <div className="birthday-progress">
        Question {questionIndex + 1} /{" "}
        {birthdayQuestions.length}
      </div>

      {/* QUESTION */}

      <div className="birthday-question-card">

        <h2>
          {currentQuestion.question}
        </h2>

        <div className="birthday-options">

          {currentQuestion.options.map(
            (option) => {

              let className =
                "birthday-option";

              if (
                selectedAnswer === option
              ) {
                if (
                  option ===
                  currentQuestion.answer
                ) {
                  className += " correct";
                } else {
                  className += " wrong";
                }
              }

              return (
                <button
                  key={option}
                  className={className}
                  onClick={() =>
                    handleAnswer(option)
                  }
                  disabled={
                    selectedAnswer !== null
                  }
                >
                  {option}
                </button>
              );
            }
          )}

        </div>

      </div>

      {/* =========================
          WRONG POPUP
      ========================= */}

      {showWrong && (
        <div className="birthday-popup">

          <div className="birthday-wrong-box">

            <div className="birthday-popup-icon">
              ❌
            </div>

            <h2>
              Malli try cheyu!
            </h2>

            <p>
              Try again!
            </p>

          </div>

        </div>
      )}

      {/* =========================
          SUCCESS POPUP
      ========================= */}

      {showSuccess && (
        <div className="birthday-popup">

          <div className="birthday-success-box">

            <div className="birthday-celebration birthday-c1">
              ✨
            </div>

            <div className="birthday-celebration birthday-c2">
              🎉
            </div>

            <div className="birthday-celebration birthday-c3">
              ⭐
            </div>

            <div className="birthday-celebration birthday-c4">
              🎊
            </div>

            <div className="birthday-success-icon">
              🎉
            </div>

            <h2>
              VERY GOOD!
            </h2>

            <p>
              Super! Correct answer!
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

export default BirthdayQuiz;