
import { useEffect, useRef, useState } from "react";
import "./MoneyLevel3.css";

// Automatically discover images using Create React App / Webpack.
// Assumes this file is in src/new/current/components/
const imageContext = require.context(
  "../../../assets/money-items",
  false,
  /\.(png|jpe?g|webp)$/i
);

// Extract price from filenames such as 20_01.png, 40_02.png.
const ITEMS = imageContext
  .keys()
  .map((key) => {
    const filename = key.split("/").pop();
    const match = filename.match(/^(\d+)_\d+\.(png|jpe?g|webp)$/i);

    if (!match) return null;

    const price = Number(match[1]);

    if (!Number.isFinite(price) || price <= 0 || price % 10 !== 0) {
      return null;
    }

    return {
      image: imageContext(key),
      price,
      filename,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.filename.localeCompare(b.filename));

const NOTE_IMAGES = {
  10: "/money-notes/ten-rupee-note.png",
  20: "/money-notes/20-rupee-note.png",
};

const SOUND_PATHS = {
  success: "/sounds/success-1-6297.mp3",
  fail: "/sounds/fail-2-2777575.mp3",
  veryGood: "/sounds/very-good.mp3",
  tryAgain: "/sounds/try-again.mp3",
};

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// Generate four different answer choices around the correct answer.
function createOptions(correctAnswer) {
  const options = new Set([correctAnswer]);

  let distance = 1;

  while (options.size < 4) {
    options.add(correctAnswer + distance);
    
    if (correctAnswer - distance > 0) {
      options.add(correctAnswer - distance);
    }

    distance++;
  }

  return shuffle([...options]).slice(0, 4);
}

function buildQuestion(item, denomination) {
  const correctAnswer = item.price / denomination;

  return {
    item,
    price: item.price,
    denomination,
    correctAnswer,
    options: createOptions(correctAnswer),
  };
}

function getEligibleItems(denomination) {
  return ITEMS.filter(
    (item) =>
      item.price % denomination === 0 &&
      item.price / denomination >= 1
  );
}

function createQuestion(method, previousQuestion = null) {
  let denomination;

  if (method === "both") {
    const availableDenominations = [10, 20].filter(
      (value) => getEligibleItems(value).length > 0
    );

    if (availableDenominations.length === 0) return null;

    if (
      previousQuestion &&
      availableDenominations.includes(
        previousQuestion.denomination === 10 ? 20 : 10
      )
    ) {
      denomination =
        previousQuestion.denomination === 10 ? 20 : 10;
    } else {
      denomination =
        availableDenominations[
          Math.floor(Math.random() * availableDenominations.length)
        ];
    }
  } else {
    denomination = Number(method);
  }

  let availableItems = getEligibleItems(denomination);

  if (availableItems.length === 0) return null;

  // Avoid showing the same image twice in a row when possible.
  if (previousQuestion && availableItems.length > 1) {
    const differentItems = availableItems.filter(
      (item) => item.filename !== previousQuestion.item.filename
    );

    if (differentItems.length > 0) {
      availableItems = differentItems;
    }
  }

  const item =
    availableItems[Math.floor(Math.random() * availableItems.length)];

  return buildQuestion(item, denomination);
}

function MoneyLevel3({ onBack = () => {} }) {
  const [method, setMethod] = useState("10");
  const [language, setLanguage] = useState("en");

  const [question, setQuestion] = useState(() =>
    createQuestion("10")
  );

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [printPopupOpen, setPrintPopupOpen] = useState(false);
  const [printCount, setPrintCount] = useState(10);

  const audioRefs = useRef({});
  const feedbackTimer = useRef(null);
  const nextQuestionTimer = useRef(null);

  useEffect(() => {
    Object.entries(SOUND_PATHS).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audioRefs.current[key] = audio;
    });

    return () => {
      clearTimeout(feedbackTimer.current);
      clearTimeout(nextQuestionTimer.current);

      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  function playSound(name) {
    const audio = audioRefs.current[name];

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  function clearTimers() {
    clearTimeout(feedbackTimer.current);
    clearTimeout(nextQuestionTimer.current);
  }

  function loadNextQuestion(selectedMethod = method) {
    clearTimers();

    setQuestion((previousQuestion) =>
      createQuestion(selectedMethod, previousQuestion)
    );

    setSelectedAnswer(null);
    setFeedback("");
  }

  function handleMethodChange(event) {
    const newMethod = event.target.value;

    clearTimers();
    setMethod(newMethod);
    setQuestion(createQuestion(newMethod));
    setSelectedAnswer(null);
    setFeedback("");
  }

  function handleLanguageChange(newLanguage) {
    clearTimers();
    setLanguage(newLanguage);
    setSelectedAnswer(null);
    setFeedback("");
  }

  function handleAnswer(option) {
    if (
      !question ||
      selectedAnswer === question.correctAnswer
    ) {
      return;
    }

    clearTimers();

    if (option === question.correctAnswer) {
      setSelectedAnswer(option);

      setFeedback(
        language === "te"
          ? "Correct! Chaala baagundi!"
          : "Correct!"
      );

      playSound("success");

      feedbackTimer.current = setTimeout(() => {
        playSound("veryGood");
      }, 700);

      nextQuestionTimer.current = setTimeout(() => {
        setQuestion((previousQuestion) =>
          createQuestion(method, previousQuestion)
        );

        setSelectedAnswer(null);
        setFeedback("");
      }, 1600);
    } else {
      setSelectedAnswer(option);

      setFeedback(
        language === "te"
          ? "Malli try cheyyi!"
          : "Try again!"
      );

      playSound("fail");

      feedbackTimer.current = setTimeout(() => {
        playSound("tryAgain");
      }, 700);

      nextQuestionTimer.current = setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback("");
      }, 3000);
    }
  }

  function handlePrint() {
    const total = Number(printCount);

    if (!Number.isInteger(total) || total < 1 || total > 200) {
      alert("Please enter a number between 1 and 200.");
      return;
    }

    const printQuestions = [];
    let previousQuestion = null;

    for (let i = 0; i < total; i++) {
      const next = createQuestion(method, previousQuestion);

      if (!next) {
        alert(
          "No suitable product images are available for the selected notes. Please add images with matching prices."
        );
        return;
      }

      printQuestions.push(next);
      previousQuestion = next;
    }

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow pop-ups to print the questions.");
      return;
    }

    const questionHtml = printQuestions
      .map((q, index) => {
        const questionText =
          language === "te"
            ? `Enni Rs ${q.denomination} notes ivvali?`
            : `How many Rs ${q.denomination} notes are needed?`;

        const optionsHtml = q.options
          .map(
            (option, optionIndex) => `
              <div class="print-option">
                ${String.fromCharCode(65 + optionIndex)}. ${option}
              </div>
            `
          )
          .join("");

        return `
          <section class="print-question ${
            index > 0 && index % 5 === 0 ? "page-break" : ""
          }">
            <h2>Question ${index + 1}</h2>

            <div class="print-question-line">
              <img
                class="product-image"
                src="${q.item.image}"
                alt="Product priced at Rs ${q.price}"
              />

              <span>${questionText}</span>

              <img
                class="inline-note"
                src="${NOTE_IMAGES[q.denomination]}"
                alt="Rs ${q.denomination} note"
              />
            </div>

            <div class="print-options">${optionsHtml}</div>
          </section>
        `;
      })
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Money Level 3 Questions</title>

          <style>
            @page {
              size: A4;
              margin: 12mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 20px;
              color: #111827;
              font-family: Arial, sans-serif;
            }

            h1 {
              text-align: center;
            }

            .student-details {
              display: flex;
              justify-content: space-between;
              margin: 25px 0;
            }

            .print-question {
              padding: 12px 0 25px;
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .page-break {
              break-before: page;
              page-break-before: always;
            }

            .print-question-line {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              justify-content: center;
              gap: 15px;
              font-size: 20px;
              font-weight: bold;
              text-align: center;
              line-height: 1.5;
            }

            .product-image {
              width: 160px;
              height: 150px;
              object-fit: contain;
              flex-shrink: 0;
            }

            .inline-note {
              width: 180px;
              height: 90px;
              object-fit: contain;
              object-position: center;
              display: block;
              flex-shrink: 0;
              margin: 8px;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            .print-options {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              max-width: 420px;
              margin: 20px auto;
            }

            .print-option {
              padding: 12px;
              border: 2px solid #444;
              border-radius: 8px;
              font-size: 24px;
              font-weight: bold;
              text-align: center;
            }

            img {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            @media print {
              body {
                margin: 10mm;
              }

              .inline-note {
                width: 180px;
                height: 90px;
              }
            }
          </style>
        </head>

        <body>
          <h1>Money Level 3</h1>

          <div class="student-details">
            <span>Name: ____________________</span>
            <span>Date: ____________________</span>
          </div>

          ${questionHtml}

          <script>
            window.onload = async function () {
              await Promise.all(
                Array.from(document.images).map((img) => {
                  if (img.complete) return Promise.resolve();

                  return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                  });
                })
              );

              window.focus();
              window.print();
            };
          <\/script>
        </body>
      </html>
    `);

    printWindow.document.close();
    setPrintPopupOpen(false);
  }

  // Handle an empty image folder or missing denomination images.
  if (ITEMS.length === 0 || !question) {
    return (
      <div className="money-level3-screen">
        <button
          type="button"
          className="money-back-button"
          onClick={onBack}
        >
          ← BACK
        </button>

        <div className="money-level3-card">
          <h2>No suitable product images found.</h2>

          <p>
            Add images named like 20_01.png, 40_02.png
            inside src/assets/money-items/.
          </p>

          <p>
            For Rs 20 questions, make sure you have images
            whose prices are divisible by 20.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="money-level3-screen">
      <div className="money-level3-toolbar">
        <button
          type="button"
          className="money-back-button"
          onClick={onBack}
        >
          {language === "te" ? "← Back" : "← BACK"}
        </button>

        <div className="money-level3-language-selector">
          <button
            type="button"
            className={language === "en" ? "active" : ""}
            onClick={() => handleLanguageChange("en")}
          >
            English
          </button>

          <button
            type="button"
            className={language === "te" ? "active" : ""}
            onClick={() => handleLanguageChange("te")}
          >
            Telugu
          </button>
        </div>

        <label htmlFor="money-level3-method">
          {language === "te" ? "" : "Select Money:"}
        </label>

        <select
          id="money-level3-method"
          value={method}
          onChange={handleMethodChange}
        >
          <option value="10">Rs. 10 Notes</option>
          <option value="20">Rs. 20 Notes</option>
          <option value="both">Rs. 10 / Rs. 20 Notes</option>
        </select>
      </div>

      <div className="money-level3-card">
        <div className="money-level3-question-count">
          Money Level 3
        </div>

        <div className="money-level3-question">
          <img
            className="money-level3-inline-object"
            src={question.item.image}
            alt={`Product priced at Rs ${question.price}`}
          />

          <span>
            {language === "te"
              ? `Enni Rs ${question.denomination}`
              : `How many Rs ${question.denomination}`}
          </span>

          <img
            className="money-level3-inline-note"
            src={NOTE_IMAGES[question.denomination]}
            alt={`Rs ${question.denomination} note`}
          />

          <span>
            {language === "te"
              ? "notes ivvali?"
              : "notes are needed?"}
          </span>
        </div>

        <div className="money-level3-options">
          {question.options.map((option, index) => {
            const isCorrectSelection =
              selectedAnswer === option &&
              option === question.correctAnswer;

            const isWrongSelection =
              selectedAnswer === option &&
              option !== question.correctAnswer;

            return (
              <button
                key={`${option}-${index}`}
                type="button"
                className={`money-level3-option ${
                  isCorrectSelection
                    ? "correct"
                    : isWrongSelection
                      ? "incorrect"
                      : ""
                }`}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer === question.correctAnswer}
              >
                {option}
              </button>
            );
          })}
        </div>

        {feedback && (
          <h2
            className={`money-level3-feedback ${
              selectedAnswer === question.correctAnswer
                ? "correct-text"
                : "incorrect-text"
            }`}
            aria-live="polite"
          >
            {feedback}
          </h2>
        )}

        <button
          type="button"
          className="money-level3-next"
          onClick={() => loadNextQuestion()}
        >
          Next Question →
        </button>
      </div>

      <div className="money-level3-print-area">
        <button
          type="button"
          className="money-level3-print-button"
          onClick={() => setPrintPopupOpen(true)}
        >
          🖨️ {language === "te" ? "Print Questions" : "PRINT QUESTIONS"}
        </button>
      </div>

      {printPopupOpen && (
        <div
          className="money-print-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setPrintPopupOpen(false);
            }
          }}
        >
          <div
            className="money-print-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="money-print-title"
          >
            <button
              type="button"
              className="money-print-close"
              onClick={() => setPrintPopupOpen(false)}
              aria-label="Close popup"
            >
              ×
            </button>

            <h2 id="money-print-title">Print Questions</h2>

            <label htmlFor="money-print-count">
              Number of questions (1–200)
            </label>

            <input
              id="money-print-count"
              type="number"
              min="1"
              max="200"
              value={printCount}
              onChange={(event) => setPrintCount(event.target.value)}
            />

            <div className="money-print-actions">
              <button
                type="button"
                className="money-print-cancel"
                onClick={() => setPrintPopupOpen(false)}
              >
                Cancel
              </button>

              <button type="button" onClick={handlePrint}>
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoneyLevel3;
