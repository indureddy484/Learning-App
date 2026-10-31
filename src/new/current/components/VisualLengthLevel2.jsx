
import { useEffect, useState } from "react";
import "./VisualLengthLevel2.css";

/* =====================================================
   OBJECTS
===================================================== */

const OBJECTS = [
  { name: "popsicle stick", type: "popsicle", color: "#E8AD70" },
  { name: "marker", type: "marker", color: "#12A9D5" },
  { name: "crayon", type: "crayon", color: "#E94E78" },
  { name: "torch", type: "torch", color: "#596D89" },
  { name: "pencil", type: "pencil", color: "#F6C94B" },
  { name: "ruler", type: "ruler", color: "#F2D16B" },
  { name: "toothbrush", type: "toothbrush", color: "#55C9B5" },
  { name: "book", type: "book", color: "#5D91D8" },
  { name: "paintbrush", type: "paintbrush", color: "#B48BE8" },
  { name: "spoon", type: "spoon", color: "#AEBCCB" },
  { name: "battery", type: "battery", color: "#70C77D" },
  { name: "eraser", type: "eraser", color: "#F18AA7" },
];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = (array) => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

/* =====================================================
   QUESTION GENERATION
===================================================== */

function makeQuestion() {
  const object = OBJECTS[randomInt(0, OBJECTS.length - 1)];
  const answer = randomInt(4, 10);

  const options = new Set([answer]);

  while (options.size < 4) {
    const value = answer + randomInt(-3, 3);

    if (value >= 2 && value <= 12) {
      options.add(value);
    }
  }

  return {
    id: `${Date.now()}-${Math.random()}`,
    object,
    answer,
    options: shuffle([...options]),
    prompt: `How long is the ${object.name}?`,
  };
}

function makeQuestions(count) {
  return Array.from({ length: count }, () => makeQuestion());
}

/* =====================================================
   SOUND EFFECTS
===================================================== */

function playSound(path) {
  try {
    const audio = new Audio(path);
    audio.play().catch(() => {});
  } catch {
    // Sound is optional.
  }
}

function playAnswerFeedback(correct) {
  if (correct) {
    playSound("/sounds/success-1-6297.mp3");

    window.setTimeout(() => {
      playSound("/sounds/very-good.mp3");
    }, 700);
  } else {
    playSound("/sounds/fail-2-2777575.mp3");

    window.setTimeout(() => {
      playSound("/sounds/try-again.mp3");
    }, 700);
  }
}

function formatTime(seconds) {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const remaining = safe % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remaining
  ).padStart(2, "0")}`;
}

/* =====================================================
   COLOURFUL OBJECT ILLUSTRATIONS
===================================================== */

function ObjectIllustration({ object }) {
  const outline = {
    stroke: "#26364B",
    strokeWidth: 5,
    strokeLinejoin: "round",
    strokeLinecap: "round",
  };

  switch (object.type) {
    case "popsicle":
      return (
        <g>
          <rect
            x="35" y="28" width="630" height="48"
            rx="24" fill="#E8AD70" {...outline}
          />
          <path
            d="M80 36 H620"
            stroke="#F8D2A5"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      );

    case "marker":
      return (
        <g>
          <rect
            x="75" y="25" width="490" height="54"
            rx="13" fill="#FFFFFF" {...outline}
          />
          <rect
            x="75" y="25" width="60" height="54"
            rx="10" fill="#20B8DE" {...outline}
          />
          <rect
            x="135" y="25" width="42" height="54"
            fill="#D9E3F1" {...outline}
          />
          <rect
            x="177" y="25" width="345" height="54"
            fill="#FFFFFF" stroke="#26364B" strokeWidth="4"
          />
          <rect
            x="522" y="25" width="75" height="54"
            rx="10" fill="#11A8D5" {...outline}
          />
          <path
            d="M597 25 L665 39 L665 65 L597 79 Z"
            fill="#078BB7" {...outline}
          />
        </g>
      );

    case "crayon":
      return (
        <g>
          <path
            d="M70 30 H555 Q590 30 610 50 Q590 76 555 76 H70 Q50 76 50 53 Q50 30 70 30Z"
            fill="#E94E78" {...outline}
          />
          <rect
            x="90" y="30" width="30" height="46"
            fill="#A92F55" stroke="#26364B" strokeWidth="4"
          />
          <rect
            x="120" y="30" width="22" height="46"
            fill="#F6A3B8" stroke="#26364B" strokeWidth="4"
          />
          <path
            d="M555 30 L585 38 L585 68 L555 76"
            fill="#F58BA8" {...outline}
          />
          <path
            d="M610 50 L650 50"
            stroke="#26364B"
            strokeWidth="3"
          />
        </g>
      );

    case "torch":
      return (
        <g>
          <rect
            x="35" y="34" width="490" height="48"
            rx="18" fill="#34475E" {...outline}
          />
          <rect
            x="115" y="39" width="275" height="38"
            rx="8" fill="#687F9C"
          />
          <rect
            x="390" y="39" width="70" height="38"
            fill="#26364B"
          />
          <path
            d="M525 28 L610 18 L665 30 L665 87 L610 98 L525 82 Z"
            fill="#AEBBCB" {...outline}
          />
          <ellipse
            cx="650" cy="58" rx="13" ry="24"
            fill="#DDF5FF" stroke="#26364B" strokeWidth="4"
          />
        </g>
      );

    case "pencil":
      return (
        <g>
          <path
            d="M40 53 L100 27 H600 L660 53 L600 80 H100 Z"
            fill="#F6C94B" {...outline}
          />
          <path
            d="M40 53 L100 27 V80 Z"
            fill="#E9B48A" {...outline}
          />
          <path
            d="M40 53 L61 44 V62 Z"
            fill="#343434"
          />
          <rect
            x="600" y="27" width="30" height="53"
            fill="#E9A0A0" stroke="#26364B" strokeWidth="4"
          />
          <path
            d="M630 27 L660 53 L630 80 Z"
            fill="#D7DCE5" {...outline}
          />
        </g>
      );

    case "ruler":
      return (
        <g>
          <rect
            x="35" y="28" width="630" height="52"
            rx="6" fill="#F5D56C" {...outline}
          />
          {Array.from({ length: 25 }, (_, i) => (
            <line
              key={i}
              x1={55 + i * 25}
              y1="32"
              x2={55 + i * 25}
              y2={i % 5 === 0 ? 67 : 48}
              stroke="#38465A"
              strokeWidth="2"
            />
          ))}
        </g>
      );

    case "toothbrush":
      return (
        <g>
          <rect
            x="45" y="42" width="610" height="35"
            rx="17" fill="#55C9B5" {...outline}
          />
          <rect
            x="45" y="35" width="115" height="40"
            rx="10" fill="#B6F0E5" {...outline}
          />
          {Array.from({ length: 8 }, (_, i) => (
            <line
              key={i}
              x1={60 + i * 12}
              y1="35"
              x2={60 + i * 12}
              y2="20"
              stroke="#2F9C8D"
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}
        </g>
      );

    case "book":
      return (
        <g>
          <rect
            x="40" y="22" width="620" height="72"
            rx="8" fill="#4D82C9" {...outline}
          />
          <rect
            x="55" y="32" width="590" height="52"
            rx="4" fill="#A9C9F0"
          />
          <line
            x1="350" y1="32" x2="350" y2="84"
            stroke="#FFFFFF" strokeWidth="6"
          />
        </g>
      );

    case "paintbrush":
      return (
        <g>
          <rect
            x="80" y="42" width="520" height="30"
            rx="12" fill="#B48BE8" {...outline}
          />
          <rect
            x="540" y="34" width="65" height="46"
            rx="5" fill="#C9D3DF" {...outline}
          />
          <path
            d="M605 34 Q655 40 665 57 Q655 74 605 80 Z"
            fill="#F0C58E" {...outline}
          />
        </g>
      );

    case "spoon":
      return (
        <g>
          <rect
            x="220" y="43" width="445" height="27"
            rx="13" fill="#BBC9D9" {...outline}
          />
          <ellipse
            cx="100" cy="56" rx="90" ry="39"
            fill="#D8E2ED" {...outline}
          />
        </g>
      );

    case "battery":
      return (
        <g>
          <rect
            x="45" y="25" width="600" height="65"
            rx="12" fill="#70C77D" {...outline}
          />
          <rect
            x="645" y="42" width="25" height="30"
            rx="4" fill="#AEBBCB" {...outline}
          />
          <path
            d="M340 38 L305 60 H340 L325 80 L390 52 H352 L370 38 Z"
            fill="#FFF2A4"
          />
        </g>
      );

    case "eraser":
      return (
        <g>
          <rect
            x="45" y="27" width="610" height="58"
            rx="12" fill="#F18AA7" {...outline}
          />
          <rect
            x="45" y="27" width="155" height="58"
            rx="12" fill="#F6B8C9" {...outline}
          />
          <line
            x1="200" y1="28" x2="200" y2="84"
            stroke="#26364B" strokeWidth="4"
          />
        </g>
      );

    default:
      return (
        <rect
          x="40" y="28" width="620" height="55"
          rx="20" fill={object.color} {...outline}
        />
      );
  }
}

/* =====================================================
   PAPERCLIP MEASUREMENT ROW

   The row is exactly the same width as the object.
   Each clip represents one centimetre.
===================================================== */

function PaperclipRow({ count }) {
  const clipWidth = 700 / count;

  return (
    <svg
      className="vl2-paperclip-svg"
      viewBox="0 0 700 42"
      width="100%"
      role="img"
      aria-label={`${count} paperclips, one centimetre each`}
    >
      {Array.from({ length: count }, (_, index) => (
        <g
          key={index}
          transform={`translate(${index * clipWidth}, 0) scale(${clipWidth / 70}, 1)`}
        >
          <path
            d="M8 12
               Q8 5 17 5
               H57
               Q66 5 66 14
               V25
               Q66 34 57 34
               H17
               Q8 34 8 25
               V18
               Q8 12 16 12
               H51
               Q57 12 57 18
               Q57 24 51 24
               H23"
            fill="none"
            stroke="#273C57"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M14 9 H56"
            fill="none"
            stroke="#8FAACB"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}

/* =====================================================
   COMPLETE MEASUREMENT PICTURE
===================================================== */

function MeasurementVisual({ question }) {
  if (!question) return null;

  return (
    <div className="vl2-measure-visual">

      <div className="vl2-object-picture">

        <svg
          viewBox="0 0 700 110"
          width="100%"
          role="img"
          aria-label={question.object.name}
        >
          <ObjectIllustration object={question.object} />
        </svg>

      </div>

      <PaperclipRow count={question.answer} />

      <div className="vl2-measure-caption">
        Count the paperclips from one end to the other.
        Each paperclip represents 1 centimetre.
      </div>

    </div>
  );
}

/* =====================================================
   ANSWER OPTIONS
===================================================== */

function AnswerOptions({
  question,
  selected,
  onSelect,
  disabled,
}) {
  return (
    <div className="vl2-options">

      {question.options.map((option, index) => (
        <button
          key={`${question.id}-${option}`}
          type="button"
          disabled={disabled}
          className={`vl2-option ${
            selected === option ? "selected" : ""
          }`}
          onClick={() => onSelect(option)}
        >
          <span className="vl2-option-letter">
            {String.fromCharCode(65 + index)}
          </span>

          <strong>{option}</strong>

          <small>cm</small>
        </button>
      ))}

    </div>
  );
}

/* =====================================================
   PRINT WORKSHEET
===================================================== */

function printWorksheet(count) {
  const questions = makeQuestions(count);

  const questionHTML = questions.map((question, index) => {
    const options = question.options
      .map(
        (option, optionIndex) => `
          <span>
            ☐ ${String.fromCharCode(65 + optionIndex)}.
            ${option} cm
          </span>
        `
      )
      .join("");

    const objectSVG = `
      <svg viewBox="0 0 700 110" width="100%">
        ${getPrintObjectSVG(question.object.type, question.object.color)}
      </svg>
    `;

    const clips = Array.from(
      { length: question.answer },
      (_, clipIndex) => {
        const clipWidth = 700 / question.answer;

        return `
          <g transform="translate(${clipIndex * clipWidth},0) scale(${clipWidth / 70},1)">
            <path
              d="M8 12 Q8 5 17 5 H57 Q66 5 66 14 V25 Q66 34 57 34 H17 Q8 34 8 25 V18 Q8 12 16 12 H51 Q57 12 57 18 Q57 24 51 24 H23"
              fill="none"
              stroke="#273c57"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        `;
      }
    ).join("");

    return `
      <article class="print-question">
        <h3>${index + 1}. ${question.prompt}</h3>

        ${objectSVG}

        <svg viewBox="0 0 700 42" width="100%">
          ${clips}
        </svg>

        <p class="print-instruction">
          Each paperclip represents 1 centimetre.
        </p>

        <div class="print-options">${options}</div>
      </article>
    `;
  }).join("");

  const win = window.open("", "_blank", "width=900,height=700");

  if (!win) {
    alert("Please allow pop-ups to print the worksheet.");
    return;
  }

  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Visual Length Level 2 Worksheet</title>
        <meta charset="UTF-8"/>

        <style>
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            font-family: Arial, sans-serif;
            color: #26364b;
          }

          h1 {
            text-align: center;
            color: #2865b8;
          }

          .print-subtitle {
            text-align: center;
            margin-bottom: 20px;
          }

          .print-question {
            border: 2px solid #c8dcf5;
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 16px;
            break-inside: avoid;
            background: #f8fbff;
          }

          .print-question h3 {
            margin: 0 0 12px;
            text-align: center;
            color: #254f82;
            font-size: 17px;
          }

          .print-question svg {
            display: block;
            margin: 5px auto;
          }

          .print-instruction {
            text-align: center;
            color: #647b98;
            font-size: 12px;
          }

          .print-options {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 12px;
            font-size: 14px;
          }
        </style>
      </head>

      <body>
        <h1>Visual Length — Level 2</h1>

        <p class="print-subtitle">
          Count the paperclips and choose the correct length.
          <br/>
          Each paperclip represents 1 centimetre.
          <br/><br/>
          Name: ______________________
          Date: ______________
        </p>

        ${questionHTML}

        <script>
          window.onload = () => window.print();
        <\/script>
      </body>
    </html>
  `);

  win.document.close();
}

/* =====================================================
   PRINT OBJECT DRAWINGS
===================================================== */

function getPrintObjectSVG(type, color) {
  const outline = 'stroke="#26364b" stroke-width="5"';

  switch (type) {
    case "popsicle":
      return `<rect x="35" y="28" width="630" height="48" rx="24" fill="#e8ad70" ${outline}/>`;
    case "marker":
      return `
        <rect x="75" y="25" width="490" height="54" rx="13" fill="#fff" ${outline}/>
        <rect x="75" y="25" width="60" height="54" rx="10" fill="#20b8de" ${outline}/>
        <rect x="135" y="25" width="42" height="54" fill="#d9e3f1" ${outline}/>
        <rect x="177" y="25" width="345" height="54" fill="#fff" stroke="#26364b" stroke-width="4"/>
        <rect x="522" y="25" width="75" height="54" rx="10" fill="#11a8d5" ${outline}/>
        <path d="M597 25 L665 39 L665 65 L597 79 Z" fill="#078bb7" ${outline}/>
      `;
    case "crayon":
      return `
        <path d="M70 30 H555 Q590 30 610 50 Q590 76 555 76 H70 Q50 76 50 53 Q50 30 70 30Z" fill="#e94e78" ${outline}/>
        <rect x="90" y="30" width="30" height="46" fill="#a92f55" ${outline}/>
        <rect x="120" y="30" width="22" height="46" fill="#f6a3b8" ${outline}/>
      `;
    case "torch":
      return `
        <rect x="35" y="34" width="490" height="48" rx="18" fill="#34475e" ${outline}/>
        <rect x="115" y="39" width="275" height="38" rx="8" fill="#687f9c"/>
        <path d="M525 28 L610 18 L665 30 L665 87 L610 98 L525 82 Z" fill="#aebbcB" ${outline}/>
        <ellipse cx="650" cy="58" rx="13" ry="24" fill="#ddf5ff" ${outline}/>
      `;
    case "pencil":
      return `
        <path d="M40 53 L100 27 H600 L660 53 L600 80 H100 Z" fill="#f6c94b" ${outline}/>
        <path d="M40 53 L100 27 V80 Z" fill="#e9b48a" ${outline}/>
        <path d="M40 53 L61 44 V62 Z" fill="#343434"/>
        <rect x="600" y="27" width="30" height="53" fill="#e9a0a0" ${outline}/>
        <path d="M630 27 L660 53 L630 80 Z" fill="#d7dce5" ${outline}/>
      `;
    case "ruler":
      return `
        <rect x="35" y="28" width="630" height="52" rx="6" fill="#f5d56c" ${outline}/>
        ${Array.from({length:25},(_,i)=>`<line x1="${55+i*25}" y1="32" x2="${55+i*25}" y2="${i%5===0?67:48}" stroke="#38465a" stroke-width="2"/>`).join("")}
      `;
    case "book":
      return `
        <rect x="40" y="22" width="620" height="72" rx="8" fill="#4d82c9" ${outline}/>
        <rect x="55" y="32" width="590" height="52" rx="4" fill="#a9c9f0"/>
        <line x1="350" y1="32" x2="350" y2="84" stroke="#fff" stroke-width="6"/>
      `;
    default:
      return `<rect x="40" y="28" width="620" height="55" rx="20" fill="${color}" ${outline}/>`;
  }
}

/* =====================================================
   MAIN LEVEL 2
===================================================== */

export default function VisualLengthLevel2({ onBack }) {
  const [questions, setQuestions] = useState(() => [makeQuestion()]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showPrint, setShowPrint] = useState(false);
  const [printCount, setPrintCount] = useState("10");
  const [mode, setMode] = useState("learn");

  const current = questions[index];

  const answerLearning = (choice) => {
    if (selected !== null) return;

    setSelected(choice);

    if (choice !== current.answer) {
      setFeedback("💛 Good try! Count the paperclips again.");
      playAnswerFeedback(false);

      window.setTimeout(() => {
        setSelected(null);
        setFeedback("");
      }, 1100);

      return;
    }

    setFeedback("🌟 Very good! That's correct!");
    playAnswerFeedback(true);

    window.setTimeout(() => {
      setQuestions((previous) => [...previous, makeQuestion()]);
      setIndex((previous) => previous + 1);
      setSelected(null);
      setFeedback("");
    }, 1100);
  };

  const handlePrint = () => {
    const count = Number(printCount);

    if (!Number.isInteger(count) || count < 1 || count > 100) {
      alert("Enter a number between 1 and 100.");
      return;
    }

    printWorksheet(count);
    setShowPrint(false);
  };

  if (mode === "test") {
    return (
      <VisualLengthLevel2Test
        onBack={() => setMode("learn")}
      />
    );
  }

  return (
    <main className="vl-screen vl2-screen">

      <header className="vl-header">
        <button
          className="vl-back"
          type="button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <p className="vl-eyebrow">MATHS · MEASUREMENT</p>
          <h1>📏 Visual Length — Level 2</h1>
          <p className="vl-subtitle">
            Learn to measure objects using paperclips.
          </p>
        </div>
      </header>

      <div className="vl-toolbar">
        <span className="vl-progress-label">
          Question {index + 1}
        </span>

        <div className="vl-progress">
          <span style={{ width: "100%" }} />
        </div>

        <button
          className="vl-secondary"
          type="button"
          onClick={() => setShowPrint(true)}
        >
          🖨️ Print Worksheet
        </button>

        <button
          className="vl-primary"
          type="button"
          onClick={() => setMode("test")}
        >
          📝 Take Quiz / Test
        </button>
      </div>

      <section className="vl-learning-card">

        <div className="vl-card-heading">
          <span className="vl-pill">
            LOOK · MEASURE · COUNT
          </span>

          <span className="vl-step">
            Question {index + 1}
          </span>
        </div>

        <h2 className="vl-question-title">
          {current.prompt}
        </h2>

        <MeasurementVisual question={current} />

        <h3 className="vl2-answer-heading">
          Choose the correct length:
        </h3>

        <AnswerOptions
          question={current}
          selected={selected}
          onSelect={answerLearning}
          disabled={selected !== null}
        />

        {feedback && (
          <div
            className={`vl-feedback ${
              selected === current.answer
                ? "correct"
                : "try-again"
            }`}
          >
            {feedback}
          </div>
        )}

        <p className="vl-hint">
          Remember: one paperclip represents one centimetre.
        </p>

      </section>

      {showPrint && (
        <div
          className="vl-modal-overlay"
          onClick={() => setShowPrint(false)}
        >
          <section
            className="vl-print-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="vl-modal-close"
              type="button"
              onClick={() => setShowPrint(false)}
            >
              ×
            </button>

            <div className="vl-print-icon">🖨️</div>

            <h2>Print Worksheet</h2>

            <p>
              Create a colourful A4 measurement worksheet.
            </p>

            <label htmlFor="vl2-print-count">
              Number of questions
            </label>

            <input
              id="vl2-print-count"
              type="number"
              min="1"
              max="100"
              value={printCount}
              onChange={(event) =>
                setPrintCount(event.target.value)
              }
            />

            <div className="vl-modal-actions">
              <button
                className="vl-secondary"
                type="button"
                onClick={() => setShowPrint(false)}
              >
                Cancel
              </button>

              <button
                className="vl-primary"
                type="button"
                onClick={handlePrint}
              >
                Print A4 Worksheet
              </button>
            </div>
          </section>
        </div>
      )}

    </main>
  );
}

/* =====================================================
   TIMED TEST
===================================================== */

function VisualLengthLevel2Test({ onBack }) {
  const [stage, setStage] = useState("setup");
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(300);
  const [question, setQuestion] = useState(() => makeQuestion());
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  const correctCount = answers.filter((item) => item.correct).length;
  const wrongCount = answers.filter((item) => !item.correct).length;

  const finishTest = () => setStage("report");

  useEffect(() => {
    if (stage !== "running") return undefined;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          setStage("report");
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [stage]);

  const startTest = () => {
    setAnswers([]);
    setQuestion(makeQuestion());
    setQuestionNumber(1);
    setSelected(null);
    setTimeLeft(duration * 60);
    setStage("running");
  };

  const submitAnswer = (choice) => {
    if (selected !== null || stage !== "running") return;

    const correct = choice === question.answer;

    setSelected(choice);
    playAnswerFeedback(correct);

    setAnswers((previous) => [
      ...previous,
      { question, choice, correct },
    ]);

    window.setTimeout(() => {
      setQuestion(makeQuestion());
      setQuestionNumber((previous) => previous + 1);
      setSelected(null);
    }, 650);
  };

  if (stage === "setup") {
    return (
      <main className="vl-test-screen">
        <header className="vl-test-header">
          <button
            className="vl-back"
            type="button"
            onClick={onBack}
          >
            ← Back to Learning
          </button>

          <div>
            <p className="vl-eyebrow">VISUAL LENGTH · LEVEL 2</p>
            <h1>📝 Measurement Test</h1>
          </div>
        </header>

        <section className="vl-test-panel vl-test-setup">
          <div className="vl-setup-icon">⏱️</div>
          <h2>Prepare for your test</h2>

          <p>
            Count the paperclips and choose the correct length.
          </p>

          <label htmlFor="vl2-duration">
            Test duration
          </label>

          <select
            id="vl2-duration"
            value={duration}
            onChange={(event) =>
              setDuration(Number(event.target.value))
            }
          >
            <option value={1}>1 minute</option>
            <option value={2}>2 minutes</option>
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
          </select>

          <button
            className="vl-primary vl-start-test"
            type="button"
            onClick={startTest}
          >
            Start Test
          </button>
        </section>
      </main>
    );
  }

  if (stage === "report") {
    const score = answers.length
      ? Math.round((correctCount / answers.length) * 100)
      : 0;

    return (
      <main className="vl-test-screen">
        <header className="vl-test-header">
          <button
            className="vl-back"
            type="button"
            onClick={onBack}
          >
            ← Back to Learning
          </button>

          <div>
            <p className="vl-eyebrow">VISUAL LENGTH · LEVEL 2</p>
            <h1>📊 Test Analysis</h1>
          </div>
        </header>

        <section className="vl-test-panel">
          <h2>Test Completed!</h2>

          <div className="vl-score-grid">
            <div>
              <strong>{answers.length}</strong>
              <span>Attempted</span>
            </div>

            <div>
              <strong>{correctCount}</strong>
              <span>Correct</span>
            </div>

            <div>
              <strong>{wrongCount}</strong>
              <span>Incorrect</span>
            </div>

            <div>
              <strong>{score}%</strong>
              <span>Score</span>
            </div>
          </div>

          <div className="vl-modal-actions">
            <button
              className="vl-secondary"
              type="button"
              onClick={onBack}
            >
              Back to Learning
            </button>

            <button
              className="vl-primary"
              type="button"
              onClick={startTest}
            >
              Take Test Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="vl-test-screen">
      <header className="vl-test-header">
        <button
          className="vl-back"
          type="button"
          onClick={finishTest}
        >
          ← End Test
        </button>

        <div>
          <p className="vl-eyebrow">VISUAL LENGTH · LEVEL 2</p>
          <h1>📝 Measurement Test</h1>
        </div>
      </header>

      <section className="vl-test-panel vl-test-main">
        <div className="vl-test-status">
          <span>Question {questionNumber}</span>
          <span className="vl-countdown">
            ⏱ {formatTime(timeLeft)}
          </span>
        </div>

        <div className="vl-progress">
          <span style={{ width: "100%" }} />
        </div>

        <h2 className="vl-question-title">
          {question.prompt}
        </h2>

        <MeasurementVisual question={question} />

        <h3 className="vl2-answer-heading">
          Choose the correct length:
        </h3>

        <AnswerOptions
          question={question}
          selected={selected}
          onSelect={submitAnswer}
          disabled={selected !== null}
        />

        <p className="vl-hint">
          Each paperclip represents one centimetre.
        </p>

        <button
          className="vl-end-test"
          type="button"
          onClick={finishTest}
        >
          End Test
        </button>
      </section>
    </main>
  );
}
