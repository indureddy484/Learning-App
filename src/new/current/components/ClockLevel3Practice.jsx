
import { useState } from "react";
import "./ClockLevel3Practice.css";

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const formatTime = (hour, minute) =>
  `${hour}:${String(minute).padStart(2, "0")}`;

// Generate unique questions using all 720 possible times.
const generateQuestions = (count) => {
  const allTimes = [];

  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute++) {
      allTimes.push({ hour, minute });
    }
  }

  // Shuffle all 720 times.
  for (let i = allTimes.length - 1; i > 0; i--) {
    const j = randomInt(0, i);

    [allTimes[i], allTimes[j]] = [
      allTimes[j],
      allTimes[i],
    ];
  }

  return allTimes.slice(0, count);
};

// Generate an analogue clock SVG for printing.
const createClockSvg = (hour, minute) => {
  const center = 150;

  const getPoint = (angle, length) => {
    const radians = (angle * Math.PI) / 180;

    return {
      x: center + length * Math.sin(radians),
      y: center - length * Math.cos(radians),
    };
  };

  const minuteEnd = getPoint(minute * 6, 91);

  const hourEnd = getPoint(
    (hour % 12) * 30 + minute * 0.5,
    65
  );

  const ticks = Array.from({ length: 60 }, (_, index) => {
    const angle = index * 6;
    const isMajor = index % 5 === 0;

    const start = getPoint(angle, isMajor ? 112 : 117);
    const end = getPoint(angle, isMajor ? 122 : 121);

    return `
      <line
        x1="${start.x}"
        y1="${start.y}"
        x2="${end.x}"
        y2="${end.y}"
        stroke="${isMajor ? "#52647b" : "#aab7c7"}"
        stroke-width="${isMajor ? 2.1 : 1}"
        stroke-linecap="round"
      />
    `;
  }).join("");

  const numbers = Array.from({ length: 12 }, (_, index) => {
    const number = index + 1;
    const point = getPoint(number * 30, 91);

    return `
      <text
        x="${point.x}"
        y="${point.y}"
        text-anchor="middle"
        dominant-baseline="central"
        fill="#263a56"
        font-size="17"
        font-weight="bold"
        font-family="Arial, sans-serif"
      >
        ${number}
      </text>
    `;
  }).join("");

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 300"
      class="worksheet-clock"
    >
      <circle
        cx="150"
        cy="150"
        r="139"
        fill="#ffffff"
        stroke="#d8e4f2"
        stroke-width="5"
      />

      <circle
        cx="150"
        cy="150"
        r="124"
        fill="#fffefa"
        stroke="#edf1f6"
        stroke-width="1.5"
      />

      ${ticks}
      ${numbers}

      <line
        x1="150"
        y1="150"
        x2="${hourEnd.x}"
        y2="${hourEnd.y}"
        stroke="#315d9b"
        stroke-width="5"
        stroke-linecap="round"
      />

      <line
        x1="150"
        y1="150"
        x2="${minuteEnd.x}"
        y2="${minuteEnd.y}"
        stroke="#e05c54"
        stroke-width="3.5"
        stroke-linecap="round"
      />

      <circle
        cx="150"
        cy="150"
        r="6"
        fill="#243b5b"
        stroke="#ffffff"
        stroke-width="1.5"
      />
    </svg>
  `;
};

// Build printable worksheet HTML.
const buildWorksheetHtml = (questions) => {
  const questionHtml = questions
    .map(
      (question, index) => `
        <div class="question">
          <div class="question-number">
            Question ${index + 1}
          </div>

          ${createClockSvg(question.hour, question.minute)}

          <div class="answer-line">
            My answer: __________________
          </div>
        </div>
      `
    )
    .join("");

  const answerHtml = questions
    .map(
      (question, index) => `
        <div class="answer-item">
          <strong>${index + 1}.</strong>
          <span>
            ${formatTime(question.hour, question.minute)}
          </span>
        </div>
      `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>Clock Level 3 Practice Worksheet</title>

<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #eef3f9;
    color: #263b5c;
    font-family: Arial, sans-serif;
  }

  .toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 14px;
    background: white;
    border-bottom: 1px solid #dce5f0;
    text-align: center;
  }

  .toolbar button {
    background: #3288ca;
    color: white;
    border: none;
    padding: 12px 22px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    margin: 20px auto;
    padding: 15mm;
    background: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }

  h1 {
    margin: 0;
    text-align: center;
    color: #245d91;
    font-size: 28px;
  }

  .subtitle {
    text-align: center;
    color: #71809a;
    font-size: 16px;
    margin: 8px 0 25px;
  }

  .student-info {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    font-size: 15px;
    margin-bottom: 22px;
  }

  .range-info {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #b6c7da;
    border-bottom: 1px solid #b6c7da;
    padding: 12px 0;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .question-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .question {
    border: 1px solid #d9e4f0;
    border-radius: 10px;
    padding: 12px 8px;
    text-align: center;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .question-number {
    color: #3288ca;
    font-weight: bold;
    font-size: 15px;
    margin-bottom: 4px;
  }

  .worksheet-clock {
    display: block;
    width: 100%;
    max-width: 175px;
    height: auto;
    margin: 0 auto;
  }

  .answer-line {
    margin-top: 5px;
    font-size: 13px;
    color: #415773;
  }

  .answer-key {
    break-before: page;
    page-break-before: always;
  }

  .answer-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 25px;
  }

  .answer-item {
    padding: 14px;
    border: 1px solid #dce5f0;
    border-radius: 8px;
    font-size: 17px;
    display: flex;
    gap: 12px;
    break-inside: avoid;
  }

  @page {
    size: A4;
    margin: 10mm;
  }

  @media print {
    body {
      background: white;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .toolbar {
      display: none;
    }

    .page {
      width: auto;
      min-height: 0;
      margin: 0;
      padding: 0;
      box-shadow: none;
    }

    .answer-key {
      break-before: page;
      page-break-before: always;
    }
  }

  @media screen and (max-width: 850px) {
    .page {
      width: 100%;
      min-height: 0;
      padding: 20px;
      margin: 10px 0;
    }
  }
</style>
</head>

<body>
  <div class="toolbar">
    <button onclick="window.print()">
      Print / Save as PDF
    </button>
  </div>

  <section class="page">
    <h1>CLOCK PRACTICE</h1>

    <p class="subtitle">
      Read the clock and write the correct time.
    </p>

    <div class="student-info">
      <span>Name: __________________</span>
      <span>Date: __________</span>
    </div>

    <div class="range-info">
      <span>Level: 3</span>
      <span>Questions: ${questions.length}</span>
    </div>

    <div class="question-grid">
      ${questionHtml}
    </div>
  </section>

  <section class="page answer-key">
    <h1>ANSWER KEY</h1>

    <p class="subtitle">
      Clock Level 3 Practice
    </p>

    <div class="answer-grid">
      ${answerHtml}
    </div>
  </section>
</body>
</html>`;
};

function ClockLevel3Practice({ onClose }) {
  const [questionCount, setQuestionCount] = useState("10");
  const [error, setError] = useState("");

  const generateAndPrint = () => {
    const rawCount = questionCount.trim();
    const count = Number(rawCount);

    if (
      !/^[0-9]+$/.test(rawCount) ||
      !Number.isSafeInteger(count) ||
      count < 1 ||
      count > 100
    ) {
      setError("Enter a whole number between 1 and 100.");
      return;
    }

    // Open print window directly from the click event.
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setError("Please allow popups to print the worksheet.");
      return;
    }

    const questions = generateQuestions(count);
    const html = buildWorksheetHtml(questions);

    setError("");

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <div
      className="clock-worksheet-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="clock-worksheet-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="clock-worksheet-title"
      >
        <div className="clock-worksheet-icon">🕒</div>

        <h2 id="clock-worksheet-title">
          Clock Practice Worksheet
        </h2>

        <p className="clock-worksheet-description">
          Create a printable clock-reading worksheet.
        </p>

        <div className="clock-worksheet-range">
          Level 3 · All minute values
        </div>

        <label htmlFor="clock-question-count">
          How many questions do you want?
        </label>

        <input
          id="clock-question-count"
          type="number"
          min="1"
          max="100"
          step="1"
          value={questionCount}
          onChange={(event) => {
            setQuestionCount(event.target.value);
            setError("");
          }}
        />

        <p className="clock-worksheet-hint">
          Enter a number between 1 and 100.
        </p>

        {error && (
          <p className="clock-worksheet-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="clock-worksheet-generate"
          onClick={generateAndPrint}
        >
          🖨️ Generate Worksheet
        </button>

        <button
          type="button"
          className="clock-worksheet-cancel"
          onClick={onClose}
        >
          Cancel
        </button>
      </section>
    </div>
  );
}

export default ClockLevel3Practice;
