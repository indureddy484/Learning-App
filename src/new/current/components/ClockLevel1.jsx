
import { useEffect, useRef, useState } from "react";
import ClockLevel1Practice from "./ClockLevel1Practice";
import "./ClockLevel1.css";

const TIMER_OPTIONS = [1, 2, 5, 10, 20];

function formatTime(hour, minute) {
  return `${hour}:${String(minute).padStart(2, "0")}`;
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remaining
  ).padStart(2, "0")}`;
}

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function createQuestion(seenTimes) {
  const allTimes = [];

  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      allTimes.push({ hour, minute });
    }
  }

  if (seenTimes.size >= allTimes.length) {
    seenTimes.clear();
  }

  const availableTimes = allTimes.filter(
    ({ hour, minute }) =>
      !seenTimes.has(formatTime(hour, minute))
  );

  const selectedTime =
    availableTimes[
      Math.floor(Math.random() * availableTimes.length)
    ];

  const { hour, minute } = selectedTime;
  const correctAnswer = formatTime(hour, minute);

  seenTimes.add(correctAnswer);

  const wrongOptions = new Set();

  while (wrongOptions.size < 3) {
    const wrongHour = Math.floor(Math.random() * 12) + 1;
    const wrongMinute = Math.floor(Math.random() * 12) * 5;
    const wrongAnswer = formatTime(wrongHour, wrongMinute);

    if (wrongAnswer !== correctAnswer) {
      wrongOptions.add(wrongAnswer);
    }
  }

  return {
    hour,
    minute,
    correctAnswer,
    options: shuffleArray([correctAnswer, ...wrongOptions]),
  };
}

// Analogue Clock
function AnalogClock({ hour, minute }) {
  const center = 150;
  const radius = 124;

  const minuteAngle = minute * 6;
  const hourAngle = (hour % 12) * 30 + minute * 0.5;

  const getPoint = (angle, length) => {
    const radians = (angle * Math.PI) / 180;

    return {
      x: center + length * Math.sin(radians),
      y: center - length * Math.cos(radians),
    };
  };

  const minuteEnd = getPoint(minuteAngle, 91);
  const hourEnd = getPoint(hourAngle, 65);

  return (
    <svg
      className="clock-face"
      viewBox="0 0 300 300"
      role="img"
      aria-label="Analogue clock showing a time to read"
    >
      <circle
        cx={center}
        cy={center}
        r="139"
        className="clock-outer-ring"
      />

      <circle
        cx={center}
        cy={center}
        r={radius}
        className="clock-inner-face"
      />

      {Array.from({ length: 60 }, (_, index) => {
        const angle = index * 6;
        const isMajor = index % 5 === 0;

        const start = getPoint(angle, isMajor ? 112 : 117);
        const end = getPoint(angle, isMajor ? 122 : 121);

        return (
          <line
            key={index}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            className={
              isMajor ? "clock-major-tick" : "clock-minor-tick"
            }
          />
        );
      })}

      {Array.from({ length: 12 }, (_, index) => {
        const number = index + 1;
        const point = getPoint(number * 30, 91);

        return (
          <text
            key={number}
            x={point.x}
            y={point.y}
            className="clock-number"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {number}
          </text>
        );
      })}

      <line
        x1={center}
        y1={center}
        x2={hourEnd.x}
        y2={hourEnd.y}
        className="clock-hour-hand"
      />

      <line
        x1={center}
        y1={center}
        x2={minuteEnd.x}
        y2={minuteEnd.y}
        className="clock-minute-hand"
      />

      <circle
        cx={center}
        cy={center}
        r="6"
        className="clock-center-pin"
      />
    </svg>
  );
}

function ClockLevel1({ onBack }) {
  const seenTimesRef = useRef(new Set());
  const nextQuestionTimer = useRef(null);

  const [question, setQuestion] = useState(() =>
    createQuestion(seenTimesRef.current)
  );

  const [mode, setMode] = useState("practice");

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  // Printable worksheet modal
  const [showPracticeWorksheet, setShowPracticeWorksheet] =
    useState(false);

  // Quiz states
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [quizHistory, setQuizHistory] = useState([]);
  const [resultHistory, setResultHistory] = useState([]);

  const clearPendingQuestionTimer = () => {
    if (nextQuestionTimer.current) {
      clearTimeout(nextQuestionTimer.current);
      nextQuestionTimer.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearPendingQuestionTimer();
    };
  }, []);

  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);

    audio.play().catch((error) => {
      console.warn("Unable to play answer sound:", error);
    });
  };

  const loadNextQuestion = () => {
    setQuestion(createQuestion(seenTimesRef.current));
    setSelectedAnswer("");
    setIsAnswered(false);
    setIsProcessing(false);
    setFeedback("");
  };

  // INTERACTIVE PRACTICE MODE
  const handlePracticeAnswer = (option) => {
    if (isAnswered || isProcessing) return;

    const correct = option === question.correctAnswer;

    setSelectedAnswer(option);
    setIsProcessing(true);

    if (correct) {
      setIsAnswered(true);
      setFeedback("Very Good! Excellent! 🎉");
      setScore((previous) => previous + 1);

      playSound("/sounds/very-good.mp3");

      nextQuestionTimer.current = setTimeout(() => {
        loadNextQuestion();
        nextQuestionTimer.current = null;
      }, 1400);
    } else {
      setFeedback("Oops! Try Again! 😊");

      playSound("/sounds/try-again.mp3");

      nextQuestionTimer.current = setTimeout(() => {
        setSelectedAnswer("");
        setFeedback("");
        setIsProcessing(false);
        nextQuestionTimer.current = null;
      }, 1000);
    }
  };

  // Return to interactive practice mode
  const openPractice = () => {
    clearPendingQuestionTimer();

    setMode("practice");
    setSelectedAnswer("");
    setIsAnswered(false);
    setIsProcessing(false);
    setFeedback("");
    setScore(0);
  };

  // Open quiz setup
  const openQuizSetup = () => {
    clearPendingQuestionTimer();

    setMode("setup");
    setSelectedAnswer("");
    setIsAnswered(false);
    setIsProcessing(false);
    setFeedback("");
  };

  // Start timed quiz
  const startQuiz = () => {
    clearPendingQuestionTimer();

    setQuestion(createQuestion(seenTimesRef.current));
    setSelectedAnswer("");
    setIsAnswered(false);
    setIsProcessing(false);
    setFeedback("");

    setQuestionNumber(1);
    setQuizHistory([]);
    setResultHistory([]);

    setTimeLeft(selectedDuration * 60);
    setMode("quiz");
  };

  // Finish quiz and prepare analysis
  const finishQuiz = () => {
    if (mode !== "quiz") return;

    clearPendingQuestionTimer();

    const currentRecord = {
      number: questionNumber,
      hour: question.hour,
      minute: question.minute,
      correctAnswer: question.correctAnswer,
      selectedAnswer: selectedAnswer || null,
      isCorrect: selectedAnswer === question.correctAnswer,
    };

    setResultHistory([...quizHistory, currentRecord]);
    setMode("analysis");
  };

  // Quiz timer
  useEffect(() => {
    if (mode !== "quiz") return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode]);

  // Automatically finish when timer reaches zero
  useEffect(() => {
    if (mode === "quiz" && timeLeft === 0) {
      finishQuiz();
    }
  }, [timeLeft, mode]);

  // Quiz answer selection
  const handleQuizAnswer = (option) => {
    if (selectedAnswer || mode !== "quiz") return;
    setSelectedAnswer(option);
  };

  // Submit answer and move to next question
  const submitQuizAnswer = () => {
    if (!selectedAnswer || mode !== "quiz") return;

    const record = {
      number: questionNumber,
      hour: question.hour,
      minute: question.minute,
      correctAnswer: question.correctAnswer,
      selectedAnswer,
      isCorrect: selectedAnswer === question.correctAnswer,
    };

    setQuizHistory((previous) => [...previous, record]);

    playSound(
      record.isCorrect
        ? "/sounds/very-good.mp3"
        : "/sounds/try-again.mp3"
    );

    setQuestion(createQuestion(seenTimesRef.current));
    setSelectedAnswer("");
    setQuestionNumber((previous) => previous + 1);
  };

  // Quiz analysis
  const correctCount = resultHistory.filter(
    (item) => item.isCorrect
  ).length;

  const incorrectCount = resultHistory.filter(
    (item) =>
      item.selectedAnswer !== null && !item.isCorrect
  ).length;

  const unansweredCount = resultHistory.filter(
    (item) => item.selectedAnswer === null
  ).length;

  const totalQuestions = resultHistory.length;

  const accuracy =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  const backToPractice = () => {
    clearPendingQuestionTimer();
    openPractice();
  };

  // QUIZ SETUP SCREEN
  if (mode === "setup") {
    return (
      <div className="clock-level-page">
        <button
          className="clock-back-button"
          onClick={backToPractice}
          type="button"
        >
          ← BACK
        </button>

        <main className="clock-level-content">
          <section className="clock-setup-card">
            <div className="clock-setup-icon">🕒</div>

            <p className="clock-level-eyebrow">NUMBER SENSE</p>

            <h1>Clock Level 1 Quiz</h1>

            <p className="clock-level-subtitle">
              Choose your test duration and get ready!
            </p>

            <div className="clock-setup-setting">
              <label htmlFor="clock-duration">
                Select Quiz Duration
              </label>

              <select
                id="clock-duration"
                value={selectedDuration}
                onChange={(event) =>
                  setSelectedDuration(Number(event.target.value))
                }
              >
                {TIMER_OPTIONS.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} {duration === 1 ? "minute" : "minutes"}
                  </option>
                ))}
              </select>
            </div>

            <div className="clock-setup-note">
              <span>⏱️</span>
              <p>
                Your timer will start as soon as you click Start
                Quiz. Answer as many questions as you can before
                time runs out.
              </p>
            </div>

            <button
              className="clock-start-button"
              onClick={startQuiz}
              type="button"
            >
              ▶ Start Quiz
            </button>

            <button
              className="clock-practice-secondary"
              onClick={backToPractice}
              type="button"
            >
              Back to Practice
            </button>
          </section>
        </main>
      </div>
    );
  }

  // QUIZ RESULT AND ANALYSIS SCREEN
  if (mode === "analysis") {
    return (
      <div className="clock-level-page">
        <button
          className="clock-back-button"
          onClick={backToPractice}
          type="button"
        >
          ← BACK
        </button>

        <main className="clock-level-content">
          <section className="clock-result-card">
            <div className="clock-result-icon">🏆</div>

            <p className="clock-level-eyebrow">NUMBER SENSE</p>

            <h1>Quiz Completed!</h1>

            <p className="clock-level-subtitle">
              Great effort! Here is your performance analysis.
            </p>

            <div className="clock-result-score">
              <span>Your Score</span>
              <strong>
                {correctCount} / {totalQuestions}
              </strong>
              <span>{accuracy}% Accuracy</span>
            </div>

            <div className="clock-result-stats">
              <div className="clock-stat correct">
                <strong>{correctCount}</strong>
                <span>Correct</span>
              </div>

              <div className="clock-stat incorrect">
                <strong>{incorrectCount}</strong>
                <span>Incorrect</span>
              </div>

              <div className="clock-stat unanswered">
                <strong>{unansweredCount}</strong>
                <span>Unanswered</span>
              </div>
            </div>

            <h2 className="clock-analysis-title">
              Question Analysis
            </h2>

            <div className="clock-analysis-list">
              {resultHistory.map((item) => (
                <div
                  className={`clock-analysis-item ${
                    item.selectedAnswer === null
                      ? "not-answered"
                      : item.isCorrect
                      ? "answer-correct"
                      : "answer-incorrect"
                  }`}
                  key={item.number}
                >
                  <div className="clock-analysis-question">
                    <strong>Q{item.number}.</strong>
                    <span>
                      What time is shown on the clock?
                    </span>
                  </div>

                  <div className="clock-analysis-answer">
                    Your answer:{" "}
                    <strong>
                      {item.selectedAnswer === null
                        ? "Not answered"
                        : item.selectedAnswer}
                    </strong>
                  </div>

                  <div className="clock-analysis-answer">
                    Correct answer:{" "}
                    <strong>{item.correctAnswer}</strong>
                  </div>

                  <span className="clock-analysis-status">
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
              className="clock-start-button"
              onClick={startQuiz}
              type="button"
            >
              Play Again
            </button>

            <button
              className="clock-practice-secondary"
              onClick={backToPractice}
              type="button"
            >
              Back to Practice
            </button>
          </section>
        </main>
      </div>
    );
  }

  // INTERACTIVE PRACTICE OR ACTIVE QUIZ SCREEN
  return (
    <div className="clock-level-page">
      <div className="clock-page-topbar">
        <button
          className="clock-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <div className="clock-mode-buttons">
          <button
            className={`clock-mode-button ${
              mode === "quiz" ? "active" : ""
            }`}
            onClick={openQuizSetup}
            type="button"
          >
            📝 Quiz
          </button>

          <button
            className="clock-mode-button"
            onClick={() => setShowPracticeWorksheet(true)}
            type="button"
          >
            🖨️ Practice Worksheet
          </button>
        </div>
      </div>

      <main className="clock-level-content">
        <header className="clock-level-header">
          <div>
            <p className="clock-level-eyebrow">NUMBER SENSE</p>

            <h1>Clock - Level 1</h1>

            <p className="clock-level-subtitle">
              Look at the clock and choose the correct time.
            </p>
          </div>

          <div className="clock-level-badge">
            🕒 Level 1
          </div>
        </header>

        <section className="clock-question-card">
          <div className="clock-question-top-info">
            {mode === "quiz" ? (
              <>
                <span>Question {questionNumber}</span>
                <span className="clock-timer-display">
                  ⏰ {formatTimer(timeLeft)}
                </span>
              </>
            ) : (
              <>
                <span>Practice Mode</span>
                <span>No timer</span>
              </>
            )}
          </div>

          <h2>What time is shown on the clock?</h2>

          <p className="clock-question-hint">
            Look carefully at the hour hand and minute hand.
          </p>

          <div className="clock-visual-wrap">
            <AnalogClock
              hour={question.hour}
              minute={question.minute}
            />
          </div>

          <div className="clock-options-heading">
            Choose the correct answer
          </div>

          <div className="clock-options-grid">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption =
                option === question.correctAnswer;

              let optionClass = "clock-option";

              if (isSelected) {
                optionClass += " selected";
              }

              if (mode === "practice") {
                if (isAnswered && isCorrectOption) {
                  optionClass += " correct";
                }

                if (
                  isProcessing &&
                  isSelected &&
                  !isCorrectOption
                ) {
                  optionClass += " incorrect";
                }
              }

              return (
                <button
                  key={option}
                  type="button"
                  className={optionClass}
                  onClick={() =>
                    mode === "practice"
                      ? handlePracticeAnswer(option)
                      : handleQuizAnswer(option)
                  }
                  disabled={
                    mode === "practice"
                      ? isAnswered || isProcessing
                      : Boolean(selectedAnswer) || timeLeft === 0
                  }
                >
                  {option}
                </button>
              );
            })}
          </div>

          {mode === "practice" && feedback && (
            <div
              className={`clock-feedback ${
                selectedAnswer === question.correctAnswer
                  ? "feedback-correct"
                  : "feedback-incorrect"
              }`}
              role="status"
              aria-live="polite"
            >
              {feedback}
            </div>
          )}

          {mode === "practice" ? (
            <div className="clock-practice-actions">
              <div className="clock-live-score">
                ⭐ Correct answers: {score}
              </div>
            </div>
          ) : (
            <div className="clock-quiz-actions">
              <button
                className="clock-next-button"
                onClick={submitQuizAnswer}
                disabled={!selectedAnswer || timeLeft === 0}
                type="button"
              >
                ➡ Next
              </button>

              <button
                className="clock-end-test-button"
                onClick={finishQuiz}
                type="button"
              >
                ⛔ End Test
              </button>
            </div>
          )}
        </section>
      </main>

      {showPracticeWorksheet && (
        <ClockLevel1Practice
          onClose={() => setShowPracticeWorksheet(false)}
        />
      )}
    </div>
  );
}

export default ClockLevel1;
