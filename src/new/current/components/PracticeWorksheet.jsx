
import { useState } from "react";
import "./PracticeWorksheet.css";

const QUESTION_TYPES = [
  "before",
  "after",
  "between",
  "smallest",
  "biggest",
  "ascending",
  "descending",
];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = (items) => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const getUniqueNumbers = (count, maxNumber) => {
  const numbers = [];

  while (numbers.length < count) {
    const number = randomInt(1, maxNumber);

    if (!numbers.includes(number)) {
      numbers.push(number);
    }
  }

  return numbers;
};

const LABELS = {
  english: {
    title: "Practice Worksheet",
    description: "Create a printable Number Sense worksheet.",
    count: "How many questions do you want?",
    hint: "Enter any positive whole number.",
    generate: "Generate Worksheet",
    cancel: "Cancel",
    name: "Student Name",
    date: "Date",
    answer: "Answer",
    answerKey: "Answer Key",
    range: "Number Range",
    questions: "Questions",
    print: "Print / Save as PDF",
    before: (n) => `What number comes before ${n}?`,
    after: (n) => `What number comes after ${n}?`,
    between: (a, b) =>
      `What number comes between ${a} and ${b}?`,
    smallest: "Circle the smallest number.",
    biggest: "Circle the biggest number.",
    ascending: "Arrange in ascending order.",
    descending: "Arrange in descending order.",
  },

  // TELUGU OPTION - CHILD-FRIENDLY TENGLISH
  tenglish: {
    title: "Practice Worksheet",
    description: "Number Sense worksheet prepare cheyyandi.",
    count: "Enni questions kavali?",
    hint: "Positive whole number enter cheyyandi.",
    generate: "Worksheet Generate Cheyyandi",
    cancel: "Cancel",
    name: "Student Name",
    date: "Date",
    answer: "Answer",
    answerKey: "Answer Key",
    range: "Number Range",
    questions: "Questions",
    print: "Print / PDF Save Cheyyandi",

    // Updated question wording to match NumberSense.jsx
    before: (n) => `${n} mundu yemi number vastundi?`,
    after: (n) => `${n} taruvata yemi number vastundi?`,
    between: (a, b) =>
      `${a} and ${b} ki madhyalo yemi number vastundi?`,
    smallest: "Veetilo chinna number yedi? Circle cheyyandi.",
    biggest: "Veetilo pedda number yedi? Circle cheyyandi.",
    ascending: "Ascending order lo arrange cheyyandi.",
    descending: "Descending order lo arrange cheyyandi.",
  },
};

const makeQuestion = (type, maxNumber, labels) => {
  if (type === "before") {
    const number = randomInt(2, maxNumber);

    return {
      type,
      prompt: labels.before(number),
      numbers: [],
      answer: String(number - 1),
      signature: `${type}-${number}`,
    };
  }

  if (type === "after") {
    const number = randomInt(1, maxNumber - 1);

    return {
      type,
      prompt: labels.after(number),
      numbers: [],
      answer: String(number + 1),
      signature: `${type}-${number}`,
    };
  }

  if (type === "between") {
    const first = randomInt(1, maxNumber - 2);
    const second = first + 2;

    return {
      type,
      prompt: labels.between(first, second),
      numbers: [],
      answer: String(first + 1),
      signature: `${type}-${first}`,
    };
  }

  const numbers = getUniqueNumbers(3, maxNumber);

  if (type === "smallest" || type === "biggest") {
    const answer =
      type === "smallest"
        ? Math.min(...numbers)
        : Math.max(...numbers);

    return {
      type,
      prompt:
        type === "smallest"
          ? labels.smallest
          : labels.biggest,
      numbers,
      answer: String(answer),
      signature: `${type}-${[...numbers].sort((a, b) => a - b).join("-")}`,
    };
  }

  const sorted = [...numbers].sort((a, b) =>
    type === "ascending" ? a - b : b - a
  );

  return {
    type,
    prompt:
      type === "ascending"
        ? labels.ascending
        : labels.descending,
    numbers,
    answer: sorted.join(", "),
    signature: `${type}-${numbers.join("-")}`,
  };
};

const generateWorksheet = (count, maxNumber, labels) => {
  const questions = [];
  const used = new Set();

  // Shuffle topic order in each group of seven.
  // Every complete group contains all seven types.
  while (questions.length < count) {
    const types = shuffle(QUESTION_TYPES);

    for (const type of types) {
      if (questions.length >= count) break;

      let question = null;

      // Avoid repeating identical questions where possible.
      for (let attempt = 0; attempt < 30; attempt++) {
        const candidate = makeQuestion(type, maxNumber, labels);

        if (!used.has(candidate.signature)) {
          question = candidate;
          break;
        }
      }

      // For very large worksheets, repetition may be unavoidable.
      if (!question) {
        question = makeQuestion(type, maxNumber, labels);
      }

      used.add(question.signature);
      questions.push(question);
    }
  }

  return questions;
};

// Escape text before inserting it into the printable HTML.
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildWorksheetHtml = (questions, maxNumber, labels) => {
  const questionHtml = questions
    .map((question, index) => {
      const numbersHtml = question.numbers.length
        ? `<div class="numbers">
            ${question.numbers
              .map((number) => `<span>${number}</span>`)
              .join("")}
          </div>`
        : "";

      const answerLine =
        question.type === "smallest" ||
        question.type === "biggest"
          ? ""
          : `<div class="answer-line">
              ${escapeHtml(labels.answer)}:
              <span class="blank"></span>
            </div>`;

      return `
        <div class="question">
          <div class="question-title">
            <strong>${index + 1}.</strong>
            <span>${escapeHtml(question.prompt)}</span>
          </div>
          ${numbersHtml}
          ${answerLine}
        </div>
      `;
    })
    .join("");

  const answerHtml = questions
    .map(
      (question, index) => `
        <div class="key-item">
          <strong>${index + 1}.</strong>
          <span>${escapeHtml(question.answer)}</span>
        </div>
      `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Number Sense Practice Worksheet</title>
<style>
  * { box-sizing: border-box; }

  body {
    margin: 0;
    background: #eef3f9;
    color: #172b4d;
    font-family: Arial, sans-serif;
  }

  .toolbar {
    position: sticky;
    top: 0;
    padding: 14px;
    background: #ffffff;
    border-bottom: 1px solid #dce5f0;
    text-align: center;
  }

  .toolbar button {
    background: #2879c8;
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
    font-size: 25px;
    color: #174d85;
  }

  .subtitle {
    text-align: center;
    font-size: 16px;
    margin: 7px 0 20px;
  }

  .student-info {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    font-size: 18px;
    margin-bottom: 18px;
  }

  .details {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    border-top: 1px solid #b6c7da;
    border-bottom: 1px solid #b6c7da;
    padding: 10px 0;
    margin-bottom: 20px;
  }

  .question {
    border: 1px solid #d9e4f0;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 13px;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .question-title {
    display: flex;
    gap: 10px;
    font-size: 20px;
    line-height: 1.5;
  }

  .numbers {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin: 13px 0 7px 25px;
  }

  .numbers span {
    min-width: 48px;
    padding: 9px 12px;
    border: 1px solid #b6c7da;
    border-radius: 7px;
    font-size: 19px;
    text-align: center;
    font-weight: bold;
  }

  .answer-line {
    margin: 15px 0 4px 25px;
    font-size: 14px;
  }

  .blank {
    display: inline-block;
    width: 150px;
    border-bottom: 1px solid #172b4d;
    margin-left: 10px;
    height: 17px;
  }

  .answer-key {
    break-before: page;
    page-break-before: always;
  }

  .key-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 25px;
  }

  .key-item {
    display: flex;
    gap: 12px;
    padding: 10px;
    border-bottom: 1px solid #e0e8f0;
    font-size: 15px;
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

    .toolbar { display: none; }

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
      ${escapeHtml(labels.print)}
    </button>
  </div>

  <section class="page">
    <h1>NUMBER SENSE</h1>
    <p class="subtitle">${escapeHtml(labels.title)}</p>

    <div class="student-info">
      <span>${escapeHtml(labels.name)}: __________________</span>
      <span>${escapeHtml(labels.date)}: __________</span>
    </div>

    <div class="details">
      <span>${escapeHtml(labels.range)}: 1–${maxNumber}</span>
      <span>${escapeHtml(labels.questions)}: ${questions.length}</span>
    </div>

    ${questionHtml}
  </section>

  <section class="page answer-key">
    <h1>${escapeHtml(labels.answerKey)}</h1>
    <p class="subtitle">NUMBER SENSE</p>
    <div class="key-grid">${answerHtml}</div>
  </section>
</body>
</html>`;
};

function PracticeWorksheet({
  language = "english",
  maxNumber = 10,
  onClose,
}) {
  const [questionCount, setQuestionCount] = useState("10");
  const [error, setError] = useState("");

  const labels = LABELS[language] || LABELS.english;

  const generateAndPrint = () => {
    const rawCount = questionCount.trim();
    const count = Number(rawCount);

    if (
      !/^[0-9]+$/.test(rawCount) ||
      !Number.isSafeInteger(count) ||
      count < 1
    ) {
      setError("Please enter a valid positive whole number.");
      return;
    }

    setError("");

    // Open the window directly from the button click.
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setError("Please allow popups for this website to print.");
      return;
    }

    const questions = generateWorksheet(
      count,
      maxNumber,
      labels
    );

    const html = buildWorksheetHtml(
      questions,
      maxNumber,
      labels
    );

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <div
      className="practice-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="practice-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="practice-modal-title"
      >
        <div className="practice-modal-icon">🖨️</div>

        <h2 id="practice-modal-title">{labels.title}</h2>

        <p className="practice-modal-description">
          {labels.description}
        </p>

        <p className="practice-modal-range">
          {labels.range}: 1–{maxNumber}
        </p>

        <label
          htmlFor="practice-question-count"
          className="practice-modal-label"
        >
          {labels.count}
        </label>

        <input
          id="practice-question-count"
          type="number"
          min="1"
          step="1"
          value={questionCount}
          onChange={(event) => {
            setQuestionCount(event.target.value);
            setError("");
          }}
          className="practice-modal-input"
        />

        <p className="practice-modal-hint">{labels.hint}</p>

        {error && (
          <p className="practice-modal-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="practice-generate-button"
          onClick={generateAndPrint}
        >
          🖨️ {labels.generate}
        </button>

        <button
          type="button"
          className="practice-cancel-button"
          onClick={onClose}
        >
          {labels.cancel}
        </button>
      </section>
    </div>
  );
}

export default PracticeWorksheet;
