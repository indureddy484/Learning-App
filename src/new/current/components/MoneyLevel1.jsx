import { useState, useRef, useEffect } from "react";
import "./MoneyLevel1.css";

const NOTE_IMAGES = {
  10: "/money-notes/ten-rupee-note.png",
  20: "/money-notes/20-rupee-note.png",
  50: "/money-notes/50-rupee-note.png",
};

const COIN_IMAGES = {
  1: "/money-coins/one-rupee-coin.png",
  2: "/money-coins/two-rupee-coin.png",
  5: "/money-coins/five-rupee-coin.png",
};

const TOPIC_OPTIONS = [
  { value: "note-10", label: "₹10 Note" },
  { value: "note-20", label: "₹20 Note" },
  { value: "note-50", label: "₹50 Note" },
  { value: "notes-10-20", label: "₹10 + ₹20 Notes" },
  { value: "notes-10-50", label: "₹10 + ₹50 Notes" },
  { value: "notes-20-50", label: "₹20 + ₹50 Notes" },
  { value: "notes-10-20-50", label: "₹10 + ₹20 + ₹50 Notes" },
  { value: "coin-1", label: "₹1 Coins" },
  { value: "coin-2", label: "₹2 Coins" },
  { value: "coin-5", label: "₹5 Coins" },
  { value: "coins-1-2", label: "₹1 + ₹2 Coins" },
  { value: "coins-1-5", label: "₹1 + ₹5 Coins" },
  { value: "coins-2-5", label: "₹2 + ₹5 Coins" },
  { value: "coins-1-2-5", label: "₹1 + ₹2 + ₹5 Coins" },
];

function getTopic(topic) {
  const isCoin =
    topic.startsWith("coin-") || topic.startsWith("coins-");

  const isSingle =
    topic.startsWith("note-") || topic.startsWith("coin-");

  const values = topic
    .replace(/^(notes|coins|note|coin)-/, "")
    .split("-")
    .map(Number);

  return {
    values,
    kind: isCoin ? "coin" : "note",
    type: isSingle ? "single" : "combo",
    label:
      values.map((v) => `₹${v}`).join(" + ") +
      (isCoin ? " Coins" : " Notes"),
  };
}

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function makeQuestion(topic) {
  const config = getTopic(topic);
  let items;

  if (config.type === "single") {
    const count = Math.floor(Math.random() * 9) + 2;

    items = Array.from({ length: count }, () => ({
      value: config.values[0],
      kind: config.kind,
    }));
  } else {
    items = config.values.flatMap((value) => {
      const count = Math.floor(Math.random() * 3) + 1;

      return Array.from({ length: count }, () => ({
        value,
        kind: config.kind,
      }));
    });
  }

  const answer = items.reduce((sum, item) => sum + item.value, 0);

  return { items, answer };
}

function createOptions(answer) {
  const choices = new Set([answer]);
  const step = answer > 100 ? 10 : answer > 30 ? 5 : 1;

  while (choices.size < 4) {
    const offset = (Math.floor(Math.random() * 8) + 1) * step;
    const candidate = Math.max(
      1,
      answer + (Math.random() < 0.5 ? -offset : offset)
    );

    choices.add(candidate);
  }

  return shuffle([...choices]);
}

// Generate each question and its options together.
// Options will not be shuffled again during re-renders.
function createQuestions(topic) {
  return Array.from({ length: 9 }, () => {
    const question = makeQuestion(topic);

    return {
      ...question,
      options: createOptions(question.answer),
    };
  });
}

function imageFor(item) {
  return item.kind === "coin"
    ? COIN_IMAGES[item.value]
    : NOTE_IMAGES[item.value];
}

function createPrintQuestions(count, topic) {
  return Array.from({ length: count }, (_, index) => {
    const question = makeQuestion(topic);

    return {
      number: index + 1,
      ...question,
      options: createOptions(question.answer),
    };
  });
}

function printQuestions(questions, topic) {
  const config = getTopic(topic);
  const printWindow = window.open("", "_blank", "width=1000,height=800");

  if (!printWindow) {
    alert("Please allow pop-ups to print the question paper.");
    return;
  }

  const questionsHTML = questions
    .map((question) => {
      const itemsHTML = question.items
        .map(
          (item) => `
            <img
              src="${new URL(imageFor(item), window.location.origin).href}"
              alt="₹${item.value} ${item.kind}"
              class="printed-money-image"
            />
          `
        )
        .join("");

      const optionsHTML = question.options
        .map(
          (option, index) => `
            <div class="option">
              ${String.fromCharCode(65 + index)}) ₹${option}
            </div>
          `
        )
        .join("");

      return `
        <section class="question">
          <div class="question-text">
            ${question.number}. Find the total value.
          </div>

          <div class="notes">
            ${itemsHTML}
            <span class="equals">= ?</span>
          </div>

          <div class="options">
            ${optionsHTML}
          </div>
        </section>
      `;
    })
    .join("");

  printWindow.document.open();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Money Level 1 - Question Paper</title>

        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            color: #111;
            font-size: 17px;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #222;
            padding-bottom: 10px;
            margin-bottom: 18px;
          }

          .header h1 {
            margin: 0 0 6px;
            font-size: 25px;
          }

          .header h2 {
            margin: 0;
            font-size: 18px;
            font-weight: normal;
          }

          .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 18px;
          }

          .line {
            min-height: 28px;
            border-bottom: 1px solid #222;
          }

          .instructions {
            font-weight: bold;
            margin-bottom: 20px;
            line-height: 1.6;
          }

          .question {
            margin-bottom: 28px;
            padding: 12px 8px 22px;
            border-bottom: 1px dashed #999;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .question-text {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 18px;
          }

          .notes {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 14px;
            margin: 15px 0 22px 10px;
          }

          /* Large currency images for printing */
          .printed-money-image {
            display: block;
            width: 220px;
            height: 110px;
            object-fit: contain;
            object-position: left center;
            flex: 0 0 auto;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .equals {
            font-size: 28px;
            font-weight: bold;
          }

          .options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px 20px;
            margin: 10px 0 0 12px;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .option {
            font-size: 19px;
            line-height: 1.6;
          }

          .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #999;
            text-align: center;
            font-size: 12px;
            color: #666;
          }

          img {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          @media print {
            html,
            body {
              width: 100%;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .question {
              page-break-inside: avoid;
              break-inside: avoid;
            }
          }
        </style>
      </head>

      <body>
        <div class="header">
          <h1>Money Learning App</h1>
          <h2>Level 1 - Addition of Indian Currency</h2>
        </div>

        <div class="student-info">
          <div class="line">Name:</div>
          <div class="line">Date:</div>
        </div>

        <div class="instructions">
          Instructions: Choose the correct answer.<br />
          Topic: ${config.label}
        </div>

        ${questionsHTML}

        <div class="footer">
          Money Level 1 - Practice Question Paper
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = async () => {
    await Promise.all(
      Array.from(printWindow.document.images).map((img) => {
        if (img.complete) return Promise.resolve();

        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    printWindow.focus();
    printWindow.print();
  };
}

function MoneyLevel1({ onBack }) {
  const [topic, setTopic] = useState("note-10");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(false);

  const [questions, setQuestions] = useState(() =>
    createQuestions("note-10")
  );

  const [showPrintPopup, setShowPrintPopup] = useState(false);
  const [printCount, setPrintCount] = useState("10");

  const successAudio = useRef(null);
  const failAudio = useRef(null);
  const veryGoodAudio = useRef(null);
  const tryAgainAudio = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const question = questions[questionIndex];

  // Use the options stored with each question.
  // Do not call createOptions() during rendering.
  const optionsByQuestion = questions.map((item) => item.options);

  const playAudio = (audioRef) => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  const schedule = (callback, delay) => {
    timers.current.push(setTimeout(callback, delay));
  };

  const resetForTopic = (newTopic) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setTopic(newTopic);
    setQuestions(createQuestions(newTopic));
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setIsCorrect(false);
    setFinished(false);
  };

  const moveToNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      setSelectedAnswer(null);
      setFeedback("");
      setIsCorrect(false);
    } else {
      setFinished(true);
    }
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null || finished || !question) return;

    setSelectedAnswer(answer);

    if (answer === question.answer) {
      setIsCorrect(true);
      setFeedback("Very Good! 🎉");
      playAudio(successAudio);

      schedule(() => {
        playAudio(veryGoodAudio);
        schedule(moveToNextQuestion, 900);
      }, 700);
    } else {
      setIsCorrect(false);
      setFeedback("Try Again!");
      playAudio(failAudio);

      schedule(() => {
        playAudio(tryAgainAudio);

        schedule(() => {
          setSelectedAnswer(null);
          setFeedback("");
        }, 900);
      }, 700);
    }
  };

  const restartGame = () => resetForTopic(topic);

  const handlePrint = () => {
    const count = Number(printCount);

    if (!Number.isInteger(count) || count < 1 || count > 200) {
      alert("Please enter a number between 1 and 200.");
      return;
    }

    setShowPrintPopup(false);
    printQuestions(createPrintQuestions(count, topic), topic);
  };

  if (!question && !finished) return null;

  return (
    <div className="money-level-screen">
      <audio
        ref={successAudio}
        src="/sounds/success-1-6297.mp3"
        preload="auto"
      />

      <audio
        ref={failAudio}
        src="/sounds/fail-2-2777575.mp3"
        preload="auto"
      />

      <audio
        ref={veryGoodAudio}
        src="/sounds/very-good.mp3"
        preload="auto"
      />

      <audio
        ref={tryAgainAudio}
        src="/sounds/try-again.mp3"
        preload="auto"
      />

      <button
        className="money-back-button"
        onClick={onBack}
        type="button"
      >
        ← BACK
      </button>

      <div className="money-toolbar">
        <label htmlFor="money-denomination">Select Money:</label>

        <select
          id="money-denomination"
          className="money-denomination-select"
          value={topic}
          onChange={(event) => resetForTopic(event.target.value)}
        >
          {TOPIC_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="money-question-card">
        {finished ? (
          <div className="money-complete-card">
            <div className="money-complete-icon">🏆</div>
            <h2>Level Completed!</h2>

            <p>
              Excellent work! You completed the{" "}
              {getTopic(topic).label} addition game.
            </p>

            <button
              className="money-action-button"
              onClick={restartGame}
              type="button"
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div className="money-addition">
              {question.items.map((item, index) => (
                <span
                  className="money-note-item"
                  key={`${index}-${item.value}-${item.kind}`}
                >
                  <img
                    src={imageFor(item)}
                    alt={`₹${item.value} ${item.kind}`}
                    className="money-note-inline"
                  />

                  {index < question.items.length - 1 && (
                    <span className="money-plus-sign">+</span>
                  )}
                </span>
              ))}

              <span className="money-equals">= ______</span>
            </div>

            <div className="money-options">
              {optionsByQuestion[questionIndex].map((option) => {
                let buttonClass = "money-option-button";

                if (selectedAnswer === option) {
                  buttonClass +=
                    option === question.answer
                      ? " money-correct"
                      : " money-wrong";
                }

                return (
                  <button
                    key={option}
                    type="button"
                    className={buttonClass}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    ₹{option}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div
                className={`money-feedback ${
                  isCorrect
                    ? "money-feedback-correct"
                    : "money-feedback-wrong"
                }`}
              >
                {feedback}
              </div>
            )}
          </>
        )}
      </div>

      <button
        className="money-print-button"
        type="button"
        onClick={() => setShowPrintPopup(true)}
      >
        🖨️ PRINT QUESTIONS
      </button>

      {showPrintPopup && (
        <div
          className="money-print-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowPrintPopup(false);
            }
          }}
        >
          <div
            className="money-print-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="money-print-title"
          >
            <button
              className="money-print-close"
              type="button"
              onClick={() => setShowPrintPopup(false)}
              aria-label="Close print dialog"
            >
              ×
            </button>

            <div className="money-print-icon">🖨️</div>
            <h2 id="money-print-title">Print Questions</h2>

            <p>How many questions do you want to print?</p>

            <input
              type="number"
              min="1"
              max="200"
              value={printCount}
              onChange={(event) => setPrintCount(event.target.value)}
            />

            <p className="money-print-info">
              A4 format · Multiple choice · No answers
            </p>

            <p className="money-print-info">
              Selected: {getTopic(topic).label}
            </p>

            <div className="money-print-buttons">
              <button
                type="button"
                onClick={() => setShowPrintPopup(false)}
              >
                CANCEL
              </button>

              <button type="button" onClick={handlePrint}>
                PRINT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoneyLevel1;