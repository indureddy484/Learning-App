
import { useEffect, useRef, useState } from "react";
import "./ClockLevel3.css";
import "./ClockLevel2.css";

const TIMER_OPTIONS = [1, 2, 5, 10, 20];

const formatTime = (hour, minute) =>
  `${hour}:${String(minute).padStart(2, "0")}`;

const formatTimer = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

// Generate all 720 possible times without repetition.
function createTargetTime(seenTimes) {
  const allTimes = [];

  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute++) {
      allTimes.push({ hour, minute });
    }
  }

  if (seenTimes.size >= allTimes.length) {
    seenTimes.clear();
  }

  const available = allTimes.filter(
    ({ hour, minute }) =>
      !seenTimes.has(formatTime(hour, minute))
  );

  const target =
    available[Math.floor(Math.random() * available.length)];

  seenTimes.add(formatTime(target.hour, target.minute));

  return target;
}

function getClockAngle(x, y, center = 150) {
  const dx = x - center;
  const dy = center - y;

  return (
    (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360
  );
}

function getPoint(angle, length, center = 150) {
  const radians = angle * Math.PI / 180;

  return {
    x: center + length * Math.sin(radians),
    y: center - length * Math.cos(radians),
  };
}

// Interactive Analogue Clock
function AnalogClock({ clock, onHourDrag, onMinuteDrag }) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);

  const hourAngle =
    (clock.hour % 12) * 30 + clock.minute * 0.5;

  const minuteAngle = clock.minute * 6;

  const hourEnd = getPoint(hourAngle, 67);
  const minuteEnd = getPoint(minuteAngle, 100);

  const getPointerAngle = (event) => {
    const svg = svgRef.current;
    if (!svg) return 0;

    const rect = svg.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) * 300;

    const y =
      ((event.clientY - rect.top) / rect.height) * 300;

    return getClockAngle(x, y);
  };

  const startDragging = (event, hand) => {
    event.preventDefault();
    event.stopPropagation();

    const svg = svgRef.current;
    if (!svg) return;

    svg.setPointerCapture(event.pointerId);

    const angle = getPointerAngle(event);

    dragRef.current = {
      hand,
      lastAngle: angle,
      totalMinutes:
        (clock.hour % 12) * 60 + clock.minute,
      minuteFraction: 0,
    };
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current) return;

    const currentAngle = getPointerAngle(event);
    const drag = dragRef.current;

    if (drag.hand === "hour") {
      const nearestHour = Math.round(currentAngle / 30) % 12;
      const hour = nearestHour === 0 ? 12 : nearestHour;

      onHourDrag(hour);
    }

    if (drag.hand === "minute") {
      let difference = currentAngle - drag.lastAngle;

      if (difference > 180) difference -= 360;
      if (difference < -180) difference += 360;

      drag.lastAngle = currentAngle;
      drag.minuteFraction += difference / 6;

      const minuteChange = Math.trunc(drag.minuteFraction);

      if (minuteChange !== 0) {
        drag.totalMinutes += minuteChange;
        drag.minuteFraction -= minuteChange;

        const normalized =
          ((drag.totalMinutes % 720) + 720) % 720;

        const hourIndex = Math.floor(normalized / 60);
        const minute = normalized % 60;

        const hour = hourIndex === 0 ? 12 : hourIndex;

        onMinuteDrag(hour, minute);
      }
    }
  };

  const stopDragging = (event) => {
    if (dragRef.current) {
      dragRef.current = null;
    }

    const svg = svgRef.current;

    if (
      svg &&
      event.pointerId !== undefined &&
      svg.hasPointerCapture(event.pointerId)
    ) {
      svg.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <svg
      ref={svgRef}
      className="clock2-face"
      viewBox="0 0 300 300"
      role="img"
      aria-label="Interactive analogue clock. Drag the hands to set the time."
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <circle
        cx="150"
        cy="150"
        r="143"
        className="clock2-outer-ring"
      />

      <circle
        cx="150"
        cy="150"
        r="135"
        className="clock2-inner-face"
      />

      {/* All 60 minute markings */}
      {Array.from({ length: 60 }, (_, index) => {
        const angle = index * 6;
        const major = index % 5 === 0;

        const start = getPoint(angle, major ? 115 : 122);
        const end = getPoint(angle, 129);

        return (
          <line
            key={index}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            className={
              major
                ? "clock2-major-tick"
                : "clock2-minor-tick"
            }
          />
        );
      })}

      {/* Clock numbers */}
      {Array.from({ length: 12 }, (_, index) => {
        const number = index + 1;
        const point = getPoint(number * 30, 94);

        return (
          <text
            key={number}
            x={point.x}
            y={point.y}
            className="clock2-number"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {number}
          </text>
        );
      })}

      {/* Hour hand */}
      <line
        x1="150"
        y1="150"
        x2={hourEnd.x}
        y2={hourEnd.y}
        className="clock2-hour-hand"
        onPointerDown={(event) =>
          startDragging(event, "hour")
        }
      />

      {/* Minute hand */}
      <line
        x1="150"
        y1="150"
        x2={minuteEnd.x}
        y2={minuteEnd.y}
        className="clock2-minute-hand"
        onPointerDown={(event) =>
          startDragging(event, "minute")
        }
      />

      {/* Hour hand touch target */}
      <circle
        cx={hourEnd.x}
        cy={hourEnd.y}
        r="17"
        className="clock2-hour-touch"
        onPointerDown={(event) =>
          startDragging(event, "hour")
        }
      />

      {/* Minute hand touch target */}
      <circle
        cx={minuteEnd.x}
        cy={minuteEnd.y}
        r="17"
        className="clock2-minute-touch"
        onPointerDown={(event) =>
          startDragging(event, "minute")
        }
      />

      <circle
        cx="150"
        cy="150"
        r="7"
        className="clock2-center-pin"
      />
    </svg>
  );
}

function ClockLevel4({ onBack }) {
  const seenTimesRef = useRef(new Set());
  const timerRef = useRef(null);
  const pendingQuizRecordRef = useRef(null);

  const [targetTime, setTargetTime] = useState(() =>
    createTargetTime(seenTimesRef.current)
  );

  const [clock, setClock] = useState({
    hour: 12,
    minute: 5,
  });

  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState(0);

  // Track whether the student has moved a clock hand.
  const [hasInteracted, setHasInteracted] = useState(false);

  // Quiz states
  const [mode, setMode] = useState("practice");
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [quizHistory, setQuizHistory] = useState([]);
  const [resultHistory, setResultHistory] = useState([]);
  const [isQuizProcessing, setIsQuizProcessing] = useState(false);

  // Clear pending timer when component closes.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Play sounds in practice mode only.
  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);

    audio.play().catch((error) => {
      console.warn("Unable to play answer sound:", error);
    });
  };

  // Reset the current question.
  const resetQuestion = () => {
    setClock({
      hour: 12,
      minute: 5,
    });

    setFeedback("");
    setFeedbackType("");
    setIsChecking(false);
    setHasInteracted(false);
  };

  // Move hour hand independently.
  const handleHourDrag = (hour) => {
    if (isChecking || isQuizProcessing) return;

    setHasInteracted(true);

    setClock((previous) => ({
      ...previous,
      hour,
    }));
  };

  // Move minute hand and proportionally adjust hour hand.
  const handleMinuteDrag = (hour, minute) => {
    if (isChecking || isQuizProcessing) return;

    setHasInteracted(true);

    setClock({
      hour,
      minute,
    });
  };

  // PRACTICE MODE: Check the exact target time.
  const checkAnswer = () => {
    if (mode !== "practice" || isChecking) return;

    const correct =
      clock.hour === targetTime.hour &&
      clock.minute === targetTime.minute;

    setIsChecking(true);

    if (correct) {
      setFeedback("Excellent! You set the clock correctly! 🎉");
      setFeedbackType("correct");

      setScore((previous) => previous + 1);

      playSound("/sounds/very-good.mp3");

      timerRef.current = setTimeout(() => {
        setTargetTime(
          createTargetTime(seenTimesRef.current)
        );

        resetQuestion();
        timerRef.current = null;
      }, 1600);
    } else {
      setFeedback("Oops! Try Again! 😊");
      setFeedbackType("incorrect");

      playSound("/sounds/try-again.mp3");

      timerRef.current = setTimeout(() => {
        setFeedback("");
        setFeedbackType("");
        setIsChecking(false);
        timerRef.current = null;
      }, 1000);
    }
  };

  // Open practice mode.
  const openPractice = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    pendingQuizRecordRef.current = null;

    setMode("practice");
    setScore(0);
    setTargetTime(createTargetTime(seenTimesRef.current));
    resetQuestion();
    setIsQuizProcessing(false);
  };

  // Open quiz setup.
  const openQuizSetup = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    pendingQuizRecordRef.current = null;

    setMode("setup");
    setIsQuizProcessing(false);
    resetQuestion();
  };

  // Start quiz.
  const startQuiz = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    pendingQuizRecordRef.current = null;

    setTargetTime(createTargetTime(seenTimesRef.current));
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
    const studentAnswer = hasInteracted
      ? formatTime(clock.hour, clock.minute)
      : null;

    const correctAnswer = formatTime(
      targetTime.hour,
      targetTime.minute
    );

    return {
      number: questionNumber,
      targetTime: correctAnswer,
      studentAnswer,
      isAnswered: Boolean(studentAnswer),
      isCorrect:
        Boolean(studentAnswer) &&
        studentAnswer === correctAnswer,
    };
  };

  // Move to the next quiz question.
  const advanceQuizQuestion = (record) => {
    setQuizHistory((previousHistory) => [
      ...previousHistory,
      record,
    ]);

    pendingQuizRecordRef.current = null;

    setTargetTime(createTargetTime(seenTimesRef.current));
    resetQuestion();

    setQuestionNumber((previousNumber) => previousNumber + 1);
    setIsQuizProcessing(false);
    timerRef.current = null;
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

    timerRef.current = setTimeout(() => {
      advanceQuizQuestion(record);
    }, 400);
  };

  // End quiz and show analysis.
  const finishQuiz = () => {
    if (mode !== "quiz") return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
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

                <h1>Clock - Level 4 Quiz</h1>

                <p className="clock-level-subtitle">
                  Set the clock to match the exact digital time.
                </p>
              </div>

              <div className="clock-level-badge">
                🕒 Level 4
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
                    {duration}{" "}
                    {duration === 1 ? "Minute" : "Minutes"}
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
                🕒 Level 4
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
                        Target time: {item.targetTime}
                      </span>

                      <span>
                        Your clock:{" "}
                        {item.studentAnswer || "Not Attempted"}
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
                        Correct time: {item.targetTime}
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
                <button
                  type="button"
                  className="clock-mode-button"
                  onClick={openQuizSetup}
                >
                  Quiz
                </button>
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

                <h1>Clock - Level 4</h1>

                <p className="clock-level-subtitle">
                  Set the clock to match the exact digital time.
                </p>
              </div>

              <div className="clock-level-badge">
                🕒 Level 4
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

              {/* Digital target time */}
              <div className="clock2-target">
                <p>SET THE CLOCK TO</p>

                <div className="clock2-digital-display">
                  {formatTime(
                    targetTime.hour,
                    targetTime.minute
                  )}
                </div>

                <p className="clock2-instruction">
                  Move the clock hands to show this exact time.
                </p>
              </div>

              {/* Interactive analogue clock */}
              <div className="clock2-visual-wrap">
                <AnalogClock
                  clock={clock}
                  onHourDrag={handleHourDrag}
                  onMinuteDrag={handleMinuteDrag}
                />
              </div>

              <div className="clock2-hand-hint">
                <span>
                  <span className="clock2-hint-dot hour-dot" />
                  Hour hand
                </span>

                <span>
                  <span className="clock2-hint-dot minute-dot" />
                  Minute hand
                </span>
              </div>

              <p className="clock2-drag-instruction">
                Drag either hand to set every minute from 00 to 59.
              </p>

              {/* Practice check button */}
              {mode === "practice" && (
                <>
                  <button
                    type="button"
                    className="clock2-check-button"
                    onClick={checkAnswer}
                    disabled={isChecking}
                  >
                    ✓ Check Answer
                  </button>

                  {feedback && (
                    <div
                      className={`clock2-feedback ${
                        feedbackType === "correct"
                          ? "clock2-feedback-correct"
                          : "clock2-feedback-incorrect"
                      }`}
                      role="status"
                    >
                      {feedback}
                    </div>
                  )}

                  <div className="clock2-score">
                    ⭐ Correct answers: {score}
                  </div>
                </>
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
    </div>
  );
}

export default ClockLevel4;
