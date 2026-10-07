import { useState, useRef, useEffect } from "react";
import "./Level2NinnaToday.css";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getDay(day, offset) {
  const index = days.indexOf(day);

  return days[
    (index + offset + days.length) % days.length
  ];
}

function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [newArray[i], newArray[j]] = [
      newArray[j],
      newArray[i],
    ];
  }

  return newArray;
}

function createOptions(answer) {
  const wrongAnswers = shuffleArray(
    days.filter(
      (day) => day !== answer
    )
  ).slice(0, 3);

  return shuffleArray([
    answer,
    ...wrongAnswers,
  ]);
}

// =====================================================
// LEVEL 2 QUESTION
//
// 1. Ivvala Friday aithe, ninna em day?
//
// 2. Ivvala Friday aithe, repu em day?
//
// 3. Repu Friday aithe, ivala em day?
//
// 4. Repu Friday aithe, ninna em day?
// =====================================================

function createQuestion() {

  const referenceDay =
    days[
      Math.floor(
        Math.random() * days.length
      )
    ];

  const type =
    Math.floor(
      Math.random() * 4
    ) + 1;

  let questionTelugu;
  let questionEnglish;
  let answer;

  // ===================================================
  // TYPE 1
  // TODAY → YESTERDAY
  // ===================================================

  if (type === 1) {

    answer =
      getDay(
        referenceDay,
        -1
      );

    questionTelugu =
      `Ivvala ${referenceDay} aithe, ninna em day padindi?`;

    questionEnglish =
      `If today is ${referenceDay}, what day was yesterday?`;
  }

  // ===================================================
  // TYPE 2
  // TODAY → TOMORROW
  // ===================================================

  else if (type === 2) {

    answer =
      getDay(
        referenceDay,
        1
      );

    questionTelugu =
      `Ivvala ${referenceDay} aithe, repu em day avtadi?`;

    questionEnglish =
      `If today is ${referenceDay}, what day is tomorrow?`;
  }

  // ===================================================
  // TYPE 3
  // TOMORROW → TODAY
  // ===================================================

  else if (type === 3) {

    answer =
      getDay(
        referenceDay,
        -1
      );

    questionTelugu =
      `Repu ${referenceDay} aithe, ivala em day avtadi?`;

    questionEnglish =
      `If tomorrow is ${referenceDay}, what day is today?`;
  }

  // ===================================================
  // TYPE 4
  // TOMORROW → YESTERDAY
  // ===================================================

  else {

    answer =
      getDay(
        referenceDay,
        -2
      );

    questionTelugu =
      `Repu ${referenceDay} aithe, ninna em day padindi?`;

    questionEnglish =
      `If tomorrow is ${referenceDay}, what day was yesterday?`;
  }

  return {
    question: {
      telugu: questionTelugu,
      english: questionEnglish,
    },

    options:
      createOptions(answer),

    answer,
  };
}

// =====================================================
// PRINT QUESTIONS
// =====================================================

function createPrintQuestions(
  count,
  language
) {
  return Array.from(
    { length: count },
    (_, index) => {

      const question =
        createQuestion();

      return {
        ...question,

        number:
          index + 1,

        text:
          question.question[
            language
          ],
      };
    }
  );
}

// =====================================================
// PRINT PAPER
// =====================================================

function printQuestions(
  questions
) {

  const printWindow =
    window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

  if (!printWindow) {

    alert(
      "Please allow pop-ups to print the question paper."
    );

    return;
  }

  const questionsHTML =
    questions
      .map(
        (question) => `
          <div class="question">

            <div class="question-text">
              ${question.number}.
              ${question.text}
            </div>

            <div class="options">

              ${question.options
                .map(
                  (option, index) => `
                    <div class="option">
                      ${String.fromCharCode(
                        65 + index
                      )}) ${option}
                    </div>
                  `
                )
                .join("")}

            </div>

          </div>
        `
      )
      .join("");

  printWindow.document.write(`
    <!DOCTYPE html>

    <html>

    <head>

      <title>
        Level 2 - Ninna, Today
      </title>

      <style>

        @page {
          size: A4;
          margin: 15mm;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          color: #111;

          background: white;
        }

        .paper {
          width: 100%;
        }

        .header {
          text-align: center;

          border-bottom:
            2px solid #222;

          padding-bottom: 12px;

          margin-bottom: 20px;
        }

        .header h1 {
          margin: 0 0 5px;

          font-size: 24px;
        }

        .header h2 {
          margin: 0;

          font-size: 16px;

          font-weight: normal;
        }

        .student-info {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 30px;

          margin-bottom: 25px;
        }

        .line {
          border-bottom:
            1px solid #222;

          padding-bottom: 6px;

          font-size: 14px;
        }

        .instructions {
          font-size: 14px;

          font-weight: bold;

          margin-bottom: 20px;
        }

        .question {
          margin-bottom: 22px;

          page-break-inside: avoid;
        }

        .question-text {
          font-size: 15px;

          font-weight: 600;

          line-height: 1.5;

          margin-bottom: 9px;
        }

        .options {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 7px;

          margin-left: 20px;
        }

        .option {
          font-size: 14px;

          line-height: 1.4;
        }

        .footer {
          margin-top: 30px;

          padding-top: 10px;

          border-top:
            1px solid #999;

          text-align: center;

          font-size: 11px;

          color: #666;
        }

      </style>

    </head>

    <body>

      <div class="paper">

        <div class="header">

          <h1>
            Day & Date Quiz
          </h1>

          <h2>
            Level 2 - Ninna, Today
          </h2>

        </div>

        <div class="student-info">

          <div class="line">
            Name:
          </div>

          <div class="line">
            Date:
          </div>

        </div>

        <div class="instructions">
          Choose the correct answer.
        </div>

        ${questionsHTML}

        <div class="footer">
          Level 2 - Ninna, Today
        </div>

      </div>

      <script>

        window.onload = function() {

          setTimeout(function() {
            window.print();
          }, 300);

        };

      </script>

    </body>

    </html>
  `);

  printWindow.document.close();
}

// =====================================================
// COMPONENT
// =====================================================

function Level2NinnaToday({
  onBack,
}) {

  const [language, setLanguage] =
    useState("telugu");

  const [currentQuestion, setCurrentQuestion] =
    useState(createQuestion());

  const [questionNumber, setQuestionNumber] =
    useState(1);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [showWrong, setShowWrong] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [showPrintPopup, setShowPrintPopup] =
    useState(false);

  const [printCount, setPrintCount] =
    useState("10");

  const locked = useRef(false);

  const timers = useRef([]);

  const audioRef = useRef(null);

  if (!audioRef.current) {

    audioRef.current = {

      success:
        new Audio(
          "/sounds/success-1-6297.mp3"
        ),

      fail:
        new Audio(
          "/sounds/fail-2-2777575.mp3"
        ),

      veryGood:
        new Audio(
          "/sounds/very-good.mp3"
        ),

      tryAgain:
        new Audio(
          "/sounds/try-again.mp3"
        ),
    };
  }

  useEffect(() => {

    return () => {

      timers.current.forEach(
        clearTimeout
      );

      Object.values(
        audioRef.current
      ).forEach((audio) => {

        audio.pause();

        audio.currentTime = 0;
      });

    };

  }, []);

  const schedule = (
    callback,
    delay
  ) => {

    const id =
      setTimeout(
        callback,
        delay
      );

    timers.current.push(id);
  };

  const playAudio = (audio) => {

    audio.pause();

    audio.currentTime = 0;

    audio.play().catch(() => {});
  };

  const nextQuestion = () => {

    setCurrentQuestion(
      createQuestion()
    );

    setQuestionNumber(
      (previous) =>
        previous + 1
    );

    setSelectedAnswer(null);
  };

  const handleAnswer = (
    answer
  ) => {

    if (locked.current) {
      return;
    }

    locked.current = true;

    setSelectedAnswer(
      answer
    );

    if (
      answer ===
      currentQuestion.answer
    ) {

      playAudio(
        audioRef.current.success
      );

      schedule(() => {

        playAudio(
          audioRef.current.veryGood
        );

      }, 500);

      setShowSuccess(true);

      schedule(() => {

        setShowSuccess(false);

        nextQuestion();

        locked.current =
          false;

      }, 2500);

    } else {

      playAudio(
        audioRef.current.fail
      );

      schedule(() => {

        playAudio(
          audioRef.current.tryAgain
        );

      }, 500);

      setShowWrong(true);

      schedule(() => {

        setShowWrong(false);

        setSelectedAnswer(null);

        locked.current =
          false;

      }, 2500);
    }
  };

  const handlePrint = () => {

    const count =
      Number(printCount);

    if (
      !Number.isInteger(count) ||
      count < 1 ||
      count > 200
    ) {

      alert(
        "Please enter a number between 1 and 200."
      );

      return;
    }

    const questions =
      createPrintQuestions(
        count,
        language
      );

    setShowPrintPopup(false);

    printQuestions(
      questions
    );
  };

  const displayedQuestion =
    currentQuestion.question[
      language
    ];

  return (
    <div className="level2-quiz">

      <button
        className="level2-back"
        onClick={onBack}
      >
        ← BACK
      </button>

      <h1>
        Day & Date
      </h1>

      <h2>
        Level 2 - Ninna, Today
      </h2>

      {/* LANGUAGE */}

      <div className="level2-language">

        <button
          className={
            language === "telugu"
              ? "active"
              : ""
          }
          onClick={() =>
            setLanguage("telugu")
          }
        >
          తెలుగు
        </button>

        <button
          className={
            language === "english"
              ? "active"
              : ""
          }
          onClick={() =>
            setLanguage("english")
          }
        >
          English
        </button>

      </div>

      <div className="level2-progress">
        Question {questionNumber}
      </div>

      {/* QUESTION */}

      <div className="level2-card">

        <h3>
          {displayedQuestion}
        </h3>

        <div className="level2-options">

          {currentQuestion.options.map(
            (option) => {

              let className =
                "level2-option";

              if (
                selectedAnswer === option
              ) {

                if (
                  option ===
                  currentQuestion.answer
                ) {

                  className +=
                    " correct";

                } else {

                  className +=
                    " wrong";
                }
              }

              return (
                <button
                  key={option}
                  className={className}
                  onClick={() =>
                    handleAnswer(option)
                  }
                  disabled={
                    selectedAnswer !== null
                  }
                >
                  {option}
                </button>
              );
            }
          )}

        </div>

      </div>

      {/* PRINT */}

      <button
        className="level2-print"
        onClick={() =>
          setShowPrintPopup(true)
        }
      >
        🖨️ PRINT QUESTIONS
      </button>

      {/* WRONG */}

      {showWrong && (
        <div className="quiz-popup">

          <div className="wrong-box">

            <div>❌</div>

            <h2>
              {language === "telugu"
                ? "Malli try cheyu!"
                : "Try again!"}
            </h2>

          </div>

        </div>
      )}

      {/* SUCCESS */}

      {showSuccess && (
        <div className="quiz-popup">

          <div className="success-box">

            <div>
              🎉
            </div>

            <h2>
              VERY GOOD!
            </h2>

            <p>
              {language === "telugu"
                ? "Super! Correct answer!"
                : "Great! Correct answer!"}
            </p>

          </div>

        </div>
      )}

      {/* PRINT POPUP */}

      {showPrintPopup && (

        <div className="print-overlay">

          <div className="print-box">

            <button
              className="print-close"
              onClick={() =>
                setShowPrintPopup(false)
              }
            >
              ×
            </button>

            <div className="print-icon">
              🖨️
            </div>

            <h2>
              Print Questions
            </h2>

            <p>
              How many questions do you want
              to print?
            </p>

            <input
              type="number"
              min="1"
              max="200"
              value={printCount}
              onChange={(event) =>
                setPrintCount(
                  event.target.value
                )
              }
            />

            <p className="print-info">
              A4 format • No answers
            </p>

            <div className="print-buttons">

              <button
                onClick={() =>
                  setShowPrintPopup(false)
                }
              >
                CANCEL
              </button>

              <button
                onClick={handlePrint}
              >
                PRINT
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Level2NinnaToday;