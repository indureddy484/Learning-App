
import React, { useEffect, useState } from "react";
import "./PrepositionQuiz.css";

// Add more image-based questions here later.
const questions = [
  {
    id: 1,
    image: "/images/telugu/preposition/table-apple.jpg",
    imageAlt: "Apple placed on top of a table",
    question: "Table ______ apple undhi.",
    options: [
      { id: "A", text: "Paina" },
      { id: "B", text: "Kindha" },
      { id: "C", text: "Lopala" },
      { id: "D", text: "Pakkana" },
    ],
    correctAnswer: "A",
  },
];

const timerOptions = [
  { label: "2 Minutes", seconds: 2 * 60, questions: 5 },
  { label: "5 Minutes", seconds: 5 * 60, questions: 10 },
  { label: "10 Minutes", seconds: 10 * 60, questions: 20 },
];

function PrepositionQuiz({ onBack }) {
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const [imageError, setImageError] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // TIMER
  useEffect(() => {
    if (!isQuizStarted || isTimeUp || isQuizCompleted) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          setIsTimeUp(true);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizStarted, isTimeUp, isQuizCompleted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleStartQuiz = () => {
    if (!selectedDuration) return;

    setTimeLeft(selectedDuration.seconds);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setIsTimeUp(false);
    setIsQuizCompleted(false);
    setImageError(false);
    setIsQuizStarted(true);
  };

  const handleOptionSelect = (optionId) => {
    if (submitted || isTimeUp || isQuizCompleted) return;

    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption || submitted || isTimeUp) return;

    setSubmitted(true);

    if (selectedOption === currentQuestion.correctAnswer) {
      // Finish after all currently available questions are answered.
      if (currentQuestionIndex === questions.length - 1) {
        setIsQuizCompleted(true);
      }
    }
  };

  const handleTryAgain = () => {
    if (isTimeUp) return;

    setSelectedOption(null);
    setSubmitted(false);
  };

  const handleRestart = () => {
    setIsQuizStarted(false);
    setSelectedDuration(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setTimeLeft(0);
    setIsTimeUp(false);
    setIsQuizCompleted(false);
    setImageError(false);
  };

  return (
    <div className="preposition-quiz-page">
      <div className="preposition-quiz-header">
        <button
          className="preposition-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <h1>Preposition Quiz</h1>
      </div>

      {/* TIMER SELECTION SCREEN */}
      {!isQuizStarted && (
        <div className="preposition-quiz-container">
          <h2 className="preposition-timer-heading">
            Select Your Time Limit
          </h2>

          <p className="preposition-timer-description">
            Choose your quiz duration and get ready!
          </p>

          <div className="preposition-timer-options">
            {timerOptions.map((option) => (
              <button
                key={option.seconds}
                type="button"
                className={`preposition-timer-option ${
                  selectedDuration?.seconds === option.seconds
                    ? "selected"
                    : ""
                }`}
                onClick={() => setSelectedDuration(option)}
              >
                <span className="preposition-timer-icon">⏱️</span>
                <strong>{option.label}</strong>
                <span>{option.questions} Questions</span>
              </button>
            ))}
          </div>

          <button
            className="preposition-submit-button"
            onClick={handleStartQuiz}
            disabled={!selectedDuration}
            type="button"
          >
            Start Quiz
          </button>
        </div>
      )}

      {/* QUIZ SCREEN */}
      {isQuizStarted && (
        <div className="preposition-quiz-container">
          <div className="preposition-quiz-top-info">
            <div className="preposition-question-count">
              Question {currentQuestionIndex + 1} of{" "}
              {selectedDuration.questions}
            </div>

            <div
              className={`preposition-timer-display ${
                timeLeft <= 30 ? "timer-warning" : ""
              }`}
            >
              <span>⏱️</span>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* TIME UP */}
          {isTimeUp ? (
            <div className="preposition-end-message time-up">
              <h2>⏰ Time's Up!</h2>
              <p>Your quiz time has ended.</p>

              <button
                className="preposition-retry-button"
                onClick={handleRestart}
                type="button"
              >
                Try Again
              </button>
            </div>
          ) : isQuizCompleted ? (
            /* QUIZ COMPLETED */
            <div className="preposition-end-message quiz-completed">
              <h2>🎉 Quiz Completed!</h2>
              <p>Chala baaga chesav!</p>
              <p>You answered all available questions correctly.</p>

              <button
                className="preposition-retry-button"
                onClick={handleRestart}
                type="button"
              >
                Play Again
              </button>
            </div>
          ) : (
            <>
              {/* QUESTION IMAGE */}
              <div className="preposition-image-container">
                {!imageError ? (
                  <img
                    src={currentQuestion.image}
                    alt={currentQuestion.imageAlt}
                    className="preposition-question-image"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div
                    className="preposition-image-fallback"
                    role="img"
                    aria-label="Apple placed on a table illustration"
                  >
                    <div className="fallback-apple">🍎</div>

                    <div className="fallback-table">
                      <div className="fallback-table-top" />

                      <div className="fallback-table-legs">
                        <span />
                        <span />
                      </div>
                    </div>

                    <p>Apple on the table</p>
                  </div>
                )}
              </div>

              {/* QUESTION */}
              <div className="preposition-question">
                <h2>{currentQuestion.question}</h2>
              </div>

              {/* OPTIONS */}
              <div className="preposition-options">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`preposition-option ${
                      selectedOption === option.id ? "selected" : ""
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={submitted}
                  >
                    <span className="preposition-option-letter">
                      {option.id}
                    </span>

                    <span>{option.text}</span>
                  </button>
                ))}
              </div>

              {/* SUBMIT */}
              {!submitted && (
                <button
                  className="preposition-submit-button"
                  onClick={handleSubmit}
                  disabled={!selectedOption}
                  type="button"
                >
                  Submit Answer
                </button>
              )}

              {/* FEEDBACK */}
              {submitted && (
                <div
                  className={`preposition-feedback ${
                    selectedOption === currentQuestion.correctAnswer
                      ? "correct"
                      : "wrong"
                  }`}
                >
                  {selectedOption === currentQuestion.correctAnswer ? (
                    <>
                      <h3>✓ Correct Answer!</h3>
                      <p>Chala baaga chesav!</p>
                    </>
                  ) : (
                    <>
                      <h3>✕ Wrong Answer!</h3>
                      <p>Try Again!</p>

                      <button
                        className="preposition-retry-button"
                        onClick={handleTryAgain}
                        type="button"
                      >
                        Try Again
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PrepositionQuiz;
