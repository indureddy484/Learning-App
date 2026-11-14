
import { useState } from "react";
import "./SubtractionPracticeWorksheet.css";

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateQuestions = (count, maxDifference) => {
  const questions = [];

  for (let i = 0; i < count; i++) {
    const first = randomInt(1, maxDifference - 1);
    const second = randomInt(0, first);

    questions.push({
      first,
      second,
      answer: first - second,
    });
  }

  return questions;
};

const buildWorksheetHtml = (questions, maxDifference) => {
  const questionHtml = questions
    .map(
      (question, index) => `
        <div class="question">
          <div class="question-text">
            <strong>${index + 1}.</strong>
            <span>${question.first} - ${question.second} = ______</span>
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
          <span>${question.first} - ${question.second} = ${question.answer}</span>
        </div>
      `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Subtraction Practice Worksheet</title>

<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #f3effa;
    color: #3d3158;
    font-family: Arial, sans-serif;
  }

  .toolbar {
    position: sticky;
    top: 0;
    padding: 14px;
    background: white;
    border-bottom: 1px solid #e2d8f2;
    text-align: center;
  }

  .toolbar button {
    background: #7046bd;
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
    padding: 17mm;
    background: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }

  h1 {
    margin: 0;
    text-align: center;
    color: #7046bd;
    font-size: 28px;
  }

  .subtitle {
    text-align: center;
    color: #85779d;
    font-size: 16px;
    margin: 8px 0 25px;
  }

  .student-info {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    font-size: 16px;
    margin-bottom: 22px;
  }

  .range-info {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #d5c7eb;
    border-bottom: 1px solid #d5c7eb;
    padding: 12px 0;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .question {
    border: 1px solid #e2d8f2;
    border-radius: 10px;
    padding: 19px;
    margin-bottom: 14px;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .question-text {
    display: flex;
    gap: 15px;
    align-items: center;
    font-size: 25px;
    line-height: 1.5;
  }

  .question-text strong {
    color: #7046bd;
  }

  .answer-key {
    break-before: page;
    page-break-before: always;
  }

  .answer-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 25px;
  }

  .answer-item {
    padding: 13px;
    border-bottom: 1px solid #e2d8f2;
    font-size: 17px;
    display: flex;
    gap: 12px;
    break-inside: avoid;
  }

  @page {
    size: A4;
    margin: 12mm;
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

    .question-text {
      font-size: 21px;
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
    <h1>SUBTRACTION PRACTICE</h1>
    <p class="subtitle">Solve the subtraction questions</p>

    <div class="student-info">
      <span>Name: __________________</span>
      <span>Date: __________</span>
    </div>

    <div class="range-info">
      <span>Difference Range: &lt;${maxDifference}</span>
      <span>Questions: ${questions.length}</span>
    </div>

    ${questionHtml}
  </section>

  <section class="page answer-key">
    <h1>ANSWER KEY</h1>
    <p class="subtitle">Subtraction Practice</p>
    <div class="answer-grid">
      ${answerHtml}
    </div>
  </section>
</body>
</html>`;
};

function SubtractionPracticeWorksheet({
  maxDifference = 10,
  onClose,
}) {
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

    if (
      !Number.isSafeInteger(maxDifference) ||
      maxDifference < 3
    ) {
      setError("The subtraction range must be at least 3.");
      return;
    }

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setError("Please allow popups to print the worksheet.");
      return;
    }

    setError("");

    const questions = generateQuestions(count, maxDifference);
    const html = buildWorksheetHtml(questions, maxDifference);

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <div
      className="subtraction-worksheet-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="subtraction-worksheet-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subtraction-worksheet-title"
      >
        <div className="subtraction-worksheet-icon">🖨️</div>

        <h2 id="subtraction-worksheet-title">
          Subtraction Practice Worksheet
        </h2>

        <p className="subtraction-worksheet-description">
          Create a printable subtraction worksheet for practice.
        </p>

        <div className="subtraction-worksheet-range">
          Difference Range: &lt;{maxDifference}
        </div>

        <label htmlFor="subtraction-question-count">
          How many questions do you want?
        </label>

        <input
          id="subtraction-question-count"
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

        <p className="subtraction-worksheet-hint">
          Enter a number between 1 and 100.
        </p>

        {error && (
          <p className="subtraction-worksheet-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="subtraction-worksheet-generate"
          onClick={generateAndPrint}
        >
          🖨️ Generate Worksheet
        </button>

        <button
          type="button"
          className="subtraction-worksheet-cancel"
          onClick={onClose}
        >
          Cancel
        </button>
      </section>
    </div>
  );
}

export default SubtractionPracticeWorksheet;
