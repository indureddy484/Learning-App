
import { useState, useRef, useEffect } from "react";
import "./MoneyLevel2.css";

const MONEY = [
  { value: 10, kind: "note", image: "/money-notes/ten-rupee-note.png" },
  { value: 20, kind: "note", image: "/money-notes/20-rupee-note.png" },
  { value: 50, kind: "note", image: "/money-notes/50-rupee-note.png" },
  { value: 100, kind: "note", image: "/money-notes/100-rupee-note.png" },
  { value: 1, kind: "coin", image: "/money-coins/one-rupee-coin.png" },
  { value: 2, kind: "coin", image: "/money-coins/two-rupee-coin.png" },
];

const TOPICS = [
  { value: "10", label: "Rs. 10 Notes" },
  { value: "20", label: "Rs. 20 Notes" },
  { value: "50", label: "Rs. 50 Notes" },
  { value: "100", label: "Rs. 100 Notes" },
  { value: "1", label: "Rs. 1 Coins" },
  { value: "2", label: "Rs. 2 Coins" },
];

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getMoney(value) {
  return MONEY.find((item) => item.value === value);
}

function createOptions(answer) {
  const choices = new Set([answer]);
  let offset = 1;

  while (choices.size < 4 && offset <= 100) {
    const candidate =
      answer + (offset % 2 === 1 ? offset : -offset);

    if (candidate > 0) {
      choices.add(candidate);
    }

    offset++;
  }

  while (choices.size < 4) {
    choices.add(answer + choices.size + 10);
  }

  return shuffle([...choices]);
}

function makeSingleQuestion(denomination, total) {
  const money = getMoney(denomination);

  return {
    denomination,
    total,
    answer: total / denomination,
    kind: money.kind,
    options: createOptions(total / denomination),
  };
}

function createQuestions(topic) {
  const denomination = Number(topic);
  const totals = [];

  for (
    let total = denomination;
    total <= 100;
    total += denomination
  ) {
    totals.push(total);
  }

  return shuffle(totals).map((total) =>
    makeSingleQuestion(denomination, total)
  );
}

function createPrintQuestions(count, topic) {
  const denomination = Number(topic);
  const totals = [];

  for (
    let total = denomination;
    total <= 100;
    total += denomination
  ) {
    totals.push(total);
  }

  const questions = [];

  while (questions.length < count) {
    for (const total of shuffle(totals)) {
      if (questions.length >= count) break;

      questions.push({
        ...makeSingleQuestion(denomination, total),
        number: questions.length + 1,
      });
    }
  }

  return questions;
}

function printQuestions(questions, topic) {
  const topicLabel =
    TOPICS.find((item) => item.value === topic)?.label || topic;

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=700"
  );

  if (!printWindow) {
    alert("Please allow pop-ups to print the question paper.");
    return;
  }

  const questionsHTML = questions
    .map((question) => {
      const money = getMoney(question.denomination);
      const imageUrl = new URL(
        money.image,
        window.location.origin
      ).href;

      const optionsHTML = question.options
        .map(
          (option, index) => `
            <div class="option">
              ${String.fromCharCode(65 + index)}) ${option}
            </div>
          `
        )
        .join("");

      return `
        <div class="question">
          <div class="question-text">
            ${question.number}.
            Rs. ${question.total} lo enni Rs. ${question.denomination}
            <img
              class="question-money-image"
              src="${imageUrl}"
              alt="Rs. ${question.denomination} ${money.kind}"
            />
            untayi?
          </div>

          <div class="options">
            ${optionsHTML}
          </div>
        </div>
      `;
    })
    .join("");

  printWindow.document.open();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Money Level 2 - Question Paper</title>

        <style>
          @page {
            size: A4;
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #111;
            font-size: 14px;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #222;
            padding-bottom: 12px;
            margin-bottom: 22px;
          }

          .header h1 {
            margin: 0 0 8px;
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
            gap: 25px;
            margin-bottom: 24px;
          }

          .line {
            min-height: 30px;
            border-bottom: 1px solid #222;
          }

          .instructions {
            font-weight: bold;
            margin-bottom: 22px;
          }

          .question {
            margin-bottom: 24px;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .question-text {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 5px;
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 12px;
          }

          .question-money-image {
            width: 48px;
            height: 30px;
            object-fit: contain;
            vertical-align: middle;
          }

          .options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 18px;
            margin-left: 20px;
          }

          .option {
            line-height: 1.5;
          }

          .footer {
            margin-top: 25px;
            padding-top: 10px;
            border-top: 1px solid #999;
            text-align: center;
            font-size: 11px;
            color: #666;
          }

          img {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        </style>
      </head>

      <body>
        <div class="header">
          <h1>Money Learning App</h1>
          <h2>Level 2 - Money Practice</h2>
        </div>

        <div class="student-info">
          <div class="line">Name:</div>
          <div class="line">Date:</div>
        </div>

        <div class="instructions">
          Instructions: Choose the correct answer.<br />
          Topic: ${topicLabel}
        </div>

        ${questionsHTML}

        <div class="footer">
          Money Level 2 - Practice Question Paper
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

export default function MoneyLevel2({ onBack }) {
  const [topic, setTopic] = useState("10");
  const [questions, setQuestions] = useState(() =>
    createQuestions("10")
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(false);
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
  const money = question
    ? getMoney(question.denomination)
    : null;

  function playAudio(audioRef) {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  function schedule(callback, delay) {
    const timer = setTimeout(callback, delay);
    timers.current.push(timer);
  }

  function resetForTopic(newTopic) {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setTopic(newTopic);
    setQuestions(createQuestions(newTopic));
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setIsCorrect(false);
    setFinished(false);
  }

  function moveToNextQuestion() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      setSelectedAnswer(null);
      setFeedback("");
      setIsCorrect(false);
    } else {
      setFinished(true);
    }
  }

  function handleAnswer(answer) {
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
  }

  function handlePrint() {
    const count = Number(printCount);

    if (!Number.isInteger(count) || count < 1 || count > 200) {
      alert("Please enter a number between 1 and 200.");
      return;
    }

    setShowPrintPopup(false);
    printQuestions(createPrintQuestions(count, topic), topic);
  }

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
        <label htmlFor="money-level2-topic">
          Select Money:
        </label>

        <select
          id="money-level2-topic"
          className="money-denomination-select"
          value={topic}
          onChange={(event) => resetForTopic(event.target.value)}
        >
          {TOPICS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
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
              Excellent work! You completed this Money Level 2
              practice.
            </p>

            <button
              className="money-action-button"
              onClick={() => resetForTopic(topic)}
              type="button"
            >
              Play Again
            </button>
          </div>
        ) : question ? (
          <>
            <div className="money-progress">
              Question {questionIndex + 1} of {questions.length}
            </div>

<h2 className="money-question-heading">
  <span>Rs. {question.total} lo enni Rs. {question.denomination}</span>

  <img
    src={money.image}
    alt={`Rs. ${question.denomination} ${money.kind}`}
    className="money-question-note-image"
  />

  <span>untayi?</span>
</h2>


            <div className="money-options">
              {question.options.map((option) => {
                const buttonClass =
                  "money-option-button" +
                  (selectedAnswer === option
                    ? option === question.answer
                      ? " money-correct"
                      : " money-wrong"
                    : "");

                return (
                  <button
                    key={option}
                    type="button"
                    className={buttonClass}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
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
        ) : null}
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
            aria-labelledby="money-level2-print-title"
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

            <h2 id="money-level2-print-title">
              Print Questions
            </h2>

            <p>How many questions do you want to print?</p>

            <input
              type="number"
              min="1"
              max="200"
              value={printCount}
              onChange={(event) =>
                setPrintCount(event.target.value)
              }
            />

            <p className="money-print-info">
              A4 format · Multiple choice · No answers
            </p>

            <p className="money-print-info">
              Selected:{" "}
              {TOPICS.find((item) => item.value === topic)?.label}
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
