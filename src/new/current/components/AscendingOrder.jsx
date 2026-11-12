
import { useEffect, useState } from "react";
import "./AscendingOrder.css";

const TIMER_OPTIONS = [2, 5, 10, 15, 20];
const RANGE_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const DEFAULT_RANGE = 10;

// Generate 3 unique random numbers from 0 to selected range.
const randomNumbers = (maxRange = DEFAULT_RANGE) => {
  const numbers = [];

  while (numbers.length < 3) {
    const number = Math.floor(Math.random() * (maxRange + 1));

    if (!numbers.includes(number)) {
      numbers.push(number);
    }
  }

  return numbers;
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

function AscendingOrder({ onBack }) {
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [selectedRange, setSelectedRange] = useState(DEFAULT_RANGE);

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(5 * 60);

  const [numbers, setNumbers] = useState(() =>
    randomNumbers(DEFAULT_RANGE)
  );

  const [answer, setAnswer] = useState([]);
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
    setNumbers(randomNumbers(selectedRange));
    setAnswer([]);
    setQuestionNumber(1);
    setCorrectCount(0);
    setIncorrectCount(0);
    setTimeLeft(selectedDuration * 60);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  // End test manually
  const endTest = () => {
    if (!quizStarted || quizCompleted) return;

    setQuizCompleted(true);
  };

  // Select a number
  const selectNumber = (number) => {
    if (
      quizCompleted ||
      timeLeft === 0 ||
      answer.includes(number)
    ) {
      return;
    }

    setAnswer((previous) => [...previous, number]);
  };

  // Remove a selected number
  const removeNumber = (number) => {
    if (quizCompleted || timeLeft === 0) return;

    setAnswer((previous) =>
      previous.filter((item) => item !== number)
    );
  };

  // Play feedback sound
  const playSound = (file) => {
    const audio = new Audio(file);
    audio.play().catch(() => {});
  };

  // Next question
  const nextQuestion = () => {
    if (
      answer.length !== 3 ||
      quizCompleted ||
      timeLeft === 0
    ) {
      return;
    }

    const correctAnswer = [...numbers].sort(
      (a, b) => a - b
    );

    const isCorrect = answer.every(
      (number, index) => number === correctAnswer[index]
    );

    if (isCorrect) {
      setCorrectCount((previous) => previous + 1);
      playSound("/sounds/success-1-6297.mp3");
    } else {
      setIncorrectCount((previous) => previous + 1);
      playSound("/sounds/fail-2-277575.mp3");
    }

    setNumbers(randomNumbers(selectedRange));
    setAnswer([]);
    setQuestionNumber((previous) => previous + 1);
  };

  // Restart quiz
  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setSelectedDuration(5);
    setSelectedRange(DEFAULT_RANGE);
    setTimeLeft(5 * 60);
    setNumbers(randomNumbers(DEFAULT_RANGE));
    setAnswer([]);
    setQuestionNumber(1);
    setCorrectCount(0);
    setIncorrectCount(0);
  };

  // Test analysis
  // The current question is unanswered when the test ends.
  const unansweredCount = quizCompleted ? 1 : 0;

  const attemptedQuestions = correctCount + incorrectCount;

  const totalQuestions =
    attemptedQuestions + unansweredCount;

  const accuracy =
    attemptedQuestions > 0
      ? Math.round((correctCount / attemptedQuestions) * 100)
      : 0;

  const scorePercentage =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  // Timer and range selection screen
  if (!quizStarted) {
    return (
      <main className="ascending-quiz-page">
        <button
          className="ascending-quiz-back"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <section className="ascending-setup-card">
          <div className="ascending-setup-icon">⏱️</div>

          <span className="ascending-quiz-eyebrow">
            NUMBER SENSE
          </span>

          <h1>Ascending Order</h1>

          <p className="ascending-setup-description">
            Choose your quiz time and number range.
          </p>

          <h3>Select Time</h3>

          <div className="ascending-timer-options">
            {TIMER_OPTIONS.map((duration) => (
              <button
                key={duration}
                type="button"
                className={`ascending-timer-option ${
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
            className="ascending-range-dropdown"
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

          <p className="ascending-selected-range">
            Numbers from 0 to {selectedRange}
          </p>

          <p className="ascending-setup-hint">
            Arrange the numbers from smallest to biggest!
          </p>

          <button
            className="ascending-primary-button"
            onClick={startQuiz}
            type="button"
          >
            ▶ Start Quiz
          </button>
        </section>
      </main>
    );
  }

  // Quiz result and analysis screen
  if (quizCompleted) {
    return (
      <main className="ascending-quiz-page">
        <button
          className="ascending-quiz-back"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <section className="ascending-result-card">
          <div className="ascending-result-icon">🏆</div>

          <h1>Test Analysis</h1>

          <p className="ascending-result-message">
            Great effort! Your test has ended.
          </p>

          <div className="ascending-final-score">
            <span>Your Score</span>

            <strong>
              {correctCount} / {totalQuestions}
            </strong>

            <span>{scorePercentage}% Score</span>
          </div>

          <div className="ascending-result-stats">
            <div className="ascending-stat correct-stat">
              <strong>{correctCount}</strong>
              <span>Correct</span>
            </div>

            <div className="ascending-stat incorrect-stat">
              <strong>{incorrectCount}</strong>
              <span>Incorrect</span>
            </div>

            <div className="ascending-stat unanswered-stat">
              <strong>{unansweredCount}</strong>
              <span>Unanswered</span>
            </div>
          </div>

          <div className="ascending-analysis-details">
            <div>
              <span>Total Questions</span>
              <strong>{totalQuestions}</strong>
            </div>

            <div>
              <span>Attempted Questions</span>
              <strong>{attemptedQuestions}</strong>
            </div>

            <div>
              <span>Accuracy</span>
              <strong>{accuracy}%</strong>
            </div>

            <div>
              <span>Time Remaining</span>
              <strong>{formatTime(timeLeft)}</strong>
            </div>
          </div>

          <button
            className="ascending-primary-button"
            onClick={restartQuiz}
            type="button"
          >
            Play Again
          </button>

          <button
            className="ascending-secondary-button"
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
    <main className="ascending-quiz-page">
      <header className="ascending-quiz-header">
        <button
          className="ascending-quiz-back"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <div>
          <span className="ascending-quiz-eyebrow">
            NUMBER SENSE
          </span>

          <h1>Arrange in Ascending Order</h1>

          <p>Arrange the numbers from smallest to biggest.</p>
        </div>
      </header>

      <section className="ascending-quiz-card">
        <div className="ascending-quiz-progress">
          <span>Question {questionNumber}</span>
          <span>Score: {correctCount}</span>
        </div>

        <div className="ascending-timer-display">
          <span>⏰</span>
          <span>Time Left: {formatTime(timeLeft)}</span>
        </div>

        <div className="ascending-progress-track">
          <div
            className="ascending-progress-fill"
            style={{
              width: `${Math.min(
                (questionNumber / Math.max(questionNumber + 4, 5)) * 100,
                100
              )}%`,
            }}
          />
        </div>

        <h2>Arrange these numbers</h2>

        <p className="ascending-quiz-instruction">
          Select the numbers in ascending order.
        </p>

        <div className="ascending-question-numbers">
          {numbers.map((number) => (
            <div
              key={number}
              className="ascending-question-number"
            >
              {number}
            </div>
          ))}
        </div>

        <h3>Your Answer</h3>

        <div className="ascending-answer-slots">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              type="button"
              className={`ascending-answer-slot ${
                answer[index] !== undefined ? "filled" : ""
              }`}
              onClick={() => {
                if (answer[index] !== undefined) {
                  removeNumber(answer[index]);
                }
              }}
              disabled={quizCompleted || timeLeft === 0}
              aria-label={`Answer position ${index + 1}`}
            >
              {answer[index] !== undefined
                ? answer[index]
                : "?"}
            </button>
          ))}
        </div>

        <p className="ascending-slot-hint">
          Tap a filled box to remove its number.
        </p>

        <h3>Choose a Number</h3>

        <div className="ascending-choice-buttons">
          {numbers.map((number) => (
            <button
              key={number}
              type="button"
              className={`ascending-choice-button ${
                answer.includes(number) ? "selected" : ""
              }`}
              onClick={() => selectNumber(number)}
              disabled={
                answer.includes(number) ||
                quizCompleted ||
                timeLeft === 0
              }
            >
              {number}
            </button>
          ))}
        </div>

        <button
          className="ascending-primary-button ascending-next-button"
          onClick={nextQuestion}
          type="button"
          disabled={answer.length !== 3 || timeLeft === 0}
        >
          ➡ Next
        </button>

        <button
          className="ascending-secondary-button ascending-end-button"
          onClick={endTest}
          type="button"
        >
          End Test
        </button>
      </section>
    </main>
  );
}

export default AscendingOrder;
