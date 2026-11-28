
import { useEffect, useState } from "react";
import "./NumberBondsQuiz.css";

const LEVELS = [5, 10];
const TIMER_OPTIONS = [2, 5, 10, 15, 20];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = (items) => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remaining
  ).padStart(2, "0")}`;
};

// Generate a random Number Bonds question.
// Zero is included occasionally, not in every question.
const generateQuestion = (limit) => {
  let first;
  let second;

  const includeZero = Math.random() < 0.15;

  if (includeZero) {
    const total = randomInt(0, limit);

    if (Math.random() < 0.5) {
      first = 0;
      second = total;
    } else {
      first = total;
      second = 0;
    }
  } else {
    const total = randomInt(2, limit);
    first = randomInt(1, total - 1);
    second = total - first;
  }

  const blankPosition = Math.random() < 0.5 ? "first" : "second";
  const answer = blankPosition === "first" ? first : second;

  const options = new Set([answer]);

  while (options.size < 4) {
    options.add(randomInt(0, limit));
  }

  return {
    first,
    second,
    total: first + second,
    blankPosition,
    answer,
    options: shuffle([...options]),
  };
};

function NumberBondsQuiz({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(5);
  const [selectedDuration, setSelectedDuration] = useState(5);

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [question, setQuestion] = useState(() =>
    generateQuestion(5)
  );

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [history, setHistory] = useState([]);

  // Timer
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);

  // Automatically finish when time reaches zero.
  useEffect(() => {
    if (quizStarted && timeLeft === 0) {
      setQuizCompleted(true);
    }
  }, [quizStarted, timeLeft]);

  const startQuiz = () => {
    setQuestion(generateQuestion(selectedLevel));
    setSelectedAnswer(null);
    setQuestionNumber(1);
    setHistory([]);
    setTimeLeft(selectedDuration * 60);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  const backToSetup = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setQuestionNumber(1);
    setHistory([]);
    setTimeLeft(selectedDuration * 60);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || quizCompleted || timeLeft === 0) {
      return;
    }

    const record = {
      number: questionNumber,
      first: question.first,
      second: question.second,
      total: question.total,
      blankPosition: question.blankPosition,
      correctAnswer: question.answer,
      selectedAnswer,
      isCorrect: selectedAnswer === question.answer,
    };

    setHistory((previous) => [...previous, record]);

    setQuestion(generateQuestion(selectedLevel));
    setSelectedAnswer(null);
    setQuestionNumber((previous) => previous + 1);
  };

  const endTest = () => {
    setQuizCompleted(true);
  };

  const restartQuiz = () => {
    startQuiz();
  };

  // Include the current question in the analysis when the quiz ends.
  // If an option was selected but not submitted, record that selection.
  const resultHistory = quizCompleted
    ? [
        ...history,
        {
          number: questionNumber,
          first: question.first,
          second: question.second,
          total: question.total,
          blankPosition: question.blankPosition,
          correctAnswer: question.answer,
          selectedAnswer,
          isCorrect: selectedAnswer === question.answer,
        },
      ]
    : history;

  const correctCount = resultHistory.filter(
    (item) => item.selectedAnswer !== null && item.isCorrect
  ).length;

  const incorrectCount = resultHistory.filter(
    (item) => item.selectedAnswer !== null && !item.isCorrect
  ).length;

  const unansweredCount = resultHistory.filter(
    (item) => item.selectedAnswer === null
  ).length;

  const totalQuestions = resultHistory.length;

  const accuracy =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  const renderEquation = (item) => (
    <>
      {item.blankPosition === "first" ? "?" : item.first}
      {" + "}
      {item.blankPosition === "second" ? "?" : item.second}
      {" = "}
      {item.total}
    </>
  );

  // SETUP SCREEN
  if (!quizStarted && !quizCompleted) {
    return (
      <main className="nb-quiz-page">
        <button
          className="nbq-back-button"
          type="button"
          onClick={onBack}
        >
          ← BACK TO PRACTICE
        </button>

        <section className="nbq-setup-card">
          <div className="nbq-setup-icon">🔢</div>

          <span className="nbq-eyebrow">MENTAL MATH</span>

          <h1>Number Bonds Quiz</h1>

          <p className="nbq-description">
            Test your number bonds skills before the time runs out!
          </p>

          <div className="nbq-setting">
            <label htmlFor="nbq-level">
              Select Level
            </label>

            <select
              id="nbq-level"
              value={selectedLevel}
              onChange={(event) =>
                setSelectedLevel(Number(event.target.value))
              }
            >
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  Up to {level}
                </option>
              ))}
            </select>

            <p className="nbq-hint">
              All numbers and totals will be within {selectedLevel}.
            </p>
          </div>

          <div className="nbq-setting">
            <label>Select Time</label>

            <div className="nbq-timer-options">
              {TIMER_OPTIONS.map((duration) => (
                <button
                  key={duration}
                  type="button"
                  className={
                    selectedDuration === duration ? "active" : ""
                  }
                  onClick={() => setSelectedDuration(duration)}
                >
                  {duration}
                  <small>min</small>
                </button>
              ))}
            </div>
          </div>

          <button
            className="nbq-primary-button"
            type="button"
            onClick={startQuiz}
          >
            ▶ Start Quiz
          </button>
        </section>
      </main>
    );
  }

  // RESULT AND ANALYSIS SCREEN
  if (quizCompleted) {
    return (
      <main className="nb-quiz-page">
        <button
          className="nbq-back-button"
          type="button"
          onClick={onBack}
        >
          ← BACK TO PRACTICE
        </button>

        <section className="nbq-result-card">
          <div className="nbq-result-icon">🏆</div>

          <h1>Quiz Completed!</h1>

          <p className="nbq-description">
            Great effort! Here is your performance analysis.
          </p>

          <div className="nbq-score">
            <span>Your Score</span>
            <strong>
              {correctCount} / {totalQuestions}
            </strong>
            <span>{accuracy}% Accuracy</span>
          </div>

          <div className="nbq-result-stats">
            <div className="nbq-stat correct">
              <strong>{correctCount}</strong>
              <span>Correct</span>
            </div>

            <div className="nbq-stat incorrect">
              <strong>{incorrectCount}</strong>
              <span>Incorrect</span>
            </div>

            <div className="nbq-stat unanswered">
              <strong>{unansweredCount}</strong>
              <span>Unanswered</span>
            </div>
          </div>

          <h2 className="nbq-analysis-title">
            Question Analysis
          </h2>

          <div className="nbq-analysis-list">
            {resultHistory.map((item) => (
              <div
                className={`nbq-analysis-item ${
                  item.selectedAnswer === null
                    ? "not-answered"
                    : item.isCorrect
                    ? "answer-correct"
                    : "answer-incorrect"
                }`}
                key={item.number}
              >
                <div className="nbq-analysis-question">
                  <strong>Q{item.number}.</strong>
                  <span>{renderEquation(item)}</span>
                </div>

                <div className="nbq-analysis-answer">
                  Your answer:{" "}
                  <strong>
                    {item.selectedAnswer === null
                      ? "Not answered"
                      : item.selectedAnswer}
                  </strong>
                </div>

                <div className="nbq-analysis-answer">
                  Correct answer:{" "}
                  <strong>{item.correctAnswer}</strong>
                </div>

                <span className="nbq-analysis-status">
                  {item.selectedAnswer === null
                    ? "Not Answered"
                    : item.isCorrect
                    ? "✓ Correct"
                    : "✗ Incorrect"}
                </span>
              </div>
            ))}
          </div>

          <button
            className="nbq-primary-button"
            type="button"
            onClick={restartQuiz}
          >
            Play Again
          </button>

          <button
            className="nbq-secondary-button"
            type="button"
            onClick={onBack}
          >
            Back to Practice
          </button>
        </section>
      </main>
    );
  }

  // ACTIVE QUIZ SCREEN
  return (
    <main className="nb-quiz-page">
      <header className="nbq-quiz-header">
        <button
          className="nbq-back-button"
          type="button"
          onClick={endTest}
        >
          End Test
        </button>

        <div>
          <span className="nbq-eyebrow">NUMBER BONDS QUIZ</span>
          <h1>Find the Missing Number!</h1>
          <p>Choose the correct answer.</p>
        </div>
      </header>

      <section className="nbq-quiz-card">
        <div className="nbq-quiz-info">
          <span>Question {questionNumber}</span>
          <span>Correct: {correctCount}</span>
          <span>Up to {selectedLevel}</span>
        </div>

        <div className="nbq-timer-display">
          ⏰ Time Left: {formatTime(timeLeft)}
        </div>

        <div className="nbq-question">
          <span className={question.blankPosition === "first" ? "nbq-question-mark" : ""}>
            {question.blankPosition === "first" ? "?" : question.first}
          </span>

          <span className="nbq-plus">+</span>

          <span className={question.blankPosition === "second" ? "nbq-question-mark" : ""}>
            {question.blankPosition === "second" ? "?" : question.second}
          </span>

          <span className="nbq-equals">=</span>
          <span>{question.total}</span>
        </div>

        <p className="nbq-instruction">
          Select the correct answer.
        </p>

        <div className="nbq-answer-options">
          {question.options.map((option, index) => (
            <button
              type="button"
              key={option}
              className={
                selectedAnswer === option ? "selected" : ""
              }
              onClick={() => setSelectedAnswer(option)}
              aria-pressed={selectedAnswer === option}
            >
              <span>{String.fromCharCode(65 + index)}</span>
              {option}
            </button>
          ))}
        </div>

        <button
          className="nbq-primary-button"
          type="button"
          onClick={submitAnswer}
          disabled={selectedAnswer === null || timeLeft === 0}
        >
          ➡ Next
        </button>

        <button
          className="nbq-end-button"
          type="button"
          onClick={endTest}
        >
          ⛔ End Test
        </button>
      </section>
    </main>
  );
}

export default NumberBondsQuiz;
