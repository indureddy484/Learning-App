
import { useEffect, useRef, useState } from "react";
import "./ClockLevel2.css";

const TIMER_OPTIONS = [1, 2, 5, 10, 20];

const formatTime = (hour, minute) =>
  `${hour}:${String(minute).padStart(2, "0")}`;

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remaining
  ).padStart(2, "0")}`;
}

function createTargetTime(seenTimes) {
  const allTimes = [];

  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
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
    ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360
  );
}

function getPoint(angle, length, center = 150) {
  const radians = (angle * Math.PI) / 180;

  return {
    x: center + length * Math.sin(radians),
    y: center - length * Math.cos(radians),
  };
}

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

    const x = ((event.clientX - rect.left) / rect.width) * 300;
    const y = ((event.clientY - rect.top) / rect.height) * 300;

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
      totalMinutes: (clock.hour % 12) * 60 + clock.minute,
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
    dragRef.current = null;

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

      <circle
        cx={hourEnd.x}
        cy={hourEnd.y}
        r="17"
        className="clock2-hour-touch"
        onPointerDown={(event) =>
          startDragging(event, "hour")
        }
      />

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

function ClockLevel2({ onBack }) {
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

  // Practice and quiz mode
  const [mode, setMode] = useState("practice");

  // Track whether the student changed the clock
  const [hasInteracted, setHasInteracted] = useState(false);

  // Quiz setup and timer
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [isQuizChecking, setIsQuizChecking] = useState(false);

  // Quiz history
  const [quizHistory, setQuizHistory] = useState([]);
  const [resultHistory, setResultHistory] = useState([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const clearPendingTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);

    audio.play().catch((error) => {
      console.warn("Unable to play answer sound:", error);
    });
  };

  const resetClock = () => {
    setClock({
      hour: 12,
      minute: 5,
    });

    setHasInteracted(false);
    setFeedback("");
    setFeedbackType("");
    setIsChecking(false);
  };

  // Moving the hour hand does not move the minute hand.
  const handleHourDrag = (hour) => {
    if (isChecking || isQuizChecking) return;

    setClock((previous) => ({
      ...previous,
      hour,
    }));

    setHasInteracted(true);
  };

  // Moving the minute hand also adjusts the hour hand.
  const handleMinuteDrag = (hour, minute) => {
    if (isChecking || isQuizChecking) return;

    setClock({
      hour,
      minute,
    });

    setHasInteracted(true);
  };

  // PRACTICE MODE: Check answer with feedback and sounds
  const checkAnswer = () => {
    if (isChecking || mode !== "practice") return;

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

        resetClock();
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

  // Return to practice mode
  const openPractice = () => {
    clearPendingTimer();
    pendingQuizRecordRef.current = null;

    setMode("practice");
    setScore(0);
    setIsQuizChecking(false);

    resetClock();

    setTargetTime(
      createTargetTime(seenTimesRef.current)
    );
  };

  // Open quiz setup
  const openQuizSetup = () => {
    clearPendingTimer();
    pendingQuizRecordRef.current = null;

    setMode("setup");
    setIsQuizChecking(false);

    resetClock();
  };

  // Start quiz
  const startQuiz = () => {
    clearPendingTimer();
    pendingQuizRecordRef.current = null;

    setTargetTime(
      createTargetTime(seenTimesRef.current)
    );

    resetClock();

    setQuestionNumber(1);
    setQuizHistory([]);
    setResultHistory([]);
    setIsQuizChecking(false);

    setTimeLeft(selectedDuration * 60);
    setMode("quiz");
  };

  // Create a record for the current quiz question
  const createCurrentRecord = () => {
    const isAnswered = hasInteracted;

    const isCorrect =
      isAnswered &&
      clock.hour === targetTime.hour &&
      clock.minute === targetTime.minute;

    return {
      number: questionNumber,
      targetTime: formatTime(
        targetTime.hour,
        targetTime.minute
      ),
      studentTime: isAnswered
        ? formatTime(clock.hour, clock.minute)
        : null,
      isAnswered,
      isCorrect,
    };
  };

  // Automatically move to the next question without revealing answers
  const advanceQuizQuestion = (record) => {
    setQuizHistory((previous) => [...previous, record]);

    pendingQuizRecordRef.current = null;

    setTargetTime(
      createTargetTime(seenTimesRef.current)
    );

    resetClock();
    setIsQuizChecking(false);

    setQuestionNumber((previous) => previous + 1);
  };

  // QUIZ MODE: Record silently and move to next question
  const nextQuizQuestion = () => {
    if (
      mode !== "quiz" ||
      isQuizChecking ||
      timeLeft === 0
    ) {
      return;
    }

    const record = createCurrentRecord();

    setIsQuizChecking(true);

    // Keep the current answer available if the timer expires
    // before the automatic transition completes.
    pendingQuizRecordRef.current = record;

    // No sound, no feedback and no answer reveal.
    timerRef.current = setTimeout(() => {
      if (mode === "quiz") {
        advanceQuizQuestion(record);
      }

      timerRef.current = null;
    }, 500);
  };

  // Finish quiz and prepare analysis
  const finishQuiz = () => {
    if (mode !== "quiz") return;

    clearPendingTimer();

    const pendingRecord = pendingQuizRecordRef.current;

    const currentRecord = pendingRecord
      ? pendingRecord
      : createCurrentRecord();

    pendingQuizRecordRef.current = null;

    setResultHistory([...quizHistory, currentRecord]);
    setIsQuizChecking(false);
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

  // Quiz result calculations
  const correctCount = resultHistory.filter(
    (item) => item.isCorrect
  ).length;

  const incorrectCount = resultHistory.filter(
    (item) => item.isAnswered && !item.isCorrect
  ).length;

  const unansweredCount = resultHistory.filter(
    (item) => !item.isAnswered
  ).length;

  const totalQuestions = resultHistory.length;

  const accuracy =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  const backToPractice = () => {
    openPractice();
  };

  // QUIZ SETUP SCREEN
  if (mode === "setup") {
    return (
      <div className="clock2-page">
        <button
          className="clock2-back-button"
          onClick={backToPractice}
          type="button"
        >
          ← BACK
        </button>

        <main className="clock2-content">
          <section className="clock-setup-card">
            <div className="clock-setup-icon">🕒</div>

            <p className="clock2-eyebrow">NUMBER SENSE</p>

            <h1>Clock Level 2 Quiz</h1>

            <p className="clock2-subtitle">
              Choose your test duration and get ready!
            </p>

            <div className="clock-setup-setting">
              <label htmlFor="clock2-duration">
                Select Quiz Duration
              </label>

              <select
                id="clock2-duration"
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
                Quiz. Set the clock to match each digital time.
                Answer as many questions as you can before time
                runs out.
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
      <div className="clock2-page">
        <button
          className="clock2-back-button"
          onClick={backToPractice}
          type="button"
        >
          ← BACK
        </button>

        <main className="clock2-content">
          <section className="clock-result-card">
            <div className="clock-result-icon">🏆</div>

            <p className="clock2-eyebrow">NUMBER SENSE</p>

            <h1>Quiz Completed!</h1>

            <p className="clock2-subtitle">
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
                    !item.isAnswered
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
                      Set the clock to {item.targetTime}
                    </span>
                  </div>

                  <div className="clock-analysis-answer">
                    Your clock:{" "}
                    <strong>
                      {item.studentTime || "Not attempted"}
                    </strong>
                  </div>

                  <div className="clock-analysis-answer">
                    Correct answer:{" "}
                    <strong>{item.targetTime}</strong>
                  </div>

                  <span className="clock-analysis-status">
                    {!item.isAnswered
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

  // PRACTICE OR ACTIVE QUIZ SCREEN
  return (
    <div className="clock2-page">
      <div className="clock-page-topbar">
        <button
          className="clock2-back-button"
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
        </div>
      </div>

      <main className="clock2-content">
        <header className="clock2-header">
          <div>
            <p className="clock2-eyebrow">NUMBER SENSE</p>

            <h1>Clock - Level 2</h1>

            <p className="clock2-subtitle">
              Set the clock to match the digital time.
            </p>
          </div>

          <div className="clock2-level-badge">
            🕒 Level 2
          </div>
        </header>

        <section className="clock2-card">
          {/* Question information */}
          {mode === "quiz" && (
            <div className="clock-question-top-info">
              <span>Question {questionNumber}</span>

              <span className="clock-timer-display">
                ⏰ {formatTimer(timeLeft)}
              </span>
            </div>
          )}

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
              Move the clock hands to show this time.
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
            Drag either hand to set the time.
          </p>

          {/* Practice mode actions */}
          {mode === "practice" ? (
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
                  aria-live="polite"
                >
                  {feedback}
                </div>
              )}

              <div className="clock2-score">
                ⭐ Correct answers: {score}
              </div>
            </>
          ) : (
            /* Quiz mode: silent automatic progression */
            <div className="clock-quiz-actions">
              <button
                className="clock-next-button"
                onClick={nextQuizQuestion}
                disabled={isQuizChecking || timeLeft === 0}
                type="button"
              >
                ➡ Next
              </button>

              <button
                className="clock-end-test-button"
                onClick={finishQuiz}
                disabled={isQuizChecking}
                type="button"
              >
                ⛔ End Test
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ClockLevel2;
