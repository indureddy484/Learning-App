import React, { useRef, useState } from "react";
import "./ClockPlay.css";

const CENTER = 150;

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
  return (Math.atan2(y, x) * 180 / Math.PI + 90 + 360) % 360;
}

function AnalogClock({ time, onTimeChange }) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);

  const hourAngle = (time.hour % 12) * 30 + time.minute * 0.5;
  const minuteAngle = time.minute * 6;
  const hourEnd = getPoint(hourAngle, 70);
  const minuteEnd = getPoint(minuteAngle, 102);

  const startDragging = (event, hand) => {
    event.preventDefault();
    event.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;

    svg.setPointerCapture(event.pointerId);
    const angle = getAngleFromPointer(event, svg);
    dragRef.current = {
      hand,
      lastAngle: angle,
      totalMinutes: (time.hour % 12) * 60 + time.minute,
      minuteFraction: 0,
    };
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    const svg = svgRef.current;
    if (!drag || !svg) return;

    const currentAngle = getAngleFromPointer(event, svg);

    if (drag.hand === "hour") {
      const nearestHour = Math.round(currentAngle / 30) % 12;
      const hour = nearestHour === 0 ? 12 : nearestHour;
      onTimeChange({ ...time, hour });
      return;
    }

    let difference = currentAngle - drag.lastAngle;
    if (difference > 180) difference -= 360;
    if (difference < -180) difference += 360;
    drag.lastAngle = currentAngle;
    drag.minuteFraction += difference / 6;

    const minuteChange = Math.trunc(drag.minuteFraction);
    if (minuteChange !== 0) {
      drag.totalMinutes += minuteChange;
      drag.minuteFraction -= minuteChange;
      const normalized = ((drag.totalMinutes % 720) + 720) % 720;
      const hourIndex = Math.floor(normalized / 60);
      onTimeChange({
        hour: hourIndex === 0 ? 12 : hourIndex,
        minute: normalized % 60,
      });
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
    <svg
      ref={svgRef}
      className="clock-play-analog-face"
      viewBox="0 0 300 300"
      role="img"
      aria-label="Interactive analogue clock. Drag either hand to change the time."
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <circle cx="150" cy="150" r="143" className="clock-play-outer-ring" />
      <circle cx="150" cy="150" r="135" className="clock-play-inner-face" />

      {Array.from({ length: 60 }, (_, index) => {
        const major = index % 5 === 0;
        const start = getPoint(index * 6, major ? 115 : 122);
        const end = getPoint(index * 6, 129);
        return (
          <line
            key={index}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            className={major ? "clock-play-major-tick" : "clock-play-minor-tick"}
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
        x1="150" y1="150" x2={hourEnd.x} y2={hourEnd.y}
        className="clock-play-hour-hand"
        onPointerDown={(event) => startDragging(event, "hour")}
      />
      <line
        x1="150" y1="150" x2={minuteEnd.x} y2={minuteEnd.y}
        className="clock-play-minute-hand"
        onPointerDown={(event) => startDragging(event, "minute")}
      />
      <circle
        cx={hourEnd.x} cy={hourEnd.y} r="18"
        className="clock-play-hour-touch"
        onPointerDown={(event) => startDragging(event, "hour")}
      />
      <circle
        cx={minuteEnd.x} cy={minuteEnd.y} r="18"
        className="clock-play-minute-touch"
        onPointerDown={(event) => startDragging(event, "minute")}
      />
      <circle cx="150" cy="150" r="7" className="clock-play-center-pin" />
    </svg>
  );
}

function formatDigitalTime({ hour, minute }) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default function ClockPlay({ onBack }) {
  const [time, setTime] = useState({ hour: 12, minute: 5 });

  return (
    <div className="clock-play-page">
      {onBack && (
        <button type="button" className="clock-play-back-button" onClick={onBack}>
          ← BACK
        </button>
      )}

      <header className="clock-play-header">
        <p className="clock-play-eyebrow">LEARN AND EXPLORE</p>
        <h1>Play with Clock</h1>
        <p>Move either hand on the analogue clock and watch the digital time change.</p>
      </header>

      <main className="clock-play-layout">
        <section className="clock-play-panel clock-play-analog-panel">
          <h2>Analogue Clock</h2>
          <div className="clock-play-face-wrap">
            <AnalogClock time={time} onTimeChange={setTime} />
          </div>
          <div className="clock-play-hand-legend">
            <span><i className="clock-play-legend-hour" /> Hour hand</span>
            <span><i className="clock-play-legend-minute" /> Minute hand</span>
          </div>
          <p className="clock-play-hint">Drag the hour hand or minute hand to change the time.</p>
        </section>

        <section className="clock-play-panel clock-play-digital-panel" aria-live="polite">
          <h2>Digital Clock</h2>
          <div className="clock-play-digital-shell">
            <div className="clock-play-digital-screen">
              <span className="clock-play-digital-time">{formatDigitalTime(time)}</span>
              <span className="clock-play-digital-label">HOUR : MINUTE</span>
            </div>
            <div className="clock-play-digital-indicator">
              <span /> POWER
            </div>
          </div>
          <p className="clock-play-digital-caption">The digital clock updates automatically with the analogue clock.</p>
        </section>
      </main>
    </div>
  );
}
