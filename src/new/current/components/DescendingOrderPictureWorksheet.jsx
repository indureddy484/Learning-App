
import { useState } from "react";
import "./AscendingOrderPictureWorksheet.css";

// =====================================
// SHUFFLE HELPER
// =====================================

const randomize = (items) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
};

// =====================================
// ESCAPE HTML
// =====================================

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// =====================================
// BUILD WORKSHEET HTML
// =====================================

const buildWorksheetHtml = (questions) => {
  const questionHtml = questions
    .map((question, index) => {
      const choices = question.displayItems
        .map(
          (item, itemIndex) => `
            <div class="picture-choice">

              <div class="picture-stage">
                <img
                  src="${escapeHtml(item.image)}"
                  alt="Picture option ${itemIndex + 1}"
                  style="height:${Math.min(Number(item.size) || 100, 145)}px"
                />
              </div>

              <span>${String.fromCharCode(65 + itemIndex)}</span>

            </div>
          `
        )
        .join("");

      // Numbered empty answer boxes
      const answerSlots = [1, 2, 3, 4]
        .map(
          (position) => `
            <div class="answer-item">
              <span class="answer-number">${position}</span>
              <div class="answer-slot"></div>
            </div>
          `
        )
        .join("");

      return `
        <article class="question-card">

          <div class="question-heading">
            <strong>Question ${index + 1}.</strong>
            <span>Arrange from Biggest to Smallest</span>
          </div>

          <div class="picture-choices">
            ${choices}
          </div>

          <div class="answer-heading">
            Write the letters in the correct order:
          </div>

          <div class="answer-slots">
            ${answerSlots}
          </div>

        </article>
      `;
    })
    .join("");

  // =====================================
  // DESCENDING ORDER ANSWER KEY
  // BIGGEST TO SMALLEST
  // =====================================

  const answerHtml = questions
    .map((question, index) => {
      const orderedItems = [...question.items].sort(
        (a, b) => b.order - a.order
      );

      const answerLetters = orderedItems
        .map((item) =>
          String.fromCharCode(
            65 +
              question.displayItems.findIndex(
                (choice) => choice.id === item.id
              )
          )
        )
        .join(" → ");

      const orderedPictures = orderedItems
        .map(
          (item, position) => `
            <div class="answer-picture">

              <div class="picture-stage">
                <img
                  src="${escapeHtml(item.image)}"
                  alt="Correct position ${position + 1}"
                  style="height:${Math.min(Number(item.size) || 100, 145)}px"
                />
              </div>

              <span>${position + 1}</span>

            </div>
          `
        )
        .join("");

      return `
        <article class="answer-card">

          <div class="question-heading">
            <strong>Question ${index + 1}.</strong>
            <span>Answer: ${answerLetters}</span>
          </div>

          <div class="picture-choices">
            ${orderedPictures}
          </div>

        </article>
      `;
    })
    .join("");

  // =====================================
  // COMPLETE HTML DOCUMENT
  // =====================================

  return `<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>Descending Order Picture Worksheet</title>

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
    box-shadow: 0 4px 20px rgba(0,0,0,.08);
  }

  /* HEADER */

  h1 {
    margin: 0;
    text-align: center;
    color: #245d91;
    font-size: 27px;
  }

  .subtitle {
    text-align: center;
    color: #71809a;
    margin: 7px 0 22px;
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

  /* BOLD QUESTION NUMBER */

  .question-heading strong {
    color: #245d91;
    font-size: 15px;
    font-weight: 800;
    white-space: nowrap;
  }

  /* QUESTION INSTRUCTION */

  .question-heading span {
    color: #536782;
    font-size: 13px;
    font-weight: 600;
    text-align: left;
  }

  /* PICTURE CHOICES */

  .picture-choices {
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
    max-width: 100%;
    max-height: 100%;
    width: auto;
    object-fit: contain;
  }

  .picture-choice > span,
  .answer-picture > span {
    display: block;
    padding-top: 4px;
    font-weight: 700;
    color: #245d91;
    font-size: 13px;
  }

  /* ANSWER HEADING */

  .answer-heading {
    margin: 11px 0 7px;
    color: #536782;
    font-size: 12px;
    font-weight: 700;
  }

  /* ANSWER BOXES */

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

  .answer-card .picture-stage {
    height: 115px;
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

    <h1>DESCENDING ORDER</h1>

    <p class="subtitle">
      Picture Practice Worksheet
    </p>

    <div class="student-info">
      <span>Name: __________________________</span>
      <span>Date: ______________</span>
    </div>

    <div class="worksheet-info">
      <span>Arrange from Biggest to Smallest</span>
      <span>Questions: ${questions.length}</span>
    </div>

    ${questionHtml}

  </section>

  <!-- ANSWER KEY PAGE -->

  <section class="page answer-key">

    <h1>ANSWER KEY</h1>

    <p class="subtitle">
      Descending Order Picture Practice
    </p>

    ${answerHtml}

  </section>

</body>
</html>`;
};

// =====================================
// MAIN WORKSHEET COMPONENT
// =====================================

export default function DescendingOrderPictureWorksheet({
  questionBank,
  onClose,
}) {
  const [questionCount, setQuestionCount] = useState("10");
  const [error, setError] = useState("");

  // =====================================
  // GENERATE AND PRINT
  // =====================================

  function generateAndPrint() {
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

    if (!Array.isArray(questionBank) || questionBank.length === 0) {
      setError(
        "No picture questions are available to create a worksheet."
      );
      return;
    }

    const validQuestions = questionBank.filter(
      (question) =>
        Array.isArray(question.items) &&
        question.items.length === 4
    );

    if (validQuestions.length === 0) {
      setError("No valid picture questions were found.");
      return;
    }

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      setError("Please allow popups to print the worksheet.");
      return;
    }

    const selectedQuestions = [];

    while (selectedQuestions.length < count) {
      const round = randomize(validQuestions);

      selectedQuestions.push(
        ...round.slice(0, count - selectedQuestions.length)
      );
    }

    const worksheetQuestions = selectedQuestions.map((question) => ({
      ...question,
      displayItems: randomize(question.items),
    }));

    setError("");

    printWindow.document.open();

    printWindow.document.write(
      buildWorksheetHtml(worksheetQuestions)
    );

    printWindow.document.close();
    printWindow.focus();
  }

  // =====================================
  // POPUP UI
  // =====================================

  return (
    <div
      className="aop-worksheet-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="aop-worksheet-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aop-desc-worksheet-title"
      >

        <div className="aop-worksheet-icon">🖨️</div>

        <h2 id="aop-desc-worksheet-title">
          Descending Order Worksheet
        </h2>

        <p className="aop-worksheet-description">
          Create a printable picture worksheet for offline practice.
        </p>

        <div className="aop-worksheet-range">
          Biggest → Smallest
        </div>

        <label htmlFor="aop-desc-worksheet-count">
          How many questions do you want?
        </label>

        <input
          id="aop-desc-worksheet-count"
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
        </p>

        {error && (
          <p className="aop-worksheet-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="aop-worksheet-generate"
          onClick={generateAndPrint}
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
