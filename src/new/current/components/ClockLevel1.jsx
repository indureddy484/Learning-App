
import { useEffect, useRef, useState } from "react";
import "./ClockLevel1.css";

function formatTime(hour, minute) {
  return `${hour}:${String(minute).padStart(2, "0")}`;
}

// Shuffle an array
function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// Generate a question without repeating a time until all 144 are used.
function createQuestion(seenTimes) {
  const allTimes = [];

  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      allTimes.push({ hour, minute });
    }
  }

  // Reset after all 144 combinations have been used.
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

  // Generate three different incorrect options.
  const wrongOptions = new Set();

  while (wrongOptions.size < 3) {
    const wrongHour = Math.floor(Math.random() * 12) + 1;
    const wrongMinute = Math.floor(Math.random() * 12) * 5;

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

  // Accurate hand angles
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
      {/* Outer ring */}
      <circle
        cx={center}
        cy={center}
        r="139"
        className="clock-outer-ring"
      />

      {/* Clock face */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        className="clock-inner-face"
      />

      {/* 60 minute markings */}
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

      {/* Center pin */}
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

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  // Clear pending timer when the component is closed.
  useEffect(() => {
    return () => {
      if (nextQuestionTimer.current) {
        clearTimeout(nextQuestionTimer.current);
      }
    };
  }, []);

  // Play answer sounds.
  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);

    audio.play().catch((error) => {
      console.warn("Unable to play answer sound:", error);
    });
  };

  // Automatically check the answer when an option is selected.
  const handleAnswer = (option) => {
    if (isAnswered || isProcessing) return;

    const correct = option === question.correctAnswer;

    setSelectedAnswer(option);
    setIsProcessing(true);

    if (correct) {
      // CORRECT ANSWER
      setIsAnswered(true);
      setFeedback("Very Good! Excellent! 🎉");

      setScore((previousScore) => previousScore + 1);

      playSound("/sounds/very-good.mp3");

      // Move to the next question only after correct answer.
      nextQuestionTimer.current = setTimeout(() => {
        setQuestion(createQuestion(seenTimesRef.current));
        setSelectedAnswer("");
        setIsAnswered(false);
        setIsProcessing(false);
        setFeedback("");
        nextQuestionTimer.current = null;
      }, 1400);

    } else {
      // WRONG ANSWER
      // Do not reveal the correct answer.
      // Do not change the current clock question.

      setFeedback("Oops! Try Again! 😊");

      playSound("/sounds/try-again.mp3");

      // Clear the wrong selection and allow another attempt.
      nextQuestionTimer.current = setTimeout(() => {
        setSelectedAnswer("");
        setFeedback("");
        setIsProcessing(false);
        nextQuestionTimer.current = null;
      }, 1000);
    }
  };

  return (
    <div className="clock-level-page">
      <button
        className="clock-back-button"
        onClick={onBack}
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
          <h2>What time is shown on the clock?</h2>

          <p className="clock-question-hint">
            Look carefully at the hour hand and minute hand.
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

              const isCorrectOption =
                option === question.correctAnswer;

              let optionClass = "clock-option";

              if (isSelected) {
                optionClass += " selected";
              }

              // Show green only after a correct selection.
              if (isAnswered && isCorrectOption) {
                optionClass += " correct";
              }

              // Show red only for the wrong selected option.
              if (
                isProcessing &&
                isSelected &&
                !isCorrectOption
              ) {
                optionClass += " incorrect";
              }

              return (
                <button
                  key={option}
                  type="button"
                  className={optionClass}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered || isProcessing}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Immediate feedback */}
          {feedback && (
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

          {/* Live score */}
          <div className="clock-live-score">
            ⭐ Correct answers: {score}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ClockLevel1;
