import { useEffect, useRef, useState } from "react";
import "./Level4DaysMonths.css";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function createOptions(answer, list) {
  const wrongAnswers = shuffleArray(
    list.filter((item) => item !== answer)
  ).slice(0, 3);

  return shuffleArray([answer, ...wrongAnswers]);
}

function getPrevious(list, index) {
  return list[(index - 1 + list.length) % list.length];
}

function getNext(list, index) {
  return list[(index + 1) % list.length];
}

function createQuestion() {
  const isDay = Math.random() < 0.5;
  const list = isDay ? days : months;

  const referenceIndex = Math.floor(
    Math.random() * list.length
  );

  const reference = list[referenceIndex];

  const askAfter = Math.random() < 0.5;

  const answer = askAfter
    ? getNext(list, referenceIndex)
    : getPrevious(list, referenceIndex);

  const options = createOptions(answer, list);

  let teluguQuestion;
  let englishQuestion;

  if (isDay) {
    teluguQuestion = askAfter
      ? `${reference} tarvatha em day vastundi?`
      : `${reference} mundu em day untundi?`;

    englishQuestion = askAfter
      ? `What day comes after ${reference}?`
      : `What day comes before ${reference}?`;
  } else {
    teluguQuestion = askAfter
      ? `${reference} tarvatha em month vastundi?`
      : `${reference} mundu em month untundi?`;

    englishQuestion = askAfter
      ? `What month comes after ${reference}?`
      : `What month comes before ${reference}?`;
  }

  return {
    type: isDay ? "day" : "month",
    questionTelugu: teluguQuestion,
    questionEnglish: englishQuestion,
    answer,
    options,
  };
}

function createPrintQuestions(count, language) {
  const questions = [];

  for (let i = 0; i < count; i++) {
    const question = createQuestion();

    questions.push({
      ...question,
      displayQuestion:
        language === "telugu"
          ? question.questionTelugu
          : question.questionEnglish,
    });
  }

  return questions;
}

function printQuestions(questions, language) {
  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=700"
  );

  if (!printWindow) {
    alert("Please allow pop-ups to print the questions.");
    return;
  }

  const title =
    language === "telugu"
      ? "Days & Months - Questions"
      : "Days & Months - Questions";

  const questionHTML = questions
    .map(
      (question, index) => `
        <div class="question">
          <div class="question-text">
            ${index + 1}. ${question.displayQuestion}
          </div>

          <div class="options">
            ${question.options
              .map(
                (option) => `
                  <div class="option">
                    ${option}
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
        <title>${title}</title>

        <style>
          @page {
            size: A4;
            margin: 15mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            margin: 0;
            color: #222;
            background: white;
          }

          .header {
            text-align: center;
            margin-bottom: 20px;
          }

          .header h1 {
            margin: 0 0 8px;
            font-size: 24px;
          }

          .header p {
            margin: 4px 0;
            font-size: 14px;
          }

          .student-details {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
            font-size: 14px;
          }

          .line {
            display: inline-block;
            width: 180px;
            border-bottom: 1px solid #333;
            margin-left: 5px;
          }

          .question {
            margin-bottom: 18px;
            page-break-inside: avoid;
          }

          .question-text {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
          }

          .options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px 25px;
            padding-left: 15px;
          }

          .option {
            font-size: 14px;
            padding: 3px 0;
          }
        </style>
      </head>

      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Level 4</p>
        </div>

        <div class="student-details">
          <div>
            Name:
            <span class="line"></span>
          </div>

          <div>
            Date:
            <span class="line"></span>
          </div>
        </div>

        ${questionHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 500);
}

function Level4DaysMonths({ onBack }) {
  const [language, setLanguage] = useState("telugu");

  const [question, setQuestion] = useState(
    createQuestion()
  );

  const [questionNumber, setQuestionNumber] =
    useState(1);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [showPopup, setShowPopup] =
    useState(false);

  const [isCorrect, setIsCorrect] =
    useState(false);

  const [showPrintPopup, setShowPrintPopup] =
    useState(false);

  const [printCount, setPrintCount] =
    useState(10);

  const successAudio = useRef(
    new Audio("/sounds/success-1-6297.mp3")
  );

  const failAudio = useRef(
    new Audio("/sounds/fail-2-2777575.mp3")
  );

  const veryGoodAudio = useRef(
    new Audio("/sounds/very-good.mp3")
  );

  const tryAgainAudio = useRef(
    new Audio("/sounds/try-again.mp3")
  );

  useEffect(() => {
    return () => {
      successAudio.current.pause();
      failAudio.current.pause();
      veryGoodAudio.current.pause();
      tryAgainAudio.current.pause();
    };
  }, []);

  const playCorrectSounds = () => {
    successAudio.current.currentTime = 0;
    successAudio.current.play().catch(() => {});

    setTimeout(() => {
      veryGoodAudio.current.currentTime = 0;
      veryGoodAudio.current.play().catch(() => {});
    }, 500);
  };

  const playWrongSounds = () => {
    failAudio.current.currentTime = 0;
    failAudio.current.play().catch(() => {});

    setTimeout(() => {
      tryAgainAudio.current.currentTime = 0;
      tryAgainAudio.current.play().catch(() => {});
    }, 500);
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answer);

    if (answer === question.answer) {
      setIsCorrect(true);
      setShowPopup(true);

      playCorrectSounds();

      setTimeout(() => {
        setShowPopup(false);
        setSelectedAnswer(null);

        setQuestion(createQuestion());
        setQuestionNumber((prev) => prev + 1);
      }, 2500);
    } else {
      setIsCorrect(false);
      setShowPopup(true);

      playWrongSounds();

      setTimeout(() => {
        setShowPopup(false);
        setSelectedAnswer(null);
      }, 2500);
    }
  };

  const currentQuestion =
    language === "telugu"
      ? question.questionTelugu
      : question.questionEnglish;

  const handlePrint = () => {
    const count = Number(printCount);

    if (!count || count < 1 || count > 200) {
      return;
    }

    const questions = createPrintQuestions(
      count,
      language
    );

    printQuestions(questions, language);

    setShowPrintPopup(false);
  };

  return (
    <div className="level4-quiz">

      {/* BACK BUTTON */}

      <button
        className="level4-back"
        onClick={onBack}
      >
        ← BACK
      </button>

      {/* HEADER */}

      <h1>Days & Months</h1>

      <h2>General Questions</h2>

      {/* LANGUAGE BUTTONS */}

      <div className="level4-language">

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

      {/* PROGRESS */}

      <div className="level4-progress">
        Question {questionNumber}
      </div>

      {/* QUESTION */}

      <div className="level4-card">

        <h3>
          {currentQuestion}
        </h3>

        <div className="level4-options">

          {question.options.map(
            (option) => {

              let className =
                "level4-option";

              if (
                selectedAnswer !== null &&
                option === question.answer
              ) {
                className += " correct";
              }

              if (
                selectedAnswer === option &&
                option !== question.answer
              ) {
                className += " wrong";
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
        className="level4-print"
        onClick={() =>
          setShowPrintPopup(true)
        }
      >
        🖨️ PRINT QUESTIONS
      </button>

      {/* SUCCESS / WRONG POPUP */}

      {showPopup && (
        <div className="quiz-popup">

          {isCorrect ? (
            <div className="success-box">

              <div className="popup-icon">
                🎉
              </div>

              <h2>
                Very Good!
              </h2>

              <p>
                Correct Answer!
              </p>

            </div>
          ) : (
            <div className="wrong-box">

              <div className="popup-icon">
                ❌
              </div>

              <h2>
                Malli try cheyu!
              </h2>

              <p>
                Try Again
              </p>

            </div>
          )}

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
              How many questions do you
              want to print?
            </p>

            <input
              type="number"
              min="1"
              max="200"
              value={printCount}
              onChange={(e) =>
                setPrintCount(e.target.value)
              }
            />

            <p className="print-info">
              Maximum 200 questions
            </p>

            <div className="print-buttons">

              <button
                onClick={() =>
                  setShowPrintPopup(false)
                }
              >
                Cancel
              </button>

              <button
                onClick={handlePrint}
              >
                Print
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Level4DaysMonths;