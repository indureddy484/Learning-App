
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
  return days[(index + offset + days.length) % days.length];
}

function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

function createOptions(answer) {
  const wrongAnswers = shuffleArray(
    days.filter((day) => day !== answer)
  ).slice(0, 3);

  return shuffleArray([answer, ...wrongAnswers]);
}

function createQuestion() {
  const referenceDay =
    days[Math.floor(Math.random() * days.length)];

  const type = Math.floor(Math.random() * 4) + 1;

  let questionTelugu;
  let questionEnglish;
  let answer;

  if (type === 1) {
    answer = getDay(referenceDay, -1);
    questionTelugu = `Ivvala ${referenceDay} aithe, ninna em day padindi?`;
    questionEnglish = `If today is ${referenceDay}, what day was yesterday?`;
  } else if (type === 2) {
    answer = getDay(referenceDay, 1);
    questionTelugu = `Ivvala ${referenceDay} aithe, repu em day avtadi?`;
    questionEnglish = `If today is ${referenceDay}, what day is tomorrow?`;
  } else if (type === 3) {
    answer = getDay(referenceDay, -1);
    questionTelugu = `Repu ${referenceDay} aithe, ivala em day avtadi?`;
    questionEnglish = `If tomorrow is ${referenceDay}, what day is today?`;
  } else {
    answer = getDay(referenceDay, -2);
    questionTelugu = `Repu ${referenceDay} aithe, ninna em day padindi?`;
    questionEnglish = `If tomorrow is ${referenceDay}, what day was yesterday?`;
  }

  return {
    question: {
      telugu: questionTelugu,
      english: questionEnglish,
    },
    options: createOptions(answer),
    answer,
  };
}

function createPrintQuestions(count, language) {
  return Array.from({ length: count }, (_, index) => {
    const question = createQuestion();

    return {
      ...question,
      number: index + 1,
      text: question.question[language],
    };
  });
}

function printQuestions(questions) {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    alert("Please allow pop-ups to print the question paper.");
    return;
  }

  const questionsHTML = questions
    .map(
      (question) => `
        <div class="question">
          <div class="question-text">
            ${question.number}. ${question.text}
          </div>

          <div class="options">
            ${question.options
              .map(
                (option, index) => `
                  <div class="option">
                    ${String.fromCharCode(65 + index)}) ${option}
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
      <title>Level 2 - Ninna, Today</title>

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
          padding: 0;
          font-family: Arial, Helvetica, sans-serif;
          color: #111;
          background: white;
          font-size: 18px;
        }

        .paper {
          width: 100%;
        }

        .header {
          text-align: center;
          border-bottom: 2px solid #222;
          padding-bottom: 14px;
          margin-bottom: 24px;
        }

        .header h1 {
          margin: 0 0 8px;
          font-size: 26px;
          font-weight: bold;
        }

        .header h2 {
          margin: 0;
          font-size: 21px;
          font-weight: normal;
        }

        .student-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 28px;
        }

        .line {
          border-bottom: 1px solid #222;
          padding-bottom: 8px;
          font-size: 19px;
          min-height: 32px;
        }

        .instructions {
          font-size: 19px;
          font-weight: bold;
          margin-bottom: 24px;
        }

        .question {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }

        .question-text {
          font-size: 21px;
          font-weight: 600;
          line-height: 1.6;
          margin-bottom: 14px;
        }

        .options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-left: 22px;
        }

        .option {
          font-size: 19px;
          line-height: 1.6;
        }

        .footer {
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #999;
          text-align: center;
          font-size: 12px;
          color: #666;
        }

        @media print {
          .question {
            break-inside: avoid;
          }
        }
      </style>
    </head>

    <body>
      <div class="paper">
        <div class="header">
          <h1>Day &amp; Date Quiz</h1>
          <h2>Level 2 - Ninna, Today</h2>
        </div>

        <div class="student-info">
          <div class="line">Name:</div>
          <div class="line">Date:</div>
        </div>

        <div class="instructions">
          Choose the correct answer.
        </div>

        ${questionsHTML}

        <div class="footer">Level 2 - Ninna, Today</div>
      </div>

      <script>
        window.onload = function () {
          setTimeout(function () {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `);

  printWindow.document.close();
}

function Level2NinnaToday({ onBack }) {
  const [language, setLanguage] = useState("telugu");
  const [currentQuestion, setCurrentQuestion] = useState(createQuestion);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showWrong, setShowWrong] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPrintPopup, setShowPrintPopup] = useState(false);
  const [printCount, setPrintCount] = useState("10");

  const locked = useRef(false);
  const timers = useRef([]);
  const audioRef = useRef(null);

  if (!audioRef.current) {
    audioRef.current = {
      success: new Audio("/sounds/success-1-6297.mp3"),
      fail: new Audio("/sounds/fail-2-2777575.mp3"),
      veryGood: new Audio("/sounds/very-good.mp3"),
      tryAgain: new Audio("/sounds/try-again.mp3"),
    };
  }

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);

      Object.values(audioRef.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  const schedule = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timers.current.push(id);
  };

  const playAudio = (audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const nextQuestion = () => {
    setCurrentQuestion(createQuestion());
    setQuestionNumber((previous) => previous + 1);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer) => {
    if (locked.current) return;

    locked.current = true;
    setSelectedAnswer(answer);

    if (answer === currentQuestion.answer) {
      playAudio(audioRef.current.success);

      schedule(() => {
        playAudio(audioRef.current.veryGood);
      }, 500);

      setShowSuccess(true);

      schedule(() => {
        setShowSuccess(false);
        nextQuestion();
        locked.current = false;
      }, 2500);
    } else {
      playAudio(audioRef.current.fail);

      schedule(() => {
        playAudio(audioRef.current.tryAgain);
      }, 500);

      setShowWrong(true);

      schedule(() => {
        setShowWrong(false);
        setSelectedAnswer(null);
        locked.current = false;
      }, 2500);
    }
  };

  const handlePrint = () => {
    const count = Number(printCount);

    if (!Number.isInteger(count) || count < 1 || count > 200) {
      alert("Please enter a number between 1 and 200.");
      return;
    }

    const questions = createPrintQuestions(count, language);

    setShowPrintPopup(false);
    printQuestions(questions);
  };

  const displayedQuestion = currentQuestion.question[language];

  return (
    <div className="level2-quiz">
      <button className="level2-back" onClick={onBack}>
        ← BACK
      </button>

      <h1>Day &amp; Date</h1>
      <h2>Level 2 - Ninna, Today</h2>

      <div className="level2-language">
        <button
          className={language === "telugu" ? "active" : ""}
          onClick={() => setLanguage("telugu")}
        >
          తెలుగు
        </button>

        <button
          className={language === "english" ? "active" : ""}
          onClick={() => setLanguage("english")}
        >
          English
        </button>
      </div>

      <div className="level2-progress">
        Question {questionNumber}
      </div>

      <div className="level2-card">
        <h3>{displayedQuestion}</h3>

        <div className="level2-options">
          {currentQuestion.options.map((option) => {
            let className = "level2-option";

            if (selectedAnswer === option) {
              className +=
                option === currentQuestion.answer
                  ? " correct"
                  : " wrong";
            }

            return (
              <button
                key={option}
                className={className}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <button
        className="level2-print"
        onClick={() => setShowPrintPopup(true)}
      >
        🖨️ PRINT QUESTIONS
      </button>

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

      {showSuccess && (
        <div className="quiz-popup">
          <div className="success-box">
            <div>🎉</div>
            <h2>VERY GOOD!</h2>
            <p>
              {language === "telugu"
                ? "Super! Correct answer!"
                : "Great! Correct answer!"}
            </p>
          </div>
        </div>
      )}

      {showPrintPopup && (
        <div className="print-overlay">
          <div className="print-box">
            <button
              className="print-close"
              onClick={() => setShowPrintPopup(false)}
            >
              ×
            </button>

            <div className="print-icon">🖨️</div>

            <h2>Print Questions</h2>

            <p>How many questions do you want to print?</p>

            <input
              type="number"
              min="1"
              max="200"
              value={printCount}
              onChange={(event) => setPrintCount(event.target.value)}
            />

            <p className="print-info">A4 format • No answers</p>

            <div className="print-buttons">
              <button onClick={() => setShowPrintPopup(false)}>
                CANCEL
              </button>

              <button onClick={handlePrint}>
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
