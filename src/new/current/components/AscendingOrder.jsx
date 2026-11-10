
import { useEffect, useState } from "react";
import "./AscendingOrder.css";

const TIMER_OPTIONS = [2, 5, 10, 15, 20];

const randomNumbers = () => {
  const numbers = [];

  while (numbers.length < 3) {
    const number = Math.floor(Math.random() * 20) + 1;

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
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [numbers, setNumbers] = useState(() => randomNumbers());
  const [answer, setAnswer] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // Start the countdown only after the quiz begins.
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(timer);
          setQuizCompleted(true);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);

  const startQuiz = () => {
    setNumbers(randomNumbers());
    setAnswer([]);
    setQuestionNumber(1);
    setCorrectCount(0);
    setIncorrectCount(0);
    setTimeLeft(selectedDuration * 60);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  const selectNumber = (number) => {
    if (quizCompleted || answer.includes(number)) return;

    setAnswer((previous) => [...previous, number]);
  };

  const removeNumber = (number) => {
    if (quizCompleted) return;

    setAnswer((previous) =>
      previous.filter((item) => item !== number)
    );
  };

  const nextQuestion = () => {
    if (answer.length !== 3 || quizCompleted || timeLeft === 0) {
      return;
    }

    const correctAnswer = [...numbers].sort((a, b) => a - b);

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

    setNumbers(randomNumbers());
    setAnswer([]);
    setQuestionNumber((previous) => previous + 1);
  };

  const playSound = (file) => {
    const audio = new Audio(file);
    audio.play().catch(() => {});
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setSelectedDuration(5);
    setTimeLeft(5 * 60);
    setNumbers(randomNumbers());
    setAnswer([]);
    setQuestionNumber(1);
    setCorrectCount(0);
    setIncorrectCount(0);
  };

  // The currently displayed question is unanswered if the timer expires
  // before the child submits it using the Next button.
  const unansweredCount = quizCompleted ? 1 : 0;
  const totalQuestions =
    correctCount + incorrectCount + unansweredCount;

  const accuracy =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  // Timer selection screen
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
            Choose your quiz time.
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

          <p className="ascending-setup-hint">
            Answer as many questions as you can before time runs out!
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

  // Quiz result screen
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

          <h1>Quiz Completed!</h1>

          <p className="ascending-result-message">
            Great effort! Your time is up.
          </p>

          <div className="ascending-final-score">
            <span>Your Score</span>
            <strong>
              {correctCount} / {totalQuestions}
            </strong>
            <span>{accuracy}% Accuracy</span>
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

          <p className="ascending-total-questions">
            Total Questions: {totalQuestions}
          </p>

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
              disabled={quizCompleted}
              aria-label={`Answer position ${index + 1}`}
            >
              {answer[index] !== undefined ? answer[index] : "?"}
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
              disabled={answer.includes(number)}
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
      </section>
    </main>
  );
}

export default AscendingOrder;
