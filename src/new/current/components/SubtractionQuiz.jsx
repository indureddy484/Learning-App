
import { useEffect, useState } from "react";
import SubtractionPracticeWorksheet from "./SubtractionPracticeWorksheet";
import "./AdditionQuiz.css";
import "./SubtractionQuiz.css";

const RANGES = [10, 20, 30, 50, 100];
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

// Generate subtraction questions with non-negative answers.
// The answer is always strictly below the selected limit.
const generateQuestion = (limit) => {
  const first = randomInt(1, limit - 1);
  const second = randomInt(0, first);
  const answer = first - second;

  const options = new Set([answer]);

  while (options.size < 4) {
    options.add(randomInt(0, limit - 1));
  }

  return {
    first,
    second,
    answer,
    options: shuffle([...options]),
  };
};

function SubtractionQuiz({ onBack }) {
  const [selectedRange, setSelectedRange] = useState(10);
  const [selectedDuration, setSelectedDuration] = useState(5);

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showWorksheet, setShowWorksheet] = useState(false);

  const [timeLeft, setTimeLeft] = useState(5 * 60);

  const [question, setQuestion] = useState(() =>
    generateQuestion(10)
  );

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [history, setHistory] = useState([]);

  // TIMER
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);

  // AUTOMATICALLY FINISH WHEN TIME REACHES ZERO
  useEffect(() => {
    if (quizStarted && timeLeft === 0) {
      setQuizCompleted(true);
    }
  }, [quizStarted, timeLeft]);

  // START QUIZ
  const startQuiz = () => {
    setQuestion(generateQuestion(selectedRange));
    setSelectedAnswer(null);
    setQuestionNumber(1);
    setHistory([]);
    setTimeLeft(selectedDuration * 60);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  // SUBMIT ANSWER
  const submitAnswer = () => {
    if (
      selectedAnswer === null ||
      quizCompleted ||
      timeLeft === 0
    ) {
      return;
    }

    const record = {
      number: questionNumber,
      first: question.first,
      second: question.second,
      correctAnswer: question.answer,
      selectedAnswer,
      isCorrect: selectedAnswer === question.answer,
    };

    setHistory((previous) => [...previous, record]);
    setQuestion(generateQuestion(selectedRange));
    setSelectedAnswer(null);
    setQuestionNumber((previous) => previous + 1);
  };

  // END TEST
  const endTest = () => {
    setQuizCompleted(true);
  };

  // RESTART QUIZ
  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setQuestionNumber(1);
    setHistory([]);
    setTimeLeft(selectedDuration * 60);
    setQuestion(generateQuestion(selectedRange));
  };

  // RESULT HISTORY INCLUDING CURRENT UNANSWERED QUESTION
  const resultHistory = quizCompleted
    ? [
        ...history,
        {
          number: questionNumber,
          first: question.first,
          second: question.second,
          correctAnswer: question.answer,
          selectedAnswer: null,
          isCorrect: false,
        },
      ]
    : history;

  const correctCount = history.filter(
    (item) => item.isCorrect
  ).length;

  const incorrectCount = history.filter(
    (item) => !item.isCorrect
  ).length;

  const unansweredCount = quizCompleted ? 1 : 0;
  const totalQuestions = resultHistory.length;

  const accuracy =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  // =========================================
  // SETUP SCREEN
  // =========================================

  if (!quizStarted) {
    return (
      <main className="addition-page subtraction-page">
        <button
          className="addition-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <section className="addition-setup-card">
          <div className="addition-setup-icon">➖</div>

          <span className="addition-eyebrow">
            NUMBER SENSE
          </span>

          <h1>Subtraction Quiz</h1>

          <p className="addition-description">
            Practise subtraction and find the correct answer!
          </p>

          <div className="addition-setting">
            <label htmlFor="subtraction-range">
              Select Number Range
            </label>

            <select
              id="subtraction-range"
              value={selectedRange}
              onChange={(event) =>
                setSelectedRange(Number(event.target.value))
              }
            >
              {RANGES.map((range) => (
                <option key={range} value={range}>
                  &lt;{range}
                </option>
              ))}
            </select>

            <p className="addition-hint">
              Answers must be non-negative and less than{" "}
              {selectedRange}.
            </p>
          </div>

          <div className="addition-setting">
            <label>Select Time</label>

            <div className="addition-timer-options">
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
            className="addition-primary-button"
            onClick={startQuiz}
            type="button"
          >
            ▶ Start Quiz
          </button>

          <button
            className="addition-worksheet-button"
            onClick={() => setShowWorksheet(true)}
            type="button"
          >
            🖨️ Practice Worksheet
          </button>
        </section>

        {showWorksheet && (
          <SubtractionPracticeWorksheet
            maxNumber={selectedRange}
            onClose={() => setShowWorksheet(false)}
          />
        )}
      </main>
    );
  }

  // =========================================
  // RESULT AND ANALYSIS SCREEN
  // =========================================

  if (quizCompleted) {
    return (
      <main className="addition-page subtraction-page">
        <button
          className="addition-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <section className="addition-result-card">
          <div className="addition-result-icon">🏆</div>

          <h1>Quiz Completed!</h1>

          <p className="addition-description">
            Great effort! Here is your performance analysis.
          </p>

          <div className="addition-score">
            <span>Your Score</span>

            <strong>
              {correctCount} / {totalQuestions}
            </strong>

            <span>{accuracy}% Accuracy</span>
          </div>

          <div className="addition-result-stats">
            <div className="addition-stat correct">
              <strong>{correctCount}</strong>
              <span>Correct</span>
            </div>

            <div className="addition-stat incorrect">
              <strong>{incorrectCount}</strong>
              <span>Incorrect</span>
            </div>

            <div className="addition-stat unanswered">
              <strong>{unansweredCount}</strong>
              <span>Unanswered</span>
            </div>
          </div>

          <h2 className="addition-analysis-title">
            Question Analysis
          </h2>

          <div className="addition-analysis-list">
            {resultHistory.map((item) => (
              <div
                className={`addition-analysis-item ${
                  item.selectedAnswer === null
                    ? "not-answered"
                    : item.isCorrect
                    ? "answer-correct"
                    : "answer-incorrect"
                }`}
                key={item.number}
              >
                <div className="addition-analysis-question">
                  <strong>Q{item.number}.</strong>

                  <span>
                    {item.first} − {item.second} = ?
                  </span>
                </div>

                <div className="addition-analysis-answer">
                  Your answer:{" "}
                  <strong>
                    {item.selectedAnswer === null
                      ? "Not answered"
                      : item.selectedAnswer}
                  </strong>
                </div>

                <div className="addition-analysis-answer">
                  Correct answer:{" "}
                  <strong>{item.correctAnswer}</strong>
                </div>

                <span className="addition-analysis-status">
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
            className="addition-primary-button"
            onClick={restartQuiz}
            type="button"
          >
            Play Again
          </button>

          <button
            className="addition-secondary-button"
            onClick={onBack}
            type="button"
          >
            Back to Number Sense Menu
          </button>
        </section>
      </main>
    );
  }

  // =========================================
  // ACTIVE QUIZ SCREEN
  // =========================================

  return (
    <main className="addition-page subtraction-page">
      <header className="addition-quiz-header">
        <div className="addition-quiz-navigation">
          <button
            className="addition-active-back-button"
            onClick={onBack}
            type="button"
          >
            ← BACK
          </button>

          <button
            className="addition-active-end-button"
            onClick={endTest}
            type="button"
          >
            End Test
          </button>
        </div>

        <div className="addition-quiz-heading">
          <span className="addition-eyebrow">
            SUBTRACTION QUIZ
          </span>

          <h1>Let's Subtract!</h1>

          <p>Choose the correct answer.</p>
        </div>
      </header>

      <section className="addition-quiz-card">
        <div className="addition-quiz-info">
          <span>Question {questionNumber}</span>
          <span>Correct: {correctCount}</span>
          <span>Range: &lt;{selectedRange}</span>
        </div>

        <div className="addition-timer-display">
          ⏰ Time Left: {formatTime(timeLeft)}
        </div>

        <div className="addition-question">
          <span>{question.first}</span>
          <span className="subtraction-minus">−</span>
          <span>{question.second}</span>
          <span className="addition-equals">=</span>
          <span className="addition-question-mark">?</span>
        </div>

        <p className="addition-instruction">
          Select the correct answer.
        </p>

        <div className="addition-answer-options">
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
          className="addition-primary-button"
          onClick={submitAnswer}
          disabled={selectedAnswer === null || timeLeft === 0}
          type="button"
        >
          ➡ Next
        </button>
      </section>
    </main>
  );
}

export default SubtractionQuiz;
