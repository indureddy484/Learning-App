
import React, { useMemo, useRef, useState } from "react";
import "./PlayDayClock.css";

const MINUTES_PER_DAY = 24 * 60;
const CENTER = 150;

const pad = (value) => String(value).padStart(2, "0");

function getDayPhase(hour) {
  if (hour < 5) {
    return {
      key: "night",
      icon: "🌙",
      title: "Night",
      message: "It is night time. Most people are sleeping.",
      period: "12:00 AM – 5:00 AM",
    };
  }

  if (hour < 7) {
    return {
      key: "sunrise",
      icon: "🌅",
      title: "Sunrise",
      message: "The sun is rising. A new day is beginning!",
      period: "5:00 AM – 7:00 AM",
    };
  }

  if (hour < 12) {
    return {
      key: "morning",
      icon: "🌤️",
      title: "Morning",
      message: "It is morning. Time to wake up and get ready!",
      period: "7:00 AM – 12:00 PM",
    };
  }

  if (hour < 16) {
    return {
      key: "afternoon",
      icon: "☀️",
      title: "Afternoon",
      message: "It is afternoon. The sun is high in the sky.",
      period: "12:00 PM – 4:00 PM",
    };
  }

  if (hour < 19) {
    return {
      key: "evening",
      icon: "🌇",
      title: "Evening",
      message: "It is evening. The sun is going down.",
      period: "4:00 PM – 7:00 PM",
    };
  }

  if (hour < 21) {
    return {
      key: "sunset",
      icon: "🌆",
      title: "Sunset",
      message: "The sun has set. It is getting dark.",
      period: "7:00 PM – 9:00 PM",
    };
  }

  return {
    key: "night",
    icon: "🌙",
    title: "Night",
    message: "It is night again. Time to rest and sleep.",
    period: "9:00 PM – 12:00 AM",
  };
}

function formatDigitalTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${pad(hours)}:${pad(minutes)} ${period}`;
}

function getPoint(angle, radius) {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
}

function getAngleFromPointer(event, svg) {
  const rect = svg.getBoundingClientRect();

  const scaleX = 300 / rect.width;
  const scaleY = 300 / rect.height;

  const x = (event.clientX - rect.left) * scaleX - CENTER;
  const y = (event.clientY - rect.top) * scaleY - CENTER;

  return (
    ((Math.atan2(y, x) * 180) / Math.PI + 90 + 360) % 360
  );
}

function getAngleDifference(current, previous) {
  let difference = current - previous;

  if (difference > 180) difference -= 360;
  if (difference < -180) difference += 360;

  return difference;
}

/* =========================================
   SMOOTH SKY COLOUR TRANSITIONS
========================================= */

function hexToRgb(hex) {
  const value = hex.replace("#", "");

  return {
    r: parseInt(value.substring(0, 2), 16),
    g: parseInt(value.substring(2, 4), 16),
    b: parseInt(value.substring(4, 6), 16),
  };
}

function mixColor(color1, color2, amount) {
  const a = hexToRgb(color1);
  const b = hexToRgb(color2);

  const r = Math.round(a.r + (b.r - a.r) * amount);
  const g = Math.round(a.g + (b.g - a.g) * amount);
  const blue = Math.round(a.b + (b.b - a.b) * amount);

  return `rgb(${r}, ${g}, ${blue})`;
}

function getSkyColors(minutes) {
  // Each point represents a gradual sky colour during the day.
  const stops = [
    { time: 0, top: "#111b3b", middle: "#27375f", bottom: "#4a527b" },
    { time: 270, top: "#202b50", middle: "#765d79", bottom: "#d18b7d" },
    { time: 330, top: "#7198c4", middle: "#f1a68d", bottom: "#ffd19b" },
    { time: 420, top: "#80c5e9", middle: "#c4e8ee", bottom: "#fff0c3" },
    { time: 600, top: "#55b4e6", middle: "#a9e1f0", bottom: "#f9edc0" },
    { time: 780, top: "#399bdc", middle: "#91d2ef", bottom: "#f7e6a9" },
    { time: 960, top: "#63a8d9", middle: "#e4b3a4", bottom: "#f7bd91" },
    { time: 1080, top: "#594e83", middle: "#c57683", bottom: "#f0a06e" },
    { time: 1140, top: "#20264e", middle: "#55466f", bottom: "#a36e78" },
    { time: 1260, top: "#111b3b", middle: "#27375f", bottom: "#4a527b" },
    { time: 1440, top: "#111b3b", middle: "#27375f", bottom: "#4a527b" },
  ];

  let start = stops[0];
  let end = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (minutes >= stops[i].time && minutes <= stops[i + 1].time) {
      start = stops[i];
      end = stops[i + 1];
      break;
    }
  }

  const range = end.time - start.time;
  const amount = range === 0 ? 0 : (minutes - start.time) / range;

  return {
    top: mixColor(start.top, end.top, amount),
    middle: mixColor(start.middle, end.middle, amount),
    bottom: mixColor(start.bottom, end.bottom, amount),
  };
}

/* =========================================
   CONTINUOUS SUN AND NIGHT SCENE
========================================= */

function getSceneData(date) {
  const minutes =
    date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;

  // Sunrise begins at 5 AM and sunset completes at 7 PM.
  const sunrise = 5 * 60;
  const sunset = 19 * 60;

  const daylightProgress = Math.max(
    0,
    Math.min(1, (minutes - sunrise) / (sunset - sunrise))
  );

  // Smooth horizontal movement from left to right.
  const sunX = 4 + daylightProgress * 92;

  // Curved path: below horizon -> highest point -> below horizon.
  const arc = Math.sin(Math.PI * daylightProgress);
  const sunY = 91 - arc * 73;

  // Fade the sun in and out near the horizon.
  const sunOpacity = Math.max(
    0,
    Math.min(1, arc * 5)
  );

  // A warm glow appears around sunrise and sunset.
  const sunriseGlow = Math.max(
    0,
    1 - Math.abs(minutes - 360) / 110
  );

  const sunsetGlow = Math.max(
    0,
    1 - Math.abs(minutes - 1080) / 130
  );

  const warmGlow = Math.max(sunriseGlow, sunsetGlow);

  // Stars gradually disappear as daylight increases.
  const starOpacity = Math.max(
    0,
    Math.min(0.85, 1 - arc * 2.8)
  );

  // Moon is visible mostly at night.
  const moonOpacity = Math.max(
    0,
    Math.min(0.9, 1 - arc * 3.5)
  );

  const colors = getSkyColors(minutes);

  return {
    minutes,
    sunX,
    sunY,
    sunOpacity,
    warmGlow,
    starOpacity,
    moonOpacity,
    colors,
    daylightProgress,
  };
}

/* =========================================
   ANALOGUE CLOCK
========================================= */

function AnalogClock({ date, onTimeChange }) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);

  const hour24 = date.getHours();
  const minute = date.getMinutes();

  const hour12 = hour24 % 12 || 12;

  const hourAngle = (hour12 % 12) * 30 + minute * 0.5;
  const minuteAngle = minute * 6;

  const hourEnd = getPoint(hourAngle, 70);
  const minuteEnd = getPoint(minuteAngle, 102);

  const startDragging = (event, hand) => {
    event.preventDefault();
    event.stopPropagation();

    const svg = svgRef.current;
    if (!svg) return;

    const angle = getAngleFromPointer(event, svg);

    dragRef.current = {
      hand,
      lastAngle: angle,
      fraction: 0,
    };

    svg.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    const svg = svgRef.current;

    if (!drag || !svg) return;

    const currentAngle = getAngleFromPointer(event, svg);

    const difference = getAngleDifference(
      currentAngle,
      drag.lastAngle
    );

    drag.lastAngle = currentAngle;

    if (drag.hand === "hour") {
      drag.fraction += difference / 30;

      const wholeHours = Math.trunc(drag.fraction);

      if (wholeHours !== 0) {
        drag.fraction -= wholeHours;
        onTimeChange(wholeHours * 60);
      }

      return;
    }

    drag.fraction += difference / 6;

    const wholeMinutes = Math.trunc(drag.fraction);

    if (wholeMinutes !== 0) {
      drag.fraction -= wholeMinutes;
      onTimeChange(wholeMinutes);
    }
  };

  const stopDragging = (event) => {
    dragRef.current = null;

    const svg = svgRef.current;

    if (svg && svg.hasPointerCapture(event.pointerId)) {
      svg.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="pdc-analog-wrapper">
      <div className="pdc-clock-heading">
        <span className="pdc-clock-eyebrow">
          LEARN TO READ TIME
        </span>

        <h2>Analogue Clock</h2>

        <p>Drag the hour hand or minute hand to change the time.</p>
      </div>

      <div className="pdc-clock-face-wrap">
        <svg
          ref={svgRef}
          className="clock-play-analog-face"
          viewBox="0 0 300 300"
          role="img"
          aria-label="Interactive analogue clock. Drag either hand to change the time."
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onLostPointerCapture={() => {
            dragRef.current = null;
          }}
        >
          <circle
            cx="150"
            cy="150"
            r="143"
            className="clock-play-outer-ring"
          />

          <circle
            cx="150"
            cy="150"
            r="135"
            className="clock-play-inner-face"
          />

          {Array.from({ length: 60 }, (_, index) => {
            const major = index % 5 === 0;

            const start = getPoint(
              index * 6,
              major ? 115 : 122
            );

            const end = getPoint(index * 6, 129);

            return (
              <line
                key={index}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                className={
                  major
                    ? "clock-play-major-tick"
                    : "clock-play-minor-tick"
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
                className="clock-play-number"
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
            className="clock-play-hour-hand"
            onPointerDown={(event) =>
              startDragging(event, "hour")
            }
          />

          <line
            x1="150"
            y1="150"
            x2={minuteEnd.x}
            y2={minuteEnd.y}
            className="clock-play-minute-hand"
            onPointerDown={(event) =>
              startDragging(event, "minute")
            }
          />

          <circle
            cx={hourEnd.x}
            cy={hourEnd.y}
            r="18"
            className="clock-play-hour-touch"
            onPointerDown={(event) =>
              startDragging(event, "hour")
            }
          />

          <circle
            cx={minuteEnd.x}
            cy={minuteEnd.y}
            r="18"
            className="clock-play-minute-touch"
            onPointerDown={(event) =>
              startDragging(event, "minute")
            }
          />

          <circle
            cx="150"
            cy="150"
            r="7"
            className="clock-play-center-pin"
          />
        </svg>
      </div>

      <div className="pdc-clock-help">
        <span>
          <i className="pdc-hour-dot" />
          Hour hand
        </span>

        <span>
          <i className="pdc-minute-dot" />
          Minute hand
        </span>
      </div>

      <p className="pdc-clock-tip">
        💡 The short hand shows hours. The long hand shows minutes.
      </p>
    </div>
  );
}

/* =========================================
   MAIN COMPONENT
========================================= */

function PlayDayClock({ onBack }) {
  const [baseDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const currentDate = useMemo(() => {
    return new Date(
      baseDate.getTime() + elapsedMinutes * 60 * 1000
    );
  }, [baseDate, elapsedMinutes]);

  const handleTimeChange = (minuteChange) => {
    setElapsedMinutes((previous) => previous + minuteChange);
  };

  const resetTime = () => {
    setElapsedMinutes(0);
  };

  const hours = currentDate.getHours();
  const phase = getDayPhase(hours);
  const formattedTime = formatDigitalTime(currentDate);
  const scene = getSceneData(currentDate);

  const dateText = currentDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const dayOffset = Math.floor(
    elapsedMinutes / MINUTES_PER_DAY
  );

  const dayDescription =
    dayOffset === 0
      ? "Starting day"
      : dayOffset > 0
      ? `${dayOffset} ${dayOffset === 1 ? "day" : "days"} later`
      : `${Math.abs(dayOffset)} ${
          Math.abs(dayOffset) === 1 ? "day" : "days"
        } earlier`;

  const sceneStyle = {
    "--sky-top": scene.colors.top,
    "--sky-middle": scene.colors.middle,
    "--sky-bottom": scene.colors.bottom,
    "--sun-x": `${scene.sunX}%`,
    "--sun-y": `${scene.sunY}%`,
    "--sun-opacity": scene.sunOpacity,
    "--star-opacity": scene.starOpacity,
    "--moon-opacity": scene.moonOpacity,
    "--warm-glow": scene.warmGlow,
  };

  return (
    <main className="pdc-page">
      <header className="pdc-header">
        <button
          className="pdc-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <div className="pdc-heading">
          <span className="pdc-eyebrow">
            CALENDAR AND TIME
          </span>

          <h1>Play with Day and Clock</h1>

          <p>See how time, date and day change together!</p>
        </div>

        <button
          className="pdc-reset-button"
          onClick={resetTime}
          type="button"
        >
          ↺ Reset
        </button>
      </header>

      <section className="pdc-main-card">
        <div className="pdc-digital-section">
          <div className="pdc-section-heading">
            <span className="pdc-section-icon">📅</span>

            <div>
              <span className="pdc-section-kicker">
                CALENDAR
              </span>

              <h2>Date and Day</h2>
            </div>
          </div>

          <div className="pdc-date-display">
            <div className="pdc-date-calendar">
              <span className="pdc-calendar-month">
                {currentDate.toLocaleDateString("en-IN", {
                  month: "short",
                })}
              </span>

              <strong>{currentDate.getDate()}</strong>
            </div>

            <div className="pdc-date-details">
              <strong>{dateText}</strong>
              <span>{dayDescription}</span>
            </div>
          </div>

          <div className="pdc-section-heading pdc-digital-heading">
            <span className="pdc-section-icon">🕒</span>

            <div>
              <span className="pdc-section-kicker">
                DIGITAL DISPLAY
              </span>

              <h2>Digital Clock</h2>
            </div>
          </div>

          <div className="pdc-digital-clock" aria-live="polite">
            <div className="pdc-digital-screen">
              <span className="pdc-digital-time">
                {formattedTime}
              </span>

              <span className="pdc-digital-caption">
                HOURS : MINUTES
              </span>
            </div>

            <div className="pdc-digital-footer">
              <span className="pdc-power-dot" />
              CLOCK IS RUNNING
            </div>
          </div>

          <div className={`pdc-time-description phase-card-${phase.key}`}>
            <span className="pdc-phase-icon">
              {phase.icon}
            </span>

            <div>
              <span className="pdc-phase-label">
                CURRENT TIME OF DAY
              </span>

              <strong>{phase.title}</strong>
              <p>{phase.message}</p>
            </div>
          </div>
        </div>

        <div className="pdc-analog-section">
          <AnalogClock
            date={currentDate}
            onTimeChange={handleTimeChange}
          />
        </div>
      </section>

      {/* CONTINUOUS SUNRISE, DAYTIME AND SUNSET SCENE */}
      <section
        className="pdc-day-scene"
        style={sceneStyle}
      >
        <div className="pdc-sky-glow" />

        <div className="pdc-scene-stars" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <span
              key={index}
              className={`pdc-star pdc-star-${index + 1}`}
            >
              ✦
            </span>
          ))}
        </div>

        <div className="pdc-moon" aria-hidden="true">
          🌙
        </div>

        <div className="pdc-sun-track" aria-hidden="true">
          <div className="pdc-sun-glow" />
          <div className="pdc-sun">
            <div className="pdc-sun-core" />
          </div>
        </div>

        <div className="pdc-cloud pdc-cloud-one" aria-hidden="true">
          ☁️
        </div>

        <div className="pdc-cloud pdc-cloud-two" aria-hidden="true">
          ☁️
        </div>

        <div className="pdc-scene-content">
          <div className="pdc-scene-text">
            <span>LOOK OUTSIDE!</span>

            <h2>{phase.title}</h2>

            <p>{phase.message}</p>

            <strong className="pdc-scene-period">
              {phase.period}
            </strong>
          </div>
        </div>

        <div className="pdc-horizon-glow" />

        <div className="pdc-scene-landscape" aria-hidden="true">
          <span>🌳</span>
          <span>🏠</span>
          <span>🌲</span>
          <span>🏡</span>
          <span>🌳</span>
        </div>
      </section>

      <section className="pdc-learning-tip">
        <span className="pdc-tip-icon">💡</span>

        <div>
          <strong>Did you know?</strong>

          <p>
            One full day has 24 hours. After 11:59 PM comes
            12:00 AM. The date and day change, and a new day begins!
            Watch how the sun rises in the morning, moves across
            the sky, and sets in the evening.
          </p>
        </div>
      </section>
    </main>
  );
}

export default PlayDayClock;
