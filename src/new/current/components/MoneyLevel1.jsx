
import { useState, useRef, useEffect } from "react";
import "./MoneyLevel1.css";

const NOTE_IMAGES = {
  10: "/money-notes/ten-rupee-note.png",
  20: "/money-notes/20-rupee-note.png",
  50: "/money-notes/50-rupee-note.png",
};

const DENOMINATIONS = [10, 20, 50];

function createQuestions(denomination) {
  return Array.from({ length: 9 }, (_, index) => {
    const count = index + 2;

    return {
      count,
      answer: count * denomination,
    };
  });
}

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function createOptions(answer, denomination) {
  const choices = [];

  for (let count = 2; count <= 10; count++) {
    const amount = count * denomination;

    if (amount !== answer) {
      choices.push(amount);
    }
  }

  return shuffle([answer, ...shuffle(choices).slice(0, 3)]);
}

// CREATE PRINTABLE QUESTIONS
function createPrintQuestions(count, denomination) {
  return Array.from({ length: count }, (_, index) => {
    const noteCount = Math.floor(Math.random() * 9) + 2;
    const answer = noteCount * denomination;

    return {
      number: index + 1,
      noteCount,
      answer,
      options: createOptions(answer, denomination),
    };
  });
}

// PRINT QUESTION PAPER
function printQuestions(questions, denomination) {
  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=700"
  );

  if (!printWindow) {
    alert("Please allow pop-ups to print the question paper.");
    return;
  }

  const noteImage = new URL(
    NOTE_IMAGES[denomination],
    window.location.origin
  ).href;

  const questionsHTML = questions
    .map(
      (question) => `
        <div class="question">
          <div class="question-text">
            ${question.number}. Find the total value of
            ${question.noteCount} ₹${denomination} notes.
          </div>

          <div class="notes">
            ${Array.from(
              { length: question.noteCount },
              () => `
                <img
                  src="${noteImage}"
                  alt="₹${denomination} note"
                />
              `
            ).join("")}
            <span class="equals">= ?</span>
          </div>

          <div class="options">
            ${question.options
              .map(
                (option, index) => `
                  <div class="option">
                    ${String.fromCharCode(65 + index)}) ₹${option}
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      `
    )
    .join("");

  printWindow.document.open();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Money Level 1 - Question Paper</title>

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
          font-family: Arial, Helvetica, sans-serif;
          color: #111;
          background: white;
          font-size: 15px;
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
          font-size: 19px;
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
          padding-bottom: 6px;
        }

        .instructions {
          font-weight: bold;
          margin-bottom: 22px;
        }

        .question {
          margin-bottom: 25px;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .question-text {
          font-size: 16px;
          font-weight: bold;
          line-height: 1.5;
          margin-bottom: 10px;
        }

        .notes {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 5px;
          margin: 8px 0 12px 18px;
        }

        .notes img {
          width: 65px;
          height: 32px;
          object-fit: contain;
        }

        .equals {
          font-size: 19px;
          font-weight: bold;
          margin-left: 5px;
        }

        .options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 18px;
          margin-left: 20px;
        }

        .option {
          font-size: 15px;
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

        @media print {
          .question {
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
        Instructions: Choose the correct answer.
        Note value: ₹${denomination}
      </div>

      ${questionsHTML}

      <div class="footer">
        Money Level 1 - Practice Question Paper
      </div>
    </body>
    </html>
  `);

  // Register load handling before closing the document.
  printWindow.onload = async () => {
    const images = Array.from(printWindow.document.images);

    await Promise.all(
      images.map((img) => {
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

  printWindow.document.close();
}

function MoneyLevel1({ onBack }) {
  const [denomination, setDenomination] = useState(10);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(false);

  const [questions, setQuestions] = useState(() =>
    createQuestions(10)
  );

  const [optionsByQuestion, setOptionsByQuestion] = useState(() =>
    createQuestions(10).map((question) =>
      createOptions(question.answer, 10)
    )
  );

  const [showPrintPopup, setShowPrintPopup] = useState(false);
  const [printCount, setPrintCount] = useState("10");

  const successAudio = useRef(null);
  const failAudio = useRef(null);
  const veryGoodAudio = useRef(null);
  const tryAgainAudio = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const question = questions[questionIndex];

  const playAudio = (audioRef) => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  const schedule = (callback, delay) => {
    const timer = setTimeout(callback, delay);
    timers.current.push(timer);
  };

  const changeDenomination = (value) => {
    const newDenomination = Number(value);

    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];

    const newQuestions = createQuestions(newDenomination);

    setDenomination(newDenomination);
    setQuestions(newQuestions);

    setOptionsByQuestion(
      newQuestions.map((item) =>
        createOptions(item.answer, newDenomination)
      )
    );

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
    if (selectedAnswer !== null || finished) return;

    setSelectedAnswer(answer);

    if (answer === question.answer) {
      setIsCorrect(true);
      setFeedback("Very Good! 🎉");

      playAudio(successAudio);

      schedule(() => {
        playAudio(veryGoodAudio);

        schedule(() => {
          moveToNextQuestion();
        }, 900);
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

  const restartGame = () => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];

    const newQuestions = createQuestions(denomination);

    setQuestions(newQuestions);

    setOptionsByQuestion(
      newQuestions.map((item) =>
        createOptions(item.answer, denomination)
      )
    );

    setQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setIsCorrect(false);
    setFinished(false);
  };

  const handlePrint = () => {
    const count = Number(printCount);

    if (!Number.isInteger(count) || count < 1 || count > 200) {
      alert("Please enter a number between 1 and 200.");
      return;
    }

    const printableQuestions = createPrintQuestions(
      count,
      denomination
    );

    setShowPrintPopup(false);
    printQuestions(printableQuestions, denomination);
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
        <label htmlFor="money-denomination">
          Select Note:
        </label>

        <select
          id="money-denomination"
          className="money-denomination-select"
          value={denomination}
          onChange={(event) =>
            changeDenomination(event.target.value)
          }
        >
          {DENOMINATIONS.map((value) => (
            <option key={value} value={value}>
              ₹{value} note
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
              Excellent work! You completed the ₹{denomination}
              note addition game.
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
              {Array.from(
                { length: question.count },
                (_, index) => (
                  <span
                    className="money-note-item"
                    key={index}
                  >
                    <img
                      src={NOTE_IMAGES[denomination]}
                      alt={`₹${denomination} note`}
                      className="money-note-inline"
                    />

                    {index < question.count - 1 && (
                      <span className="money-plus-sign">+</span>
                    )}
                  </span>
                )
              )}

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

      {/* PRINT QUESTIONS BUTTON */}
      <button
        className="money-print-button"
        type="button"
        onClick={() => setShowPrintPopup(true)}
      >
        🖨️ PRINT QUESTIONS
      </button>

      {/* PRINT QUESTIONS POPUP */}
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
              Selected note: ₹{denomination}
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
