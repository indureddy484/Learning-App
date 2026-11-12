
import { useEffect, useState } from "react";
import "./CompareNumbers.css";

const TIMER_OPTIONS = [2, 5, 10, 15, 20];
const RANGE_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const DEFAULT_RANGE = 10;

// Generate two random numbers from 0 to the selected maximum.
const generateQuestion = (maxRange = DEFAULT_RANGE) => ({
  left: Math.floor(Math.random() * (maxRange + 1)),
  right: Math.floor(Math.random() * (maxRange + 1)),
});

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

function CompareNumbers({ onBack }) {
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [selectedRange, setSelectedRange] = useState(DEFAULT_RANGE);

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [question, setQuestion] = useState(() =>
    generateQuestion(DEFAULT_RANGE)
  );

  const [selectedSymbol, setSelectedSymbol] = useState("");

  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((previousTime) =>
        Math.max(previousTime - 1, 0)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);

  // Automatically finish when time reaches zero
  useEffect(() => {
    if (quizStarted && timeLeft === 0) {
      setQuizCompleted(true);
    }
  }, [quizStarted, timeLeft]);

  // Start quiz
  const startQuiz = () => {
    setQuestion(generateQuestion(selectedRange));
    setSelectedSymbol("");
    setQuestionNumber(1);
    setCorrectCount(0);
    setIncorrectCount(0);
    setTimeLeft(selectedDuration * 60);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  // Choose comparison symbol
  const chooseSymbol = (symbol) => {
    if (quizCompleted || timeLeft === 0) return;

    setSelectedSymbol(symbol);
  };

  // Next question
  const nextQuestion = () => {
    if (!selectedSymbol || quizCompleted || timeLeft === 0) {
      return;
    }

    let correctSymbol;

    if (question.left < question.right) {
      correctSymbol = "<";
    } else if (question.left > question.right) {
      correctSymbol = ">";
    } else {
      correctSymbol = "=";
    }

    if (selectedSymbol === correctSymbol) {
      setCorrectCount((previous) => previous + 1);
    } else {
      setIncorrectCount((previous) => previous + 1);
    }

    setQuestion(generateQuestion(selectedRange));
    setSelectedSymbol("");
    setQuestionNumber((previous) => previous + 1);
  };

  // End test
  const endTest = () => {
    setQuizCompleted(true);
  };

  // Restart quiz
  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setSelectedDuration(5);
    setSelectedRange(DEFAULT_RANGE);
    setTimeLeft(5 * 60);
    setQuestion(generateQuestion(DEFAULT_RANGE));
    setSelectedSymbol("");
    setQuestionNumber(1);
    setCorrectCount(0);
    setIncorrectCount(0);
  };

  const unansweredCount = quizCompleted ? 1 : 0;

  const totalQuestions =
    correctCount + incorrectCount + unansweredCount;

  const accuracy =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  // Timer and range selection screen
  if (!quizStarted) {
    return (
      <main className="compare-quiz-page">
        <button
          className="compare-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <section className="compare-setup-card">
          <div className="compare-setup-icon">⚖️</div>

          <span className="compare-eyebrow">
            NUMBER SENSE
          </span>

          <h1>Compare Numbers</h1>

          <p className="compare-setup-description">
            Choose your quiz time and number range.
          </p>

          <h3>Select Time</h3>

          <div className="compare-timer-options">
            {TIMER_OPTIONS.map((duration) => (
              <button
                key={duration}
                type="button"
                className={`compare-timer-option ${
                  selectedDuration === duration ? "active" : ""
                }`}
                onClick={() => setSelectedDuration(duration)}
                aria-pressed={selectedDuration === duration}
              >
                <strong>{duration}</strong>
                <span>min</span>
              </button>
            ))}
          </div>

          <h3>Select Number Range</h3>

          <select
            className="compare-range-dropdown"
            value={selectedRange}
            onChange={(event) =>
              setSelectedRange(Number(event.target.value))
            }
          >
            {RANGE_OPTIONS.map((range) => (
              <option key={range} value={range}>
                ≤ {range}
              </option>
            ))}
          </select>

          <p className="compare-selected-range">
            Numbers from 0 to {selectedRange}
          </p>

          <p className="compare-setup-hint">
            Compare the numbers and answer as many questions as you can!
          </p>

          <button
            className="compare-primary-button"
            onClick={startQuiz}
            type="button"
          >
            ▶ Start Quiz
          </button>
        </section>
      </main>
    );
  }

  // Quiz result screen
  if (quizCompleted) {
    return (
      <main className="compare-quiz-page">
        <button
          className="compare-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <section className="compare-result-card">
          <div className="compare-result-icon">🏆</div>

          <h1>Test Completed!</h1>

          <p className="compare-result-message">
            Great effort! Your quiz has ended.
          </p>

          <div className="compare-final-score">
            <span>Your Score</span>

            <strong>
              {correctCount} / {totalQuestions}
            </strong>

            <span>{accuracy}% Accuracy</span>
          </div>

          <div className="compare-result-stats">
            <div className="compare-stat correct-stat">
              <strong>{correctCount}</strong>
              <span>Correct</span>
            </div>

            <div className="compare-stat incorrect-stat">
              <strong>{incorrectCount}</strong>
              <span>Incorrect</span>
            </div>

            <div className="compare-stat unanswered-stat">
              <strong>{unansweredCount}</strong>
              <span>Unanswered</span>
            </div>
          </div>

          <p className="compare-total-questions">
            Total Questions: {totalQuestions}
          </p>

          <button
            className="compare-primary-button"
            onClick={restartQuiz}
            type="button"
          >
            Play Again
          </button>

          <button
            className="compare-secondary-button"
            onClick={onBack}
            type="button"
          >
            Back to Number Sense
          </button>
        </section>
      </main>
    );
  }

  // Active quiz screen
  return (
    <main className="compare-quiz-page">
      <header className="compare-quiz-header">
        <button
          className="compare-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <div>
          <span className="compare-eyebrow">
            NUMBER SENSE
          </span>

          <h1>Compare the Numbers</h1>

          <p>Choose the correct comparison symbol.</p>
        </div>
      </header>

      <section className="compare-quiz-card">
        <div className="compare-quiz-progress">
          <span>Question {questionNumber}</span>
          <span>Score: {correctCount}</span>
        </div>

        <div className="compare-timer-display">
          <span>⏰</span>
          <span>Time Left: {formatTime(timeLeft)}</span>
        </div>

        <div className="compare-question">
          <span className="compare-number">
            {question.left}
          </span>

          <div
            className={`compare-symbol-display ${
              selectedSymbol ? "has-selection" : ""
            }`}
          >
            {selectedSymbol || "___"}
          </div>

          <span className="compare-number">
            {question.right}
          </span>
        </div>

        <p className="compare-instruction">
          Select the correct symbol.
        </p>

        <div className="compare-symbol-options">
          {["<", "=", ">"].map((symbol) => (
            <button
              key={symbol}
              type="button"
              className={`compare-symbol-button ${
                selectedSymbol === symbol ? "selected" : ""
              }`}
              onClick={() => chooseSymbol(symbol)}
              aria-pressed={selectedSymbol === symbol}
            >
              {symbol}
            </button>
          ))}
        </div>

        <button
          className="compare-primary-button compare-next-button"
          onClick={nextQuestion}
          type="button"
          disabled={!selectedSymbol || timeLeft === 0}
        >
          ➡ Next
        </button>

        <button
          className="compare-end-button"
          onClick={endTest}
          type="button"
        >
          ⛔ End Test
        </button>
      </section>
    </main>
  );
}

export default CompareNumbers;
