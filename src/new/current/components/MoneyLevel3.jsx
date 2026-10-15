
import { useEffect, useRef, useState } from "react";
import "./MoneyLevel3.css";

const NOTE_IMAGES = {
  10: "/money-notes/ten-rupee-note.png",
  20: "/money-notes/20-rupee-note.png",
};

const NUMBER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const QUESTION_AMOUNTS = {
  10: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  20: [20, 40, 60, 80, 100, 120],
};

const ITEMS = [
  { name: "Lays packet", image: "lays" },
  { name: "Biscuit packet", image: "🍪" },
  { name: "Chocolate", image: "🍫" },
  { name: "Pencil", image: "✏️" },
  { name: "Juice packet", image: "🧃" },
  { name: "Ice cream", image: "🍦" },
  { name: "Notebook", image: "📒" },
  { name: "Toy", image: "🧸" },
  { name: "Eraser", image: "🩷" },
  { name: "Chips packet", image: "🍟" },
];

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

function createOptions(correctAnswer) {
  const wrongOptions = NUMBER_OPTIONS.filter(
    (number) => number !== correctAnswer
  );

  return shuffle([
    correctAnswer,
    ...shuffle(wrongOptions).slice(0, 3),
  ]);
}

function buildQuestion(item, denomination, price) {
  return {
    item,
    price,
    denomination,
    correctAnswer: price / denomination,
    options: createOptions(price / denomination),
  };
}

function createQuestion(method, previousQuestion = null) {
  let denomination;

  if (method === "both") {
    denomination = previousQuestion
      ? previousQuestion.denomination === 10
        ? 20
        : 10
      : Math.random() < 0.5
        ? 10
        : 20;
  } else {
    denomination = Number(method);
  }

  const amounts = QUESTION_AMOUNTS[denomination];

  let availableAmounts = amounts.filter(
    (amount) =>
      amount !== previousQuestion?.price ||
      denomination !== previousQuestion?.denomination
  );

  if (availableAmounts.length === 0) {
    availableAmounts = amounts;
  }

  const price =
    availableAmounts[
      Math.floor(Math.random() * availableAmounts.length)
    ];

  const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];

  return buildQuestion(item, denomination, price);
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
    // Once the child answers correctly, lock the options
    // while the next question is loading.
    if (selectedAnswer === question.correctAnswer) return;

    clearTimers();

    if (option === question.correctAnswer) {
      setSelectedAnswer(option);
      setFeedback(
        language === "te" ? "Correct! Chaala baagundi!" : "Correct!"
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
  // Keep the selected wrong answer red for 3 seconds.
  // Do not reveal the correct answer.
  setSelectedAnswer(option);
  setFeedback(
    language === "te" ? "Malli try cheyyi!" : "Try again!"
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
        const productHtml =
          q.item.image === "lays"
            ? `<img class="product-image" src="/money-items/lays-packet.png" alt="Lays packet" />`
            : `<span class="product-emoji">${q.item.image}</span>`;

        const questionText =
          language === "te"
            ? `${q.item.name} Rs ${q.price}, enni Rs ${q.denomination} notes ivvali?`
            : `${q.item.name} costs Rs ${q.price}. How many Rs ${q.denomination} notes are needed?`;

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

            <p class="print-question-line">
              ${productHtml}
              <span>${questionText}</span>
              <img
                class="inline-note"
                src="${NOTE_IMAGES[q.denomination]}"
                alt="Rs ${q.denomination} note"
              />
            </p>

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
            * { box-sizing: border-box; }
            body { margin: 20px; color: #111827; font-family: Arial, sans-serif; }
            h1 { text-align: center; }
            .student-details { display: flex; justify-content: space-between; margin: 25px 0; }
            .print-question { padding: 12px 0 25px; break-inside: avoid; }
            .page-break { break-before: page; page-break-before: always; }
            .print-question-line { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; font-size: 20px; font-weight: bold; text-align: center; }
            .product-image { width: 55px; height: 55px; object-fit: contain; }
            .product-emoji { font-size: 38px; }
            .inline-note { width: 90px; height: 48px; object-fit: contain; }
            .print-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 420px; margin: 20px auto; }
            .print-option { padding: 12px; border: 2px solid #444; border-radius: 8px; font-size: 24px; font-weight: bold; text-align: center; }
            @media print { body { margin: 10mm; } }
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
              await Promise.all(Array.from(document.images).map((img) => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => {
                  img.onload = resolve;
                  img.onerror = resolve;
                });
              }));
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

  const displayedItemName = question.item.name;

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
          <option value="10">
            {language === "te" ? "Rs. 10 Notes" : "Rs. 10 Notes"}
          </option>
          <option value="20">
            {language === "te" ? "Rs. 20 Notes" : "Rs. 20 Notes"}
          </option>
          <option value="both">
            Rs. 10 / Rs. 20 Notes
          </option>
        </select>
      </div>

      <div className="money-level3-card">
        <div className="money-level3-question-count">
          Money Level 3
        </div>

        <div className="money-level3-question">
          {question.item.image === "lays" ? (
            <img
              className="money-level3-inline-object"
              src="/money-items/lays-packet.png"
              alt="Lays packet"
            />
          ) : (
            <span className="money-level3-inline-emoji">
              {question.item.image}
            </span>
          )}

          {language === "te" ? (
            <span>
              {displayedItemName} Rs {question.price}, enni Rs{" "}
              {question.denomination}
            </span>
          ) : (
            <span>
              {displayedItemName} costs Rs {question.price}. How many Rs{" "}
              {question.denomination}
            </span>
          )}

          <img
            className="money-level3-inline-note"
            src={NOTE_IMAGES[question.denomination]}
            alt={`Rs ${question.denomination} note`}
          />

          <span>
            {language === "te" ? "notes ivvali?" : "notes are needed?"}
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
          {language === "te" ? "Next Question →" : "Next Question →"}
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

            <h2 id="money-print-title">
              {language === "te" ? "Print Questions" : "Print Questions"}
            </h2>

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
