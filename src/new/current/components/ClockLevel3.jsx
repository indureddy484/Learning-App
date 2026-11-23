
import { useEffect, useRef, useState } from "react";
import "./ClockLevel3.css";
import ClockLevel3Practice from "./ClockLevel3Practice";

const TIMER_OPTIONS = [1, 2, 5, 10, 20];

function formatTime(hour, minute) {
  return `${hour}:${String(minute).padStart(2, "0")}`;
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
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

// Generate all 720 possible times without repetition.
function createQuestion(seenTimes) {
  const allTimes = [];

  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute++) {
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
    const wrongMinute = Math.floor(Math.random() * 60);

    const wrongAnswer = formatTime(wrongHour, wrongMinute);

    if (wrongAnswer !== correctAnswer) {
      wrongOptions.add(wrongAnswer);
    }
  }

  const options = shuffleArray([
    correctAnswer,
    ...wrongOptions,
  ]);

  return {
    hour,
    minute,
    correctAnswer,
    options,
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
      aria-label="Analogue clock"
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

      {/* All 60 minute markings */}
      {Array.from({ length: 60 }, (_, index) => {
        const angle = index * 6;
        const isMajor = index % 5 === 0;

        const start = getPoint(
          angle,
          isMajor ? 112 : 117
        );

        const end = getPoint(
          angle,
          isMajor ? 122 : 121
        );

        return (
          <line
            key={index}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            className={
              isMajor
                ? "clock-major-tick"
                : "clock-minor-tick"
            }
          />
        );
      })}

      {/* Numbers 1 to 12 */}
      {Array.from({ length: 12 }, (_, index) => {
        const number = index + 1;
        const angle = number * 30;
        const point = getPoint(angle, 91);

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

      {/* Hour hand */}
      <line
        x1={center}
        y1={center}
        x2={hourEnd.x}
        y2={hourEnd.y}
        className="clock-hour-hand"
      />

      {/* Minute hand */}
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

function ClockLevel3({ onBack }) {
  const seenTimesRef = useRef(new Set());
  const nextQuestionTimer = useRef(null);
  const pendingQuizRecordRef = useRef(null);

  const [question, setQuestion] = useState(() =>
    createQuestion(seenTimesRef.current)
  );

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  // Quiz states
  const [mode, setMode] = useState("practice");
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [quizHistory, setQuizHistory] = useState([]);
  const [resultHistory, setResultHistory] = useState([]);
  const [isQuizProcessing, setIsQuizProcessing] = useState(false);

  // Practice worksheet modal
  const [showWorksheet, setShowWorksheet] = useState(false);

  // Clear timers when the component is closed.
  useEffect(() => {
    return () => {
      if (nextQuestionTimer.current) {
        clearTimeout(nextQuestionTimer.current);
      }
    };
  }, []);

  // Play answer sounds in practice mode only.
  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);

    audio.play().catch((error) => {
      console.warn("Unable to play answer sound:", error);
    });
  };

  // Reset the current question.
  const resetQuestion = () => {
    setSelectedAnswer("");
    setIsAnswered(false);
    setIsProcessing(false);
    setFeedback("");
  };

  // PRACTICE MODE: Check selected answer.
  const handleAnswer = (option) => {
    if (
      mode !== "practice" ||
      isAnswered ||
      isProcessing
    ) {
      return;
    }

    const correct = option === question.correctAnswer;

    setSelectedAnswer(option);
    setIsProcessing(true);

    if (correct) {
      setIsAnswered(true);
      setFeedback("Very Good! Excellent! 🎉");

      setScore((previousScore) => previousScore + 1);

      playSound("/sounds/very-good.mp3");

      nextQuestionTimer.current = setTimeout(() => {
        setQuestion(createQuestion(seenTimesRef.current));
        resetQuestion();
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

  // Open practice mode.
  const openPractice = () => {
    if (nextQuestionTimer.current) {
      clearTimeout(nextQuestionTimer.current);
      nextQuestionTimer.current = null;
    }

    pendingQuizRecordRef.current = null;
    setMode("practice");
    setScore(0);
    setQuestion(createQuestion(seenTimesRef.current));
    resetQuestion();
    setIsQuizProcessing(false);
  };

  // Open quiz setup.
  const openQuizSetup = () => {
    if (nextQuestionTimer.current) {
      clearTimeout(nextQuestionTimer.current);
      nextQuestionTimer.current = null;
    }

    pendingQuizRecordRef.current = null;
    setMode("setup");
    setIsQuizProcessing(false);
    resetQuestion();
  };

  // Start quiz.
  const startQuiz = () => {
    if (nextQuestionTimer.current) {
      clearTimeout(nextQuestionTimer.current);
      nextQuestionTimer.current = null;
    }

    pendingQuizRecordRef.current = null;

    setQuestion(createQuestion(seenTimesRef.current));
    resetQuestion();

    setQuestionNumber(1);
    setQuizHistory([]);
    setResultHistory([]);
    setTimeLeft(selectedDuration * 60);
    setIsQuizProcessing(false);
    setMode("quiz");
  };

  // Create a record for the current quiz question.
  const createCurrentRecord = () => {
    const isSelected = Boolean(selectedAnswer);

    return {
      number: questionNumber,
      targetTime: question.correctAnswer,
      studentAnswer: isSelected ? selectedAnswer : null,
      isAnswered: isSelected,
      isCorrect:
        isSelected &&
        selectedAnswer === question.correctAnswer,
    };
  };

  // Move to the next quiz question.
  const advanceQuizQuestion = (record) => {
    setQuizHistory((previousHistory) => [
      ...previousHistory,
      record,
    ]);

    pendingQuizRecordRef.current = null;

    setQuestion(createQuestion(seenTimesRef.current));
    resetQuestion();

    setQuestionNumber((previousNumber) => previousNumber + 1);
    setIsQuizProcessing(false);
    nextQuestionTimer.current = null;
  };

  // Save the answer and move to the next question.
  const nextQuizQuestion = () => {
    if (
      mode !== "quiz" ||
      isQuizProcessing ||
      timeLeft <= 0
    ) {
      return;
    }

    const record = createCurrentRecord();

    setIsQuizProcessing(true);
    pendingQuizRecordRef.current = record;

    nextQuestionTimer.current = setTimeout(() => {
      advanceQuizQuestion(record);
    }, 400);
  };

  // End quiz and show analysis.
  const finishQuiz = () => {
    if (mode !== "quiz") return;

    if (nextQuestionTimer.current) {
      clearTimeout(nextQuestionTimer.current);
      nextQuestionTimer.current = null;
    }

    const currentRecord = pendingQuizRecordRef.current
      ? pendingQuizRecordRef.current
      : createCurrentRecord();

    pendingQuizRecordRef.current = null;

    setResultHistory([
      ...quizHistory,
      currentRecord,
    ]);

    setIsQuizProcessing(false);
    setMode("analysis");
  };

  // Quiz countdown timer.
  useEffect(() => {
    if (mode !== "quiz") return;

    const timer = setInterval(() => {
      setTimeLeft((previousTime) =>
        Math.max(previousTime - 1, 0)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [mode]);

  // Automatically finish when time runs out.
  useEffect(() => {
    if (mode === "quiz" && timeLeft === 0) {
      finishQuiz();
    }
  }, [timeLeft, mode]);

  // Calculate results.
  const correctCount = resultHistory.filter(
    (item) => item.isCorrect
  ).length;

  const incorrectCount = resultHistory.filter(
    (item) => item.isAnswered && !item.isCorrect
  ).length;

  const unansweredCount = resultHistory.filter(
    (item) => !item.isAnswered
  ).length;

  const accuracy =
    resultHistory.length > 0
      ? Math.round(
          (correctCount / resultHistory.length) * 100
        )
      : 0;

  return (
    <div className="clock-level-page">
      {/* QUIZ SETUP */}
      {mode === "setup" && (
        <>
          <button
            className="clock-back-button"
            onClick={openPractice}
            type="button"
          >
            ← BACK
          </button>

          <main className="clock-level-content">
            <header className="clock-level-header">
              <div>
                <p className="clock-level-eyebrow">
                  NUMBER SENSE
                </p>

                <h1>Clock - Level 3 Quiz</h1>

                <p className="clock-level-subtitle">
                  Identify the time shown on each analogue clock.
                </p>
              </div>

              <div className="clock-level-badge">
                🕒 Level 3
              </div>
            </header>

            <section className="clock-setup-card">
              <h2>Quiz Settings</h2>

              <p>Select your quiz duration.</p>

              <div className="clock-duration-options">
                {TIMER_OPTIONS.map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    className={`clock-duration-button ${
                      selectedDuration === duration
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedDuration(duration)
                    }
                  >
                    {duration} {duration === 1 ? "Minute" : "Minutes"}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="clock-start-button"
                onClick={startQuiz}
              >
                Start Quiz
              </button>
            </section>
          </main>
        </>
      )}

      {/* QUIZ ANALYSIS */}
      {mode === "analysis" && (
        <>
          <button
            className="clock-back-button"
            onClick={openPractice}
            type="button"
          >
            ← BACK
          </button>

          <main className="clock-level-content">
            <header className="clock-level-header">
              <div>
                <p className="clock-level-eyebrow">
                  NUMBER SENSE
                </p>

                <h1>Quiz Results</h1>

                <p className="clock-level-subtitle">
                  Here is your quiz performance.
                </p>
              </div>

              <div className="clock-level-badge">
                🕒 Level 3
              </div>
            </header>

            <section className="clock-result-card">
              <h2>Quiz Summary</h2>

              <div className="clock-result-stats">
                <div>
                  <span>⭐</span>
                  <strong>{correctCount}</strong>
                  <p>Correct</p>
                </div>

                <div>
                  <span>❌</span>
                  <strong>{incorrectCount}</strong>
                  <p>Incorrect</p>
                </div>

                <div>
                  <span>⏳</span>
                  <strong>{unansweredCount}</strong>
                  <p>Unanswered</p>
                </div>

                <div>
                  <span>🎯</span>
                  <strong>{accuracy}%</strong>
                  <p>Accuracy</p>
                </div>
              </div>

              <h2 className="clock-analysis-heading">
                Question Analysis
              </h2>

              <div className="clock-analysis-list">
                {resultHistory.map((item) => (
                  <div
                    className="clock-analysis-item"
                    key={item.number}
                  >
                    <div className="clock-analysis-question">
                      <strong>
                        Question {item.number}
                      </strong>

                      <span>
                        Clock time: {item.targetTime}
                      </span>

                      <span>
                        Your answer:{" "}
                        {item.studentAnswer || "Not Answered"}
                      </span>
                    </div>

                    <div className="clock-analysis-status">
                      {!item.isAnswered ? (
                        <span className="analysis-unanswered">
                          Not Answered
                        </span>
                      ) : item.isCorrect ? (
                        <span className="analysis-correct">
                          ✓ Correct
                        </span>
                      ) : (
                        <span className="analysis-incorrect">
                          ✗ Incorrect
                        </span>
                      )}
                    </div>

                    {item.isAnswered && !item.isCorrect && (
                      <p className="clock-analysis-correct-answer">
                        Correct answer: {item.targetTime}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="clock-result-actions">
                <button
                  type="button"
                  className="clock-start-button"
                  onClick={startQuiz}
                >
                  Play Again
                </button>

                <button
                  type="button"
                  className="clock-practice-secondary"
                  onClick={openPractice}
                >
                  Back to Practice
                </button>
              </div>
            </section>
          </main>
        </>
      )}

      {/* PRACTICE AND ACTIVE QUIZ */}
      {(mode === "practice" || mode === "quiz") && (
        <>
          <div className="clock-page-topbar">
            <button
              className="clock-back-button"
              onClick={onBack}
              type="button"
            >
              ← BACK
            </button>

            <div className="clock-mode-buttons">
              {mode === "practice" ? (
                <>
                  <button
                    type="button"
                    className="clock-mode-button"
                    onClick={openQuizSetup}
                  >
                    Quiz
                  </button>

                  <button
                    type="button"
                    className="clock-worksheet-button"
                    onClick={() => setShowWorksheet(true)}
                  >
                    Practice
                  </button>
                </>
              ) : (
                <div className="clock-timer-display">
                  ⏱ {formatTimer(timeLeft)}
                </div>
              )}
            </div>
          </div>

          <main className="clock-level-content">
            <header className="clock-level-header">
              <div>
                <p className="clock-level-eyebrow">
                  NUMBER SENSE
                </p>

                <h1>Clock - Level 3</h1>

                <p className="clock-level-subtitle">
                  Look carefully at the clock and identify the exact time.
                </p>
              </div>

              <div className="clock-level-badge">
                🕒 Level 3
              </div>
            </header>

            <section className="clock-question-card">
              <div className="clock-question-top-info">
                {mode === "quiz" && (
                  <span>
                    Question {questionNumber}
                  </span>
                )}
              </div>

              <h2>What time is shown on the clock?</h2>

              <p className="clock-question-hint">
                Read the hour hand and minute hand carefully.
                Every minute counts!
              </p>

              {/* Analogue clock */}
              <div className="clock-visual-wrap">
                <AnalogClock
                  hour={question.hour}
                  minute={question.minute}
                />
              </div>

              <div className="clock-options-heading">
                Choose the correct answer
              </div>

              {/* Four answer options */}
              <div className="clock-options-grid">
                {question.options.map((option) => {
                  const isSelected = selectedAnswer === option;

                  let optionClass = "clock-option";

                  if (isSelected) {
                    optionClass += " selected";
                  }

                  if (
                    mode === "practice" &&
                    isAnswered &&
                    option === question.correctAnswer
                  ) {
                    optionClass += " correct";
                  }

                  if (
                    mode === "practice" &&
                    isProcessing &&
                    isSelected &&
                    option !== question.correctAnswer
                  ) {
                    optionClass += " incorrect";
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      className={optionClass}
                      onClick={() =>
                        mode === "practice"
                          ? handleAnswer(option)
                          : setSelectedAnswer(option)
                      }
                      disabled={
                        mode === "practice"
                          ? isAnswered || isProcessing
                          : isQuizProcessing
                      }
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Practice feedback only */}
              {mode === "practice" && feedback && (
                <div
                  className={`clock-feedback ${
                    selectedAnswer === question.correctAnswer
                      ? "feedback-correct"
                      : "feedback-incorrect"
                  }`}
                  role="status"
                >
                  {feedback}
                </div>
              )}

              {/* Practice score */}
              {mode === "practice" && (
                <div className="clock-live-score">
                  ⭐ Correct answers: {score}
                </div>
              )}

              {/* Quiz actions */}
              {mode === "quiz" && (
                <div className="clock-quiz-actions">
                  <button
                    type="button"
                    className="clock-next-button"
                    onClick={nextQuizQuestion}
                    disabled={
                      isQuizProcessing || timeLeft <= 0
                    }
                  >
                    {isQuizProcessing ? "Loading..." : "Next →"}
                  </button>

                  <button
                    type="button"
                    className="clock-end-test-button"
                    onClick={finishQuiz}
                    disabled={isQuizProcessing}
                  >
                    End Test
                  </button>
                </div>
              )}
            </section>
          </main>
        </>
      )}

      {/* PRACTICE WORKSHEET MODAL */}
      {showWorksheet && (
        <ClockLevel3Practice
          onClose={() => setShowWorksheet(false)}
        />
      )}
    </div>
  );
}

export default ClockLevel3;
