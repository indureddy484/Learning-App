
import React, { useState } from "react";
import "./AnimalsPracticeWorksheet.css";

// =========================================
// ANIMAL DATA
// =========================================

const ANIMAL_GROUPS = {
  "Pet Animals": [
    { name: "Rabbit", image: "/images/animals/pet/rabbit.jpg" },
    { name: "Dog", image: "/images/animals/farm/dog.jpg" },
  ],

  "Farm Animals": [
    { name: "Buffalo", image: "/images/animals/farm/buffalo.jpg" },
    { name: "Goat", image: "/images/animals/farm/goat.jpg" },
    { name: "Sheep", image: "/images/animals/farm/sheep.jpg" },
    { name: "Camel", image: "/images/animals/farm/camel.jpg" },
    { name: "Horse", image: "/images/animals/farm/horse.jpg" },
    { name: "Cow", image: "/images/animals/farm/cow.png" },
  ],

  "Wild Animals": [
    { name: "Bear", image: "/images/animals/wild/bear.jpg" },
    { name: "Elephant", image: "/images/animals/wild/elephant.jpg" },
    { name: "Zebra", image: "/images/animals/wild/zebra.jpg" },
    { name: "Tiger", image: "/images/animals/wild/tiger.jpg" },
    { name: "Giraffe", image: "/images/animals/wild/giraffe.jpg" },
  ],

  "Water Animals": [
    { name: "Octopus", image: "/images/animals/water/octopus.jpg" },
    { name: "Crab", image: "/images/animals/water/crab.jpg" },
    { name: "Dolphin", image: "/images/animals/water/dolphin.jpg" },
    { name: "Jellyfish", image: "/images/animals/water/jellyfish.jpg" },
    { name: "Oyster", image: "/images/animals/water/oyster.jpg" },
    { name: "Seahorse", image: "/images/animals/water/seahorse.jpg" },
  ],

  Birds: [
    { name: "Toucan", image: "/images/animals/birds/toucans.jpg" },
    { name: "Goose", image: "/images/animals/birds/goose.jpg" },
    { name: "Quail", image: "/images/animals/birds/quail.jpg" },
    { name: "Kiwi", image: "/images/animals/birds/kiwi.jpg" },
    { name: "Owl", image: "/images/animals/birds/owl.jpg" },
  ],
};

const CATEGORIES = Object.keys(ANIMAL_GROUPS);

const PROMPTS = {
  "Pet Animals": "Which one is a pet animal?",
  "Farm Animals": "Which one is a farm animal?",
  "Wild Animals": "Which one is a wild animal?",
  "Water Animals": "Which one is a water animal?",
  Birds: "Which one is a bird?",
};

const LETTERS = ["a", "b", "c", "d"];

// =========================================
// HELPER FUNCTIONS
// =========================================

const shuffle = (items) => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// =========================================
// CREATE QUESTIONS
// =========================================

const createQuestion = (category, number, level) => {
  const correct = shuffle(ANIMAL_GROUPS[category])[0];

  const distractors = CATEGORIES
    .filter((item) => item !== category)
    .flatMap((item) => ANIMAL_GROUPS[item]);

  const options = shuffle([
    correct,
    ...shuffle(distractors).slice(0, 3),
  ]).map((animal, index) => ({
    ...animal,
    label: LETTERS[index],
  }));

  return {
    number,
    category,
    level,
    prompt: PROMPTS[category],
    options,
    answer: options.find(
      (item) => item.name === correct.name
    ),
  };
};

// =========================================
// GENERATE WORKSHEET QUESTIONS
// =========================================

const generateQuestions = (count, level) => {
  const questions = [];

  while (questions.length < count) {
    const categoryOrder = shuffle(CATEGORIES);

    for (const category of categoryOrder) {
      if (questions.length >= count) break;

      questions.push(
        createQuestion(
          category,
          questions.length + 1,
          level
        )
      );
    }
  }

  return questions;
};

// =========================================
// BUILD PRINTABLE HTML
// =========================================

const buildWorksheetHtml = (questions, level) => {
  const isLevel2 = level === "level2";

  const questionHtml = questions
    .map((question) => {
      const optionsHtml = question.options
        .map((option) => {
          if (isLevel2) {
            return `
              <div class="option text-option">
                <span class="letter">${option.label})</span>
                <strong>${escapeHtml(option.name.toLowerCase())}</strong>
              </div>
            `;
          }

          return `
            <div class="option">
              <span class="letter">${option.label}.</span>
              <img
                src="${escapeHtml(option.image)}"
                alt="${escapeHtml(option.name)}"
              />
              <strong>${escapeHtml(option.name)}</strong>
            </div>
          `;
        })
        .join("");

      return `
        <article class="question">
          <h3>
            ${question.number}. ${escapeHtml(question.prompt)}
          </h3>

          <div class="options ${isLevel2 ? "text-options" : ""}">
            ${optionsHtml}
          </div>
        </article>
      `;
    })
    .join("");

  const answerHtml = questions
    .map(
      (question) => `
        <div class="answer-item">
          <strong>${question.number}.</strong>
          <span>
            ${question.answer.label})
            ${escapeHtml(
              isLevel2
                ? question.answer.name.toLowerCase()
                : question.answer.name
            )}
          </span>
        </div>
      `
    )
    .join("");

  const levelTitle = isLevel2
    ? "LEVEL 2 – TEXT IDENTIFICATION"
    : "LEVEL 1 – PICTURE IDENTIFICATION";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Animals Practice Worksheet - ${levelTitle}</title>

<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #eef3f9;
    color: #263653;
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
    background: #287fc8;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 9px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    margin: 20px auto;
    padding: 12mm;
    background: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }

  h1 {
    margin: 0;
    text-align: center;
    color: #174d85;
    font-size: 25px;
  }

  .subtitle {
    text-align: center;
    color: #66738d;
    margin: 8px 0 22px;
  }

  .student-info {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 18px;
    font-size: 14px;
  }

  .details {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 0;
    margin-bottom: 18px;
    border-top: 1px solid #cbd7e6;
    border-bottom: 1px solid #cbd7e6;
    font-size: 12px;
  }

  .question {
    border: 1px solid #d9e4f0;
    border-radius: 9px;
    padding: 12px;
    margin-bottom: 13px;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .question h3 {
    margin: 0 0 12px;
    color: #294a7c;
    font-size: 15px;
  }

  .options {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 9px;
  }

  .option {
    min-width: 0;
    min-height: 115px;
    border: 1px solid #e0e7f1;
    border-radius: 7px;
    padding: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    text-align: center;
    font-size: 12px;
  }

  .letter {
    align-self: flex-start;
    color: #40588f;
    font-weight: bold;
    text-transform: lowercase;
  }

  .option img {
    width: 100%;
    height: 75px;
    object-fit: contain;
  }

  .option strong {
    color: #34466e;
  }

  /* LEVEL 2 TEXT OPTIONS */

  .text-options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .text-option {
    min-height: 55px;
    flex-direction: row;
    justify-content: flex-start;
    padding: 12px 18px;
    gap: 15px;
    font-size: 16px;
  }

  .text-option .letter {
    font-size: 16px;
  }

  .text-option strong {
    font-size: 16px;
    text-transform: lowercase;
  }

  .answer-key {
    break-before: page;
    page-break-before: always;
  }

  .answer-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 25px;
  }

  .answer-item {
    display: flex;
    gap: 12px;
    padding: 11px;
    border-bottom: 1px solid #e0e8f0;
    font-size: 15px;
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
      display: none !important;
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
      padding: 18px;
      margin: 10px 0;
    }

    .options {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
</head>

<body>
  <div class="toolbar">
    <button onclick="window.print()">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <section class="page">
    <h1>ANIMALS</h1>

    <p class="subtitle">
      Practice Worksheet – ${levelTitle}
    </p>

    <div class="student-info">
      <span>Name: _______________________</span>
      <span>Date: ______________</span>
    </div>

    <div class="details">
      <span>
        Topics: Pet, Farm, Wild, Water Animals and Birds
      </span>
      <span>Questions: ${questions.length}</span>
    </div>

    ${questionHtml}
  </section>

  <section class="page answer-key">
    <h1>ANSWER KEY</h1>

    <p class="subtitle">
      Animals Practice Worksheet – ${levelTitle}
    </p>

    <div class="answer-grid">
      ${answerHtml}
    </div>
  </section>
</body>
</html>`;
};

// =========================================
// MAIN WORKSHEET COMPONENT
// =========================================

function AnimalsPracticeWorksheet({
  onClose,
  selectedLevel = "level1",
}) {
  const [questionCount, setQuestionCount] = useState("10");
  const [error, setError] = useState("");

  const isLevel2 = selectedLevel === "level2";

  const generateAndPrint = () => {
    const rawCount = questionCount.trim();
    const count = Number(rawCount);

    if (
      !/^[0-9]+$/.test(rawCount) ||
      !Number.isSafeInteger(count) ||
      count < 1 ||
      count > 50
    ) {
      setError("Please enter a whole number between 1 and 50.");
      return;
    }

    setError("");

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setError("Please allow popups for this website.");
      return;
    }

    const questions = generateQuestions(count, selectedLevel);
    const html = buildWorksheetHtml(questions, selectedLevel);

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  };

  return (
    <div
      className="aq-worksheet-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="aq-worksheet-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aq-worksheet-modal-title"
      >
        <div className="aq-worksheet-modal-icon">🐾</div>

        <h2 id="aq-worksheet-modal-title">
          Animals Practice Worksheet
        </h2>

        <p className="aq-worksheet-modal-description">
          {isLevel2
            ? "Generate a text-based worksheet with four written options for every question."
            : "Generate a picture-based worksheet with four animal pictures for every question."}
        </p>

        <div className="aq-selected-worksheet-level">
          {isLevel2
            ? "Level 2 – Text Identification"
            : "Level 1 – Picture Identification"}
        </div>

        <label htmlFor="aq-question-count">
          How many questions do you want?
        </label>

        <input
          id="aq-question-count"
          type="number"
          min="1"
          max="50"
          step="1"
          value={questionCount}
          onChange={(event) => {
            setQuestionCount(event.target.value);
            setError("");
          }}
        />

        <p className="aq-worksheet-modal-hint">
          Enter a number between 1 and 50.
        </p>

        {error && (
          <p className="aq-worksheet-modal-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="aq-worksheet-generate"
          onClick={generateAndPrint}
        >
          🖨️ Generate Worksheet
        </button>

        <button
          type="button"
          className="aq-worksheet-cancel"
          onClick={onClose}
        >
          Cancel
        </button>
      </section>
    </div>
  );
}

export default AnimalsPracticeWorksheet;
