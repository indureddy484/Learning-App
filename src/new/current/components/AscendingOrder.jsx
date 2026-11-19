
import { useEffect, useRef, useState } from "react";
import "./AscendingOrder.css";

const TIMER_OPTIONS = [2, 5, 10, 15, 20];
const RANGE_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const DEFAULT_RANGE = 10;
const VERY_GOOD_SOUND = "/sounds/very-good.mp3";
const TRY_AGAIN_SOUND = "/sounds/try-again.mp3";

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

const getCorrectOrder = (numbers) =>
  [...numbers].sort((a, b) => a - b);

const formatOrder = (numbers) =>
  numbers.length ? numbers.join(" → ") : "Not Answered";

function AscendingOrder({ onBack }) {
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [selectedRange, setSelectedRange] = useState(DEFAULT_RANGE);
  const [mode, setMode] = useState("practice");

  // Practice mode has its own question and answer state.
  const [practiceNumbers, setPracticeNumbers] = useState(() => randomNumbers(DEFAULT_RANGE));
  const [practiceAnswer, setPracticeAnswer] = useState([]);
  const [practiceFeedback, setPracticeFeedback] = useState("");
  const [practiceLocked, setPracticeLocked] = useState(false);
  const practiceTimeoutRef = useRef(null);

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

  // Stores each submitted question and its answers.
  const [questionHistory, setQuestionHistory] = useState([]);

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
    setQuestionHistory([]);
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

  // Submit current question and move to next
  const nextQuestion = () => {
    if (
      answer.length !== 3 ||
      quizCompleted ||
      timeLeft === 0
    ) {
      return;
    }

    const correctAnswer = getCorrectOrder(numbers);

    const isCorrect = answer.every(
      (number, index) => number === correctAnswer[index]
    );

    // Save complete question analysis
    const historyItem = {
      questionNumber,
      questionNumbers: [...numbers],
      selectedAnswer: [...answer],
      correctAnswer,
      status: isCorrect ? "Correct" : "Wrong",
      isCorrect,
    };

    setQuestionHistory((previous) => [
      ...previous,
      historyItem,
    ]);

    if (isCorrect) {
      setCorrectCount((previous) => previous + 1);
      playSound(VERY_GOOD_SOUND);
    } else {
      setIncorrectCount((previous) => previous + 1);
      playSound(TRY_AGAIN_SOUND);
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
    setQuestionHistory([]);
  };

  /*
   * Include the current question in the report when the quiz ends.
   * A partially completed answer is recorded as Not Submitted.
   */
  const currentQuestionHistory = quizCompleted
    ? [
        ...questionHistory,
        {
          questionNumber,
          questionNumbers: [...numbers],
          selectedAnswer: [...answer],
          correctAnswer: getCorrectOrder(numbers),
          status: answer.length > 0 ? "Not Submitted" : "Unanswered",
          isCorrect: false,
        },
      ]
    : questionHistory;

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

  const clearPracticeTimeout = () => {
    if (practiceTimeoutRef.current) {
      clearTimeout(practiceTimeoutRef.current);
      practiceTimeoutRef.current = null;
    }
  };

  const openPractice = () => {
    clearPracticeTimeout();
    setMode("practice");
    setQuizStarted(false);
    setQuizCompleted(false);
    setPracticeNumbers(randomNumbers(selectedRange));
    setPracticeAnswer([]);
    setPracticeFeedback("");
    setPracticeLocked(false);
  };

  const openQuizSetup = () => {
    clearPracticeTimeout();
    setMode("quiz");
    setQuizStarted(false);
    setQuizCompleted(false);
    setAnswer([]);
  };

  const choosePracticeNumber = (number) => {
    if (practiceLocked || practiceAnswer.includes(number) || practiceAnswer.length >= 3) return;

    const nextAnswer = [...practiceAnswer, number];
    setPracticeAnswer(nextAnswer);
    if (nextAnswer.length !== 3) return;

    const correctAnswer = getCorrectOrder(practiceNumbers);
    const isCorrect = nextAnswer.every((value, index) => value === correctAnswer[index]);

    if (isCorrect) {
      setPracticeLocked(true);
      setPracticeFeedback("correct");
      playSound(VERY_GOOD_SOUND);
      practiceTimeoutRef.current = setTimeout(() => {
        setPracticeNumbers(randomNumbers(selectedRange));
        setPracticeAnswer([]);
        setPracticeFeedback("");
        setPracticeLocked(false);
        practiceTimeoutRef.current = null;
      }, 1100);
    } else {
      setPracticeFeedback("incorrect");
      playSound(TRY_AGAIN_SOUND);
      practiceTimeoutRef.current = setTimeout(() => {
        setPracticeAnswer([]);
        setPracticeFeedback("");
        practiceTimeoutRef.current = null;
      }, 900);
    }
  };

  const removePracticeNumber = (number) => {
    if (practiceLocked || practiceFeedback === "incorrect") return;
    setPracticeAnswer((previous) => previous.filter((value) => value !== number));
  };

  useEffect(() => () => clearPracticeTimeout(), []);

  // Practice is shown first. The Quiz button opens the existing timed quiz flow.
  if (mode === "practice") {
    return (
      <main className="ascending-quiz-page ascending-practice-page">
        <div className="ascending-practice-topbar">
          <button className="ascending-quiz-back" onClick={onBack} type="button">← BACK</button>

          <div className="ascending-practice-range">
            <label htmlFor="ascending-practice-range">Number range</label>
            <select
              id="ascending-practice-range"
              className="ascending-range-dropdown"
              value={selectedRange}
              onChange={(event) => {
                const range = Number(event.target.value);
                setSelectedRange(range);
                setPracticeNumbers(randomNumbers(range));
                setPracticeAnswer([]);
                setPracticeFeedback("");
                setPracticeLocked(false);
                clearPracticeTimeout();
              }}
            >
              {RANGE_OPTIONS.map((range) => <option key={range} value={range}>0 to {range}</option>)}
            </select>
          </div>

          <button className="ascending-practice-quiz-button" onClick={openQuizSetup} type="button">📝 Quiz</button>
        </div>

        <section className="ascending-practice-card">
          <span className="ascending-quiz-eyebrow">NUMBER SENSE · PRACTICE</span>
          <h1>Arrange in Ascending Order</h1>
          <p className="ascending-practice-instruction">Arrange the numbers from smallest to biggest.</p>

          <div className="ascending-practice-number-row">
            {practiceNumbers.map((number) => (
              <div className="ascending-practice-number" key={number}>{number}</div>
            ))}
          </div>

          <h3>Your Answer</h3>
          <div className="ascending-practice-answer-slots">
            {[0, 1, 2].map((index) => {
              const value = practiceAnswer[index];
              return (
                <button
                  key={index}
                  type="button"
                  className={`ascending-practice-answer-slot ${value !== undefined ? "filled" : ""}`}
                  onClick={() => value !== undefined && removePracticeNumber(value)}
                  disabled={practiceLocked || practiceFeedback === "incorrect"}
                  aria-label={`Answer position ${index + 1}`}
                >
                  {value !== undefined ? value : "?"}
                </button>
              );
            })}
          </div>
          <p className="ascending-practice-hint">Tap the numbers in the correct order.</p>

          <h3>Choose the Numbers</h3>
          <div className="ascending-practice-choices">
            {practiceNumbers.map((number) => (
              <button
                key={number}
                type="button"
                className={`ascending-practice-choice ${practiceAnswer.includes(number) ? "selected" : ""}`}
                onClick={() => choosePracticeNumber(number)}
                disabled={practiceAnswer.includes(number) || practiceLocked || practiceFeedback === "incorrect"}
              >
                {number}
              </button>
            ))}
          </div>

          <div className={`ascending-practice-feedback ${practiceFeedback ? `feedback-${practiceFeedback}` : ""}`} aria-live="polite">
            {practiceFeedback === "correct" ? "🌟 Very Good!" : practiceFeedback === "incorrect" ? "💛 Try Again!" : " "}
          </div>
        </section>
      </main>
    );
  }

  // Setup screen
  if (!quizStarted) {
    return (
      <main className="ascending-quiz-page">
        <button
          className="ascending-quiz-back"
          onClick={openPractice}
          type="button"
        >
          ← PRACTICE
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

  // Result and question-wise analysis screen
  if (quizCompleted) {
    return (
      <main className="ascending-quiz-page ascending-results-page">
        <button
          className="ascending-quiz-back"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <section className="ascending-result-card">
          <div className="ascending-result-icon">🏆</div>

          <h1>Test Completed!</h1>

          <p className="ascending-result-message">
            Great effort! Your test has ended.
          </p>

          <div className="ascending-final-score">
            <span>Marks</span>

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

            <div className="ascending-stat wrong-stat">
              <strong>{incorrectCount}</strong>
              <span>Wrong</span>
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

          {/* Question-wise analysis */}
          <div className="ascending-review-section">
            <div className="ascending-review-title">
              <h2>Question-wise Analysis</h2>
              <p>
                Review your answers and learn from each question.
              </p>
            </div>

            {currentQuestionHistory.map((item) => (
              <article
                className={`ascending-review-item ${
                  item.status === "Correct"
                    ? "review-correct"
                    : item.status === "Wrong"
                    ? "review-wrong"
                    : "review-unanswered"
                }`}
                key={item.questionNumber}
              >
                <div className="ascending-review-heading">
                  <strong>
                    Question {item.questionNumber}
                  </strong>

                  <span className="ascending-review-status">
                    {item.status}
                  </span>
                </div>

                <div className="ascending-review-question">
                  <span className="ascending-review-label">
                    Given Numbers
                  </span>

                  <strong>
                    {formatOrder(item.questionNumbers)}
                  </strong>
                </div>

                <div className="ascending-answer-details">
                  <div className="ascending-answer-row">
                    <span>Your Answer</span>

                    <strong
                      className={
                        item.isCorrect
                          ? "answer-correct"
                          : item.selectedAnswer.length === 0
                          ? "answer-missing"
                          : "answer-wrong"
                      }
                    >
                      {formatOrder(item.selectedAnswer)}
                    </strong>
                  </div>

                  <div className="ascending-answer-row">
                    <span>Correct Answer</span>

                    <strong className="answer-correct">
                      {formatOrder(item.correctAnswer)}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            className="ascending-print-button"
            onClick={() => window.print()}
            type="button"
          >
            🖨 Print Analysis
          </button>

          <button
            className="ascending-primary-button"
            onClick={restartQuiz}
            type="button"
          >
            Play Again
          </button>

          <button
            className="ascending-secondary-button"
            onClick={openPractice}
            type="button"
          >
            Back to Practice
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
          onClick={openPractice}
          type="button"
        >
          ← PRACTICE
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
