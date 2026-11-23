
import { useEffect, useRef, useState } from "react";
import "./ClockLevel2.css";

const formatTime = (hour, minute) =>
  `${hour}:${String(minute).padStart(2, "0")}`;

function shuffleArray(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
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

  const target = available[
    Math.floor(Math.random() * available.length)
  ];

  seenTimes.add(formatTime(target.hour, target.minute));

  return target;
}

function getClockAngle(x, y, center = 150) {
  const dx = x - center;
  const dy = center - y;

  return (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
}

function getPoint(angle, length, center = 150) {
  const radians = angle * Math.PI / 180;

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
      // Hour hand moves independently.
      // Minute hand remains unchanged.
      const nearestHour = Math.round(currentAngle / 30) % 12;
      const hour = nearestHour === 0 ? 12 : nearestHour;

      onHourDrag(hour);
    }

    if (drag.hand === "minute") {
      // Calculate incremental rotation so the minute hand
      // can travel around the clock in either direction.
      let difference = currentAngle - drag.lastAngle;

      if (difference > 180) difference -= 360;
      if (difference < -180) difference += 360;

      drag.lastAngle = currentAngle;
      drag.minuteFraction += difference / 6;

      const minuteChange = Math.trunc(drag.minuteFraction);

      if (minuteChange !== 0) {
        drag.totalMinutes += minuteChange;
        drag.minuteFraction -= minuteChange;

        // Keep the clock within a 12-hour cycle.
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
      {/* Clock outer ring */}
      <circle
        cx="150"
        cy="150"
        r="143"
        className="clock2-outer-ring"
      />

      {/* Clock face */}
      <circle
        cx="150"
        cy="150"
        r="135"
        className="clock2-inner-face"
      />

      {/* Minute markings */}
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

      {/* Hour hand: independently draggable */}
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

      {/* Minute hand: draggable and mechanically linked
          to the hour hand */}
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

      {/* Larger invisible touch targets make dragging easier */}
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

      {/* Center pin */}
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

  const [targetTime, setTargetTime] = useState(() =>
    createTargetTime(seenTimesRef.current)
  );

  // Initial clock setting: 12:05
  const [clock, setClock] = useState({
    hour: 12,
    minute: 5,
  });

  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);

    audio.play().catch((error) => {
      console.warn("Unable to play answer sound:", error);
    });
  };

  // Moving the hour hand does not move the minute hand.
  const handleHourDrag = (hour) => {
    if (isChecking) return;

    setClock((previous) => ({
      ...previous,
      hour,
    }));
  };

  // Moving the minute hand also adjusts the hour hand.
  const handleMinuteDrag = (hour, minute) => {
    if (isChecking) return;

    setClock({
      hour,
      minute,
    });
  };

  const checkAnswer = () => {
    if (isChecking) return;

    const correct =
      clock.hour === targetTime.hour &&
      clock.minute === targetTime.minute;

    if (correct) {
      setIsChecking(true);
      setFeedback("Excellent! You set the clock correctly! 🎉");
      setFeedbackType("correct");
      setScore((previous) => previous + 1);

      playSound("/sounds/very-good.mp3");

      timerRef.current = setTimeout(() => {
        setTargetTime(
          createTargetTime(seenTimesRef.current)
        );

        // Reset the clock for the next activity.
        setClock({
          hour: 12,
          minute: 5,
        });

        setFeedback("");
        setFeedbackType("");
        setIsChecking(false);
        timerRef.current = null;
      }, 1600);
    } else {
      setFeedback("Oops! Try Again! 😊");
      setFeedbackType("incorrect");

      playSound("/sounds/try-again.mp3");

      setIsChecking(true);

      timerRef.current = setTimeout(() => {
        setFeedback("");
        setFeedbackType("");
        setIsChecking(false);
        timerRef.current = null;
      }, 1000);
    }
  };

  return (
    <div className="clock2-page">
      <button
        className="clock2-back-button"
        type="button"
        onClick={onBack}
      >
        ← BACK
      </button>

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

          {/* Check button */}
          <button
            type="button"
            className="clock2-check-button"
            onClick={checkAnswer}
            disabled={isChecking}
          >
            ✓ Check Answer
          </button>

          {/* Feedback */}
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

          {/* Score */}
          <div className="clock2-score">
            ⭐ Correct answers: {score}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ClockLevel2;
