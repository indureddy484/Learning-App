import { useEffect, useRef, useState } from "react";
import "./CompareNumbers.css";

const TIMER_OPTIONS = [2, 5, 10, 15, 20];
const RANGE_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const DEFAULT_RANGE = 10;

// Change these two paths if your sound files have different names.
const VERY_GOOD_SOUND = "/sounds/very-good.mp3";
const TRY_AGAIN_SOUND = "/sounds/try-again.mp3";

const generateQuestion = (maxRange = DEFAULT_RANGE) => ({
  left: Math.floor(Math.random() * (maxRange + 1)),
  right: Math.floor(Math.random() * (maxRange + 1)),
});

const getCorrectSymbol = (question) => {
  if (question.left < question.right) return "<";
  if (question.left > question.right) return ">";
  return "=";
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

function CompareNumbers({ onBack }) {
  // Practice is shown first. The Quiz button opens the existing timed quiz.
  const [mode, setMode] = useState("practice");
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
  const [wrongCount, setWrongCount] = useState(0);
  const [questionHistory, setQuestionHistory] = useState([]);

  const [practiceFeedback, setPracticeFeedback] = useState("");
  const [practiceLocked, setPracticeLocked] = useState(false);
  const practiceAdvanceRef = useRef(null);

  // Clear any pending practice transition when leaving practice.
  useEffect(() => {
    return () => {
      if (practiceAdvanceRef.current) {
        clearTimeout(practiceAdvanceRef.current);
      }
    };
  }, []);

  const playFeedbackSound = (soundPath) => {
    const audio = new Audio(soundPath);
    audio.play().catch((error) => {
      // Browsers may block playback until audio is allowed by the user.
      console.warn("Could not play feedback sound:", error);
    });
  };

  const startPractice = () => {
    if (practiceAdvanceRef.current) {
      clearTimeout(practiceAdvanceRef.current);
    }
    setQuestion(generateQuestion(selectedRange));
    setPracticeFeedback("");
    setPracticeLocked(false);
    setSelectedSymbol("");
  };

  const choosePracticeSymbol = (symbol) => {
    if (practiceLocked) return;

    const isCorrect = symbol === getCorrectSymbol(question);

    if (isCorrect) {
      setSelectedSymbol(symbol);
      setPracticeFeedback("very-good");
      setPracticeLocked(true);
      playFeedbackSound(VERY_GOOD_SOUND);

      practiceAdvanceRef.current = setTimeout(() => {
        setQuestion(generateQuestion(selectedRange));
        setSelectedSymbol("");
        setPracticeFeedback("");
        setPracticeLocked(false);
      }, 1100);
    } else {
      setPracticeFeedback("try-again");
      playFeedbackSound(TRY_AGAIN_SOUND);
    }
  };

  // Countdown timer for the existing quiz.
  useEffect(() => {
    if (mode !== "quiz" || !quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => Math.max(previousTime - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, quizStarted, quizCompleted]);

  useEffect(() => {
    if (mode === "quiz" && quizStarted && timeLeft === 0) {
      setQuizCompleted(true);
    }
  }, [mode, quizStarted, timeLeft]);

  const openQuiz = () => {
    if (practiceAdvanceRef.current) {
      clearTimeout(practiceAdvanceRef.current);
      practiceAdvanceRef.current = null;
    }
    setPracticeFeedback("");
    setPracticeLocked(false);
    setMode("quiz");
    setQuizStarted(false);
    setQuizCompleted(false);
  };

  const openPractice = () => {
    setMode("practice");
    setQuizStarted(false);
    setQuizCompleted(false);
    startPractice();
  };

  const startQuiz = () => {
    setQuestion(generateQuestion(selectedRange));
    setSelectedSymbol("");
    setQuestionNumber(1);
    setCorrectCount(0);
    setWrongCount(0);
    setQuestionHistory([]);
    setTimeLeft(selectedDuration * 60);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  const chooseSymbol = (symbol) => {
    if (quizCompleted || timeLeft === 0) return;
    setSelectedSymbol(symbol);
  };

  const nextQuestion = () => {
    if (!selectedSymbol || quizCompleted || timeLeft === 0) return;

    const correctSymbol = getCorrectSymbol(question);
    const isCorrect = selectedSymbol === correctSymbol;

    const historyItem = {
      questionNumber,
      left: question.left,
      right: question.right,
      selectedAnswer: selectedSymbol,
      correctAnswer: correctSymbol,
      status: isCorrect ? "Correct" : "Wrong",
      isCorrect,
    };

    setQuestionHistory((previous) => [...previous, historyItem]);

    if (isCorrect) {
      setCorrectCount((previous) => previous + 1);
    } else {
      setWrongCount((previous) => previous + 1);
    }

    setQuestion(generateQuestion(selectedRange));
    setSelectedSymbol("");
    setQuestionNumber((previous) => previous + 1);
  };

  const endTest = () => {
    if (!quizStarted || quizCompleted) return;
    setQuizCompleted(true);
  };

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
    setWrongCount(0);
    setQuestionHistory([]);
    setMode("quiz");
  };

  const currentQuestionHistory = quizCompleted
    ? [
        ...questionHistory,
        {
          questionNumber,
          left: question.left,
          right: question.right,
          selectedAnswer: selectedSymbol || "Not Answered",
          correctAnswer: getCorrectSymbol(question),
          status: selectedSymbol ? "Not Submitted" : "Unanswered",
          isCorrect: false,
        },
      ]
    : questionHistory;

  const unansweredCount = quizCompleted ? 1 : 0;
  const totalQuestions = correctCount + wrongCount + unansweredCount;
  const accuracy =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  // PRACTICE SCREEN - shown first when Compare Numbers opens.
  if (mode === "practice") {
    return (
      <main className="compare-quiz-page compare-practice-page">
        <div className="compare-practice-topbar">
          <button
            className="compare-back-button"
            onClick={onBack}
            type="button"
          >
            ← BACK
          </button>

          <div className="compare-practice-range-top">
            <label htmlFor="compare-practice-range">Number range</label>
            <select
              id="compare-practice-range"
              className="compare-range-dropdown"
              value={selectedRange}
              onChange={(event) => {
                setSelectedRange(Number(event.target.value));
                setQuestion(generateQuestion(Number(event.target.value)));
                setSelectedSymbol("");
                setPracticeFeedback("");
                setPracticeLocked(false);
                if (practiceAdvanceRef.current) {
                  clearTimeout(practiceAdvanceRef.current);
                  practiceAdvanceRef.current = null;
                }
              }}
            >
              {RANGE_OPTIONS.map((range) => (
                <option key={range} value={range}>
                  0 to {range}
                </option>
              ))}
            </select>
          </div>

          <button
            className="compare-mode-button"
            onClick={openQuiz}
            type="button"
          >
            📝 Quiz
          </button>
        </div>

        <section className="compare-quiz-card compare-practice-card">
          <span className="compare-eyebrow">NUMBER SENSE · PRACTICE</span>
          <h1 className="compare-practice-title">Compare the Numbers</h1>
          <p className="compare-instruction">
            Choose the correct symbol.
          </p>

          <div className="compare-question">
            <span className="compare-number">{question.left}</span>
            <div className="compare-symbol-display">
              {selectedSymbol || "___"}
            </div>
            <span className="compare-number">{question.right}</span>
          </div>

          <div className="compare-symbol-options">
            {["<", "=", ">"].map((symbol) => (
              <button
                key={symbol}
                type="button"
                className={`compare-symbol-button ${
                  selectedSymbol === symbol ? "selected" : ""
                }`}
                onClick={() => choosePracticeSymbol(symbol)}
                disabled={practiceLocked}
                aria-label={
                  symbol === "<"
                    ? "Less than"
                    : symbol === ">"
                    ? "Greater than"
                    : "Equal to"
                }
              >
                {symbol}
              </button>
            ))}
          </div>

          <div
            className={`compare-practice-feedback ${
              practiceFeedback === "very-good"
                ? "feedback-correct"
                : practiceFeedback === "try-again"
                ? "feedback-incorrect"
                : ""
            }`}
            aria-live="polite"
          >
            {practiceFeedback === "very-good"
              ? "🌟 Very Good!"
              : practiceFeedback === "try-again"
              ? "💛 Try Again!"
              : " "}
          </div>

        </section>
      </main>
    );
  }

  // Existing quiz setup screen.
  if (!quizStarted) {
    return (
      <main className="compare-quiz-page">
        <div className="compare-practice-topbar">
          <button
            className="compare-back-button"
            onClick={openPractice}
            type="button"
          >
            ← PRACTICE
          </button>
          <span className="compare-mode-label">TIMED QUIZ</span>
        </div>

        <section className="compare-setup-card">
          <div className="compare-setup-icon">⚖️</div>
          <span className="compare-eyebrow">NUMBER SENSE</span>
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

  // Existing quiz result screen.
  if (quizCompleted) {
    return (
      <main className="compare-quiz-page compare-results-page">
        <div className="compare-practice-topbar">
          <button
            className="compare-back-button"
            onClick={openPractice}
            type="button"
          >
            ← PRACTICE
          </button>
        </div>

        <section className="compare-result-card">
          <div className="compare-result-icon">🏆</div>
          <h1>Test Completed!</h1>
          <p className="compare-result-message">
            Great effort! Your quiz has ended.
          </p>

          <div className="compare-final-score">
            <span>Marks</span>
            <strong>{correctCount} / {totalQuestions}</strong>
            <span>{accuracy}% Accuracy</span>
          </div>

          <div className="compare-result-stats">
            <div className="compare-stat correct-stat">
              <strong>{correctCount}</strong>
              <span>Correct</span>
            </div>
            <div className="compare-stat wrong-stat">
              <strong>{wrongCount}</strong>
              <span>Wrong</span>
            </div>
            <div className="compare-stat unanswered-stat">
              <strong>{unansweredCount}</strong>
              <span>Unanswered</span>
            </div>
          </div>

          <div className="compare-review-section">
            <div className="compare-review-title">
              <h2>Question-wise Analysis</h2>
              <p>Review your answers and learn from each question.</p>
            </div>

            {currentQuestionHistory.map((item) => (
              <article
                className={`compare-review-item ${
                  item.status === "Correct"
                    ? "review-correct"
                    : item.status === "Wrong"
                    ? "review-wrong"
                    : "review-unanswered"
                }`}
                key={item.questionNumber}
              >
                <div className="compare-review-heading">
                  <strong>Question {item.questionNumber}</strong>
                  <span className="compare-review-status">
                    {item.status}
                  </span>
                </div>

                <div className="compare-review-question">
                  <span>{item.left}</span>
                  <span>{item.correctAnswer}</span>
                  <span>{item.right}</span>
                </div>

                <div className="compare-answer-details">
                  <div className="compare-answer-row">
                    <span>Your Answer:</span>
                    <strong
                      className={
                        item.isCorrect
                          ? "answer-correct"
                          : item.selectedAnswer === "Not Answered"
                          ? "answer-missing"
                          : "answer-wrong"
                      }
                    >
                      {item.selectedAnswer}
                    </strong>
                  </div>
                  <div className="compare-answer-row">
                    <span>Correct Answer:</span>
                    <strong className="answer-correct">
                      {item.correctAnswer}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            className="compare-print-button"
            onClick={() => window.print()}
            type="button"
          >
            🖨 Print Analysis
          </button>
          <button
            className="compare-primary-button"
            onClick={restartQuiz}
            type="button"
          >
            Play Again
          </button>
          <button
            className="compare-secondary-button"
            onClick={openPractice}
            type="button"
          >
            Back to Practice
          </button>
        </section>
      </main>
    );
  }

  // Existing active timed quiz screen.
  return (
    <main className="compare-quiz-page">
      <header className="compare-quiz-header">
        <button
          className="compare-back-button"
          onClick={openPractice}
          type="button"
        >
          ← PRACTICE
        </button>

        <div>
          <span className="compare-eyebrow">NUMBER SENSE · QUIZ</span>
          <h1>Compare the Numbers</h1>
          <p>Choose the correct comparison symbol.</p>
        </div>
      </header>

      <section className="compare-quiz-card">
        <div className="compare-quiz-progress">
          <span>Question {questionNumber}</span>
          <span>Marks: {correctCount}</span>
        </div>

        <div className="compare-timer-display">
          <span>⏰</span>
          <span>Time Left: {formatTime(timeLeft)}</span>
        </div>

        <div className="compare-question">
          <span className="compare-number">{question.left}</span>
          <div
            className={`compare-symbol-display ${
              selectedSymbol ? "has-selection" : ""
            }`}
          >
            {selectedSymbol || "___"}
          </div>
          <span className="compare-number">{question.right}</span>
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
