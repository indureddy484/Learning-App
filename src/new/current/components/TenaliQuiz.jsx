
import React, { useEffect, useState } from "react";
import "./TenaliQuiz.css";

// Temporary question bank.
// Actual questions, video paths and correct answers will be added later.
const questionBank = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  question:
    index === 0
      ? "The meaning of the word Greedy is _______."
      : `Question ${index + 1} will be added here.`,
  options: [
    { id: "A", label: "Option A", video: "" },
    { id: "B", label: "Option B", video: "" },
    { id: "C", label: "Option C", video: "" },
    { id: "D", label: "Option D", video: "" },
  ],
  // Temporary answer for testing. Replace when real questions are added.
  correctAnswer: "A",
}));

const timeOptions = [
  { label: "2 Minutes", seconds: 2 * 60, questions: 5 },
  { label: "5 Minutes", seconds: 5 * 60, questions: 10 },
  { label: "10 Minutes", seconds: 10 * 60, questions: 20 },
];

function TenaliQuiz({ onBack }) {
  const [selectedTime, setSelectedTime] = useState(120);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [endReason, setEndReason] = useState(null);

  const [secondsLeft, setSecondsLeft] = useState(120);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const selectedTimeOption = timeOptions.find(
    (option) => option.seconds === selectedTime
  );

  const totalQuestions = selectedTimeOption.questions;
  const questions = questionBank.slice(0, totalQuestions);
  const currentQuestion = questions[currentQuestionIndex];

  // Countdown timer
  useEffect(() => {
    if (!quizStarted || quizEnded) return;

    const timer = setInterval(() => {
      setSecondsLeft((previousTime) =>
        Math.max(previousTime - 1, 0)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizEnded]);

  // End the quiz when the timer reaches zero
  useEffect(() => {
    if (quizStarted && secondsLeft === 0 && !quizEnded) {
      setQuizEnded(true);
      setEndReason("time");
    }
  }, [secondsLeft, quizStarted, quizEnded]);

  // Format timer as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Start quiz
  const handleStartQuiz = () => {
    setSecondsLeft(selectedTime);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setCorrectAnswers(0);
    setEndReason(null);
    setQuizEnded(false);
    setQuizStarted(true);
  };

  // Select an answer
  const handleOptionSelect = (optionId) => {
    if (submitted || quizEnded) return;
    setSelectedOption(optionId);
  };

  // Submit answer
  const handleSubmit = () => {
    if (!selectedOption || submitted || quizEnded) return;

    setSubmitted(true);

    if (selectedOption === currentQuestion.correctAnswer) {
      setCorrectAnswers((previousScore) => previousScore + 1);
    }
  };

  // Retry after a wrong answer
  const handleTryAgain = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      setQuizEnded(true);
      setEndReason("completed");
      return;
    }

    setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
    setSelectedOption(null);
    setSubmitted(false);
  };

  // Return to time selection and reset quiz
  const handleRestart = () => {
    setQuizStarted(false);
    setQuizEnded(false);
    setEndReason(null);
    setSecondsLeft(selectedTime);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setCorrectAnswers(0);
  };

  // TIME SELECTION SCREEN
  if (!quizStarted) {
    return (
      <div className="tenali-quiz-page">
        <div className="tenali-quiz-header">
          <button
            className="tenali-quiz-back"
            onClick={onBack}
            type="button"
          >
            ← BACK
          </button>

          <h1>Tenali Rama - Quiz</h1>
        </div>

        <div className="tenali-time-selection">
          <div className="tenali-time-icon">⏱️</div>

          <h2>Select Your Quiz Time</h2>

          <p className="tenali-time-description">
            Choose a time limit before starting your quiz.
          </p>

          <div className="tenali-time-options">
            {timeOptions.map((option) => (
              <button
                key={option.seconds}
                type="button"
                className={`tenali-time-card ${
                  selectedTime === option.seconds ? "selected" : ""
                }`}
                onClick={() => setSelectedTime(option.seconds)}
              >
                <span className="tenali-time-card-icon">⏰</span>
                <strong>{option.label}</strong>
                <span>{option.questions} Questions</span>
              </button>
            ))}
          </div>

          <button
            className="tenali-start-button"
            onClick={handleStartQuiz}
            type="button"
          >
            Start Quiz →
          </button>
        </div>
      </div>
    );
  }

  // QUIZ RESULT / TIME UP SCREEN
  if (quizEnded) {
    const timeUp = endReason === "time";

    return (
      <div className="tenali-quiz-page">
        <div className="tenali-quiz-header">
          <h1>Tenali Rama - Quiz</h1>
        </div>

        <div className="tenali-quiz-result">
          <div className="tenali-result-icon">
            {timeUp ? "⏰" : "🏆"}
          </div>

          <h2>
            {timeUp ? "Time's Up!" : "Quiz Completed!"}
          </h2>

          <p>
            {timeUp
              ? "Your quiz has ended because the time limit is over."
              : "Well done! You have completed all the questions."}
          </p>

          <div className="tenali-result-score">
            <span>Correct Answers</span>
            <strong>
              {correctAnswers} / {currentQuestionIndex + (timeUp ? 1 : 1)}
            </strong>
          </div>

          <button
            className="tenali-start-button"
            onClick={handleRestart}
            type="button"
          >
            Back to Time Selection
          </button>

          <button
            className="tenali-quiz-home-button"
            onClick={onBack}
            type="button"
          >
            Back to Lesson Menu
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ SCREEN
  return (
    <div className="tenali-quiz-page">
      <div className="tenali-quiz-header">
        <button
          className="tenali-quiz-back"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <h1>Tenali Rama - Quiz</h1>
      </div>

      <div className="tenali-quiz-container">

        {/* TIMER AND QUESTION PROGRESS */}
        <div className="tenali-quiz-topbar">
          <div className="tenali-question-progress">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>

          <div
            className={`tenali-countdown ${
              secondsLeft <= 30 ? "tenali-timer-warning" : ""
            }`}
          >
            <span>⏱️</span>
            {formatTime(secondsLeft)}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="tenali-progress-track">
          <div
            className="tenali-progress-fill"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / totalQuestions) * 100
              }%`,
            }}
          />
        </div>

        {/* QUESTION */}
        <div className="tenali-quiz-question">
          <span className="tenali-question-number">
            Question {currentQuestionIndex + 1}
          </span>

          <h2>{currentQuestion.question}</h2>
        </div>

        {/* FOUR VIDEO OPTIONS */}
        <div className="tenali-quiz-options">
          {currentQuestion.options.map((option) => (
            <div
              key={option.id}
              className={`tenali-quiz-option ${
                selectedOption === option.id ? "selected" : ""
              }`}
              onClick={() => handleOptionSelect(option.id)}
              role="button"
              tabIndex={submitted ? -1 : 0}
              aria-pressed={selectedOption === option.id}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  handleOptionSelect(option.id);
                }
              }}
            >
              {/* VIDEO PLACEHOLDER - VIDEOS WILL BE CONNECTED LATER */}
              <div className="tenali-quiz-video-placeholder">
                <span className="tenali-video-icon">▶</span>
                <p>Video {option.id}</p>
                <small>Video will be added here</small>
              </div>

              <div className="tenali-option-details">
                <span className="tenali-option-letter">
                  {option.id}
                </span>
                <span>{option.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* SUBMIT ANSWER */}
        {!submitted && (
          <button
            className="tenali-quiz-submit"
            onClick={handleSubmit}
            disabled={!selectedOption}
            type="button"
          >
            Submit Answer
          </button>
        )}

        {/* ANSWER FEEDBACK */}
        {submitted && (
          <div
            className={`tenali-quiz-feedback ${
              selectedOption === currentQuestion.correctAnswer
                ? "correct"
                : "wrong"
            }`}
          >
            {selectedOption === currentQuestion.correctAnswer ? (
              <>
                <h3>✓ Correct Answer!</h3>
                <p>Well done! You selected the right answer.</p>

                <button
                  className="tenali-quiz-next"
                  onClick={handleNextQuestion}
                  type="button"
                >
                  {currentQuestionIndex === totalQuestions - 1
                    ? "Finish Quiz"
                    : "Next Question →"}
                </button>
              </>
            ) : (
              <>
                <h3>✕ Wrong Answer!</h3>
                <p>Try Again!</p>

                <button
                  className="tenali-quiz-retry"
                  onClick={handleTryAgain}
                  type="button"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TenaliQuiz;
