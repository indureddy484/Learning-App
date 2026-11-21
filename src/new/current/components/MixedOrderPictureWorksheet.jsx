
import React, { useState } from "react";
import "./MixedOrderPictureWorksheet.css";

// =====================================
// SHUFFLE HELPER
// =====================================

function shuffleItems(items) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// =====================================
// QUESTION INSTRUCTIONS
// =====================================

function getInstruction(type) {
  const instructions = {
    ascending: "Arrange from Smallest to Biggest",
    descending: "Arrange from Biggest to Smallest",
    biggest: "Circle the Biggest picture",
    smallest: "Circle the Smallest picture",
  };

  return instructions[type] || "";
}

// =====================================
// CORRECT ANSWERS
// =====================================

function getCorrectAnswer(question) {
  const items = [...question.originalItems];

  if (question.type === "ascending") {
    return items.sort((a, b) => a.order - b.order);
  }

  if (question.type === "descending") {
    return items.sort((a, b) => b.order - a.order);
  }

  if (question.type === "biggest") {
    return [
      items.reduce((largest, item) =>
        item.order > largest.order ? item : largest
      ),
    ];
  }

  if (question.type === "smallest") {
    return [
      items.reduce((smallest, item) =>
        item.order < smallest.order ? item : smallest
      ),
    ];
  }

  return [];
}

// =====================================
// QUESTION TYPE LABEL
// =====================================

function getTypeLabel(type) {
  const labels = {
    ascending: "Smallest to Biggest",
    descending: "Biggest to Smallest",
    biggest: "Biggest Picture",
    smallest: "Smallest Picture",
  };

  return labels[type] || type;
}

// =====================================
// CREATE WORKSHEET QUESTIONS
// =====================================

function createWorksheetQuestions(imageCollections, count) {
  const questionPool = [];

  imageCollections.forEach((collection) => {
    ["ascending", "descending", "biggest", "smallest"].forEach((type) => {
      questionPool.push({
        id: `${collection.id}_${type}`,
        type,
        items: [...collection.items],
        originalItems: [...collection.items],
      });
    });
  });

  if (questionPool.length === 0) return [];

  let selected = [];

  while (selected.length < count) {
    selected = selected.concat(shuffleItems(questionPool));
  }

  return selected.slice(0, count).map((question, index) => ({
    ...question,
    id: `${question.id}_${index + 1}`,
    questionNumber: index + 1,
    items: shuffleItems(question.items),
  }));
}

// =====================================
// ESCAPE HTML
// =====================================

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// =====================================
// BUILD QUESTION HTML
// =====================================

function buildQuestionHTML(selectedQuestions) {
  return selectedQuestions
    .map((question) => {
      const isOrderQuestion =
        question.type === "ascending" ||
        question.type === "descending";

      const picturesHTML = question.items
        .map(
          (item, index) => `
            <div class="picture-choice">

              <div class="picture-stage">
                <img
                  src="${escapeHtml(item.image)}"
                  alt="Picture ${String.fromCharCode(65 + index)}"
                  style="height:${Math.min(
                    Number(item.size) || 100,
                    145
                  )}px"
                />
              </div>

              <span>${String.fromCharCode(65 + index)}</span>

              ${
                !isOrderQuestion
                  ? '<div class="circle-space"></div>'
                  : ""
              }

            </div>
          `
        )
        .join("");

      const answerSlotsHTML = isOrderQuestion
        ? `
            <div class="answer-heading">
              Write the letters in the correct order:
            </div>

            <div class="answer-slots">
              ${[1, 2, 3, 4]
                .map(
                  (number) => `
                    <div class="answer-item">
                      <span class="answer-number">${number}</span>
                      <div class="answer-slot"></div>
                    </div>
                  `
                )
                .join("")}
            </div>
          `
        : `
            <div class="circle-instruction">
              Circle the correct picture above.
            </div>
          `;

      return `
        <section class="question-card">

          <div class="question-heading">
            <strong>Question ${question.questionNumber}.</strong>
            <span>${getInstruction(question.type)}</span>
          </div>

          <div class="picture-choices">
            ${picturesHTML}
          </div>

          ${answerSlotsHTML}

        </section>
      `;
    })
    .join("");
}

// =====================================
// BUILD ANSWER KEY HTML
// =====================================

function buildAnswerHTML(selectedQuestions) {
  return selectedQuestions
    .map((question) => {
      const answers = getCorrectAnswer(question);

      const isOrderQuestion =
        question.type === "ascending" ||
        question.type === "descending";

      const answerPictures = answers
        .map((item, index) => {
          const originalIndex = question.items.findIndex(
            (questionItem) => questionItem.id === item.id
          );

          const letter = String.fromCharCode(65 + originalIndex);

          return `
            <div class="answer-picture">

              <div class="picture-stage">
                <img
                  src="${escapeHtml(item.image)}"
                  alt="Correct answer"
                  style="height:${Math.min(
                    Number(item.size) || 75,
                    90
                  )}px"
                />
              </div>

              <span>
                ${isOrderQuestion ? `${index + 1}. ${letter}` : ""}
              </span>

              ${
                !isOrderQuestion
                  ? `<strong>${
                      question.type === "biggest"
                        ? "Biggest"
                        : "Smallest"
                    }</strong>`
                  : ""
              }

            </div>
          `;
        })
        .join("");

      const answerDescription = isOrderQuestion
        ? `Answer: ${answers
            .map((item) => {
              const originalIndex = question.items.findIndex(
                (questionItem) => questionItem.id === item.id
              );

              return String.fromCharCode(65 + originalIndex);
            })
            .join(" → ")}`
        : `Correct answer: ${
            question.type === "biggest" ? "Biggest picture" : "Smallest picture"
          }`;

      return `
        <section class="answer-card">

          <div class="question-heading">
            <strong>Question ${question.questionNumber}.</strong>
            <span>${answerDescription}</span>
          </div>

          <div class="answer-pictures">
            ${answerPictures}
          </div>

        </section>
      `;
    })
    .join("");
}

// =====================================
// BUILD COMPLETE PRINT DOCUMENT
// =====================================

function buildWorksheetDocument(selectedQuestions) {
  const questionHTML = buildQuestionHTML(selectedQuestions);
  const answerHTML = buildAnswerHTML(selectedQuestions);

  return `
<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Mixed Order Practice Worksheet</title>

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

    /* PRINT TOOLBAR */

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 2;
      padding: 14px;
      background: #fff;
      border-bottom: 1px solid #dce5f0;
      text-align: center;
    }

    .toolbar button {
      background: #3288ca;
      color: #fff;
      border: 0;
      padding: 12px 22px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
    }

    .toolbar button:hover {
      background: #2475b5;
    }

    /* A4 PAGE */

    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 20px auto;
      padding: 14mm;
      background: #fff;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    /* HEADER */

    .worksheet-header {
      text-align: center;
      margin-bottom: 22px;
    }

    .worksheet-header h1 {
      margin: 0;
      text-align: center;
      color: #245d91;
      font-size: 27px;
    }

    .subtitle {
      text-align: center;
      color: #71809a;
      margin: 7px 0 22px;
      font-size: 16px;
    }

    /* STUDENT DETAILS */

    .student-info {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-bottom: 18px;
      font-size: 14px;
    }

    .worksheet-info {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 0;
      margin-bottom: 15px;
      border-top: 1px solid #b6c7da;
      border-bottom: 1px solid #b6c7da;
      font-size: 13px;
    }

    /* QUESTION CARDS */

    .question-card,
    .answer-card {
      border: 1px solid #d9e4f0;
      border-radius: 9px;
      padding: 12px;
      margin-bottom: 12px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    /* QUESTION NUMBER AND INSTRUCTION */

    .question-heading {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 14px;
      flex-wrap: wrap;
    }

    .question-heading strong {
      color: #245d91;
      font-size: 15px;
      font-weight: 800;
      white-space: nowrap;
    }

    .question-heading span {
      color: #536782;
      font-size: 13px;
      font-weight: 600;
      text-align: left;
    }

    /* PICTURE CHOICES */

    .picture-choices,
    .answer-pictures {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
    }

    .picture-choice,
    .answer-picture {
      min-width: 0;
      border: 1px solid #dce5f0;
      border-radius: 7px;
      padding: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }

    .picture-stage {
      width: 100%;
      height: 105px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      overflow: hidden;
    }

    .picture-stage img {
      display: block;
      max-width: 100%;
      max-height: 100%;
      width: auto;
      object-fit: contain;
      object-position: center bottom;
    }

    .picture-choice > span,
    .answer-picture > span {
      display: block;
      padding-top: 4px;
      font-weight: 700;
      color: #245d91;
      font-size: 13px;
    }

    /* CIRCLE SPACE */

    .circle-space {
      width: 18px;
      height: 18px;
      border: 1.5px solid #9fb1c8;
      border-radius: 50%;
      margin: 5px 0;
    }

    .circle-instruction {
      margin-top: 10px;
      color: #536782;
      font-size: 12px;
      font-weight: 700;
    }

    /* ANSWER BOXES */

    .answer-heading {
      margin: 11px 0 7px;
      color: #536782;
      font-size: 12px;
      font-weight: 700;
    }

    .answer-slots {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
    }

    .answer-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      min-width: 0;
    }

    .answer-number {
      font-size: 14px;
      font-weight: 700;
      color: #3288ca;
    }

    .answer-slot {
      width: 100%;
      height: 35px;
      border: 1px dashed #9fb1c8;
      border-radius: 6px;
      background: #fff;
    }

    /* ANSWER KEY */

    .answer-key {
      break-before: page;
      page-break-before: always;
    }

    .answer-key h2 {
      text-align: center;
      color: #245d91;
      font-size: 25px;
      margin: 0 0 20px;
    }

    .answer-card .picture-stage {
      height: 115px;
    }

    .answer-picture {
      justify-content: center;
      gap: 5px;
    }

    .answer-picture strong {
      color: #245d91;
      font-size: 12px;
    }

    /* A4 PRINTING */

    @page {
      size: A4;
      margin: 10mm;
    }

    @media print {

      body {
        background: #fff;
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

    /* MOBILE PREVIEW */

    @media screen and (max-width: 850px) {

      .page {
        width: 100%;
        min-height: 0;
        padding: 18px;
        margin: 10px 0;
      }

      .question-heading {
        justify-content: flex-start;
        flex-direction: row;
        align-items: center;
      }
    }

  </style>

</head>

<body>

  <!-- PRINT TOOLBAR -->

  <div class="toolbar">
    <button onclick="window.print()">
      Print / Save as PDF
    </button>
  </div>

  <!-- WORKSHEET PAGE -->

  <section class="page">

    <div class="worksheet-header">

      <h1>MIXED ORDER</h1>

      <p class="subtitle">
        Picture Practice Worksheet
      </p>

    </div>

    <div class="student-info">

      <span>Name: __________________________</span>

      <span>Date: ________________</span>

    </div>

    <div class="worksheet-info">

      <span>
        Look carefully at the pictures and answer the questions.
      </span>

      <span>
        Questions: ${selectedQuestions.length}
      </span>

    </div>

    ${questionHTML}

  </section>

  <!-- ANSWER KEY PAGE -->

  <section class="page answer-key">

    <h2>ANSWER KEY</h2>

    <p class="subtitle">
      Mixed Order Picture Practice
    </p>

    ${answerHTML}

  </section>

  <script>

    window.onload = function () {

      const images = Array.from(document.images);

      Promise.all(
        images.map((img) => {

          if (img.complete) {
            return Promise.resolve();
          }

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });

        })
      ).then(() => {
        window.print();
      });

    };

  <\/script>

</body>
</html>`;
}

// =====================================
// MAIN WORKSHEET COMPONENT
// =====================================

export default function MixedOrderPictureWorksheet({
  imageCollections = [],
  onClose,
}) {
  const [questionCount, setQuestionCount] = useState("10");
  const [error, setError] = useState("");

  // =====================================
  // GENERATE WORKSHEET
  // =====================================

  function generateWorksheet() {
    const rawCount = questionCount.trim();
    const count = Number(rawCount);

    if (
      !/^\d+$/.test(rawCount) ||
      !Number.isSafeInteger(count) ||
      count < 1 ||
      count > 100
    ) {
      setError("Enter a whole number between 1 and 100.");
      return;
    }

    if (!Array.isArray(imageCollections) || !imageCollections.length) {
      setError("No valid picture collections were found.");
      return;
    }

    const validCollections = imageCollections.filter(
      (collection) =>
        Array.isArray(collection.items) &&
        collection.items.length === 4
    );

    if (!validCollections.length) {
      setError(
        "No valid picture collections with four images were found."
      );
      return;
    }

    const selectedQuestions = createWorksheetQuestions(
      validCollections,
      count
    );

    if (!selectedQuestions.length) {
      setError("Unable to create worksheet questions.");
      return;
    }

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setError("Allow pop-ups in your browser to print the worksheet.");
      return;
    }

    setError("");

    printWindow.document.open();
    printWindow.document.write(
      buildWorksheetDocument(selectedQuestions)
    );
    printWindow.document.close();
    printWindow.focus();
  }

  // =====================================
  // WORKSHEET POPUP UI
  // =====================================

  return (
    <div
      className="aop-worksheet-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        className="aop-worksheet-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mixed-worksheet-title"
      >

        <div className="aop-worksheet-icon">🖨️</div>

        <h2 id="mixed-worksheet-title">
          Mixed Order Worksheet
        </h2>

        <p className="aop-worksheet-description">
          Practice all four activities: ascending order, descending
          order, biggest picture and smallest picture.
        </p>

        <div className="aop-worksheet-range">
          Smallest → Biggest | Biggest → Smallest
        </div>

        <label htmlFor="mixed-worksheet-count">
          How many questions do you want?
        </label>

        <input
          id="mixed-worksheet-count"
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

        <p className="aop-worksheet-hint">
          Enter a number between 1 and 100. Default: 10.
          Questions and pictures are shuffled. The answer key
          is included on a separate page.
        </p>

        {error && (
          <p className="aop-worksheet-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="aop-worksheet-generate"
          onClick={generateWorksheet}
        >
          🖨️ Generate Worksheet
        </button>

        <button
          type="button"
          className="aop-worksheet-cancel"
          onClick={onClose}
        >
          Cancel
        </button>

      </section>
    </div>
  );
}
