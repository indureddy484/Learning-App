
import { useEffect, useRef, useState } from "react";
import "./Level5SpecialDays.css";

/* =========================================
   FAMILY BIRTHDAYS
   CHANGE THESE DATES WHEN NEEDED
========================================= */

const familyDates = {
  ammaBirthday: "10 January",
  nannaBirthday: "20 March",
  annaBirthday: "15 June",
  akkaBirthday: "25 September",
};

/* =========================================
   SPECIAL DAYS
========================================= */

const specialDays = [
  { name: "Krishna Ashtami", date: "August 16" },
  { name: "Independence Day", date: "August 15" },
  { name: "Republic Day", date: "January 26" },
  { name: "Gandhi Jayanti", date: "October 2" },
  { name: "Children's Day", date: "November 14" },
  { name: "Teachers' Day", date: "September 5" },
  { name: "Christmas", date: "December 25" },
  { name: "New Year", date: "January 1" },
];

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getAllEvents() {
  return [
    ...specialDays,
    { name: "Amma Birthday", date: familyDates.ammaBirthday },
    { name: "Nanna Birthday", date: familyDates.nannaBirthday },
    { name: "Anna Birthday", date: familyDates.annaBirthday },
    { name: "Akka Birthday", date: familyDates.akkaBirthday },
  ];
}

function parseDate(dateString) {
  const parts = dateString.split(" ");
  return {
    day: Number(parts[1]),
    month: parts[0],
  };
}

function getMonthNumber(month) {
  return months.indexOf(month) + 1;
}

function formatDate(day, month) {
  return `${month} ${day}`;
}

/* =========================================
   CREATE DATE OPTIONS
========================================= */

function createDateOptions(answer) {
  const events = getAllEvents();
  const uniqueDates = [...new Set(events.map((event) => event.date))];

  const wrongDates = shuffleArray(
    uniqueDates.filter((date) => date !== answer)
  ).slice(0, 3);

  return shuffleArray([answer, ...wrongDates]);
}

/* =========================================
   CREATE DATE ORDER OPTIONS
========================================= */

function createNearbyDateOptions(day, month, direction) {
  const monthIndex = getMonthNumber(month) - 1;

  let answerDay = day;
  let answerMonthIndex = monthIndex;

  if (direction === "before") {
    answerDay = day - 1;

    if (answerDay < 1) {
      answerMonthIndex = (monthIndex - 1 + 12) % 12;
      answerDay = 30;
    }
  } else {
    answerDay = day + 1;

    if (answerDay > 31) {
      answerMonthIndex = (monthIndex + 1) % 12;
      answerDay = 1;
    }
  }

  const answer = formatDate(answerDay, months[answerMonthIndex]);
  const candidates = [];

  for (let i = 0; i < 30 && candidates.length < 3; i++) {
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    const date = formatDate(randomDay, randomMonth);

    if (date !== answer && !candidates.includes(date)) {
      candidates.push(date);
    }
  }

  return {
    answer,
    options: shuffleArray([answer, ...candidates]),
  };
}

/* =========================================
   CREATE QUESTION
========================================= */

function createQuestion() {
  const events = getAllEvents();
  const questionType = Math.floor(Math.random() * 4);

  if (questionType === 0) {
    const event = events[Math.floor(Math.random() * events.length)];

    return {
      type: "event",
      questionTelugu: `${event.name} eppudu?`,
      questionEnglish: `When is ${event.name}?`,
      answer: event.date,
      options: createDateOptions(event.date),
    };
  }

  if (questionType === 1) {
    const event = events[Math.floor(Math.random() * events.length)];
    const parsed = parseDate(event.date);
    const result = createNearbyDateOptions(
      parsed.day,
      parsed.month,
      "before"
    );

    return {
      type: "before",
      questionTelugu: `${event.date} ki mundu em date untundi?`,
      questionEnglish: `What date comes before ${event.date}?`,
      answer: result.answer,
      options: result.options,
    };
  }

  if (questionType === 2) {
    const event = events[Math.floor(Math.random() * events.length)];
    const parsed = parseDate(event.date);
    const result = createNearbyDateOptions(
      parsed.day,
      parsed.month,
      "after"
    );

    return {
      type: "after",
      questionTelugu: `${event.date} tarvatha em date vastundi?`,
      questionEnglish: `What date comes after ${event.date}?`,
      answer: result.answer,
      options: result.options,
    };
  }

  const event = events[Math.floor(Math.random() * events.length)];
  const wrongEvents = shuffleArray(
    events.filter((item) => item.name !== event.name)
  ).slice(0, 3);

  const options = shuffleArray([
    event.name,
    ...wrongEvents.map((item) => item.name),
  ]);

  return {
    type: "eventName",
    questionTelugu: `${event.date} na em special day?`,
    questionEnglish: `What special day is on ${event.date}?`,
    answer: event.name,
    options,
  };
}

/* =========================================
   CREATE PRINT QUESTIONS
========================================= */

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

/* =========================================
   PRINT QUESTIONS — LARGE A4 TEXT
========================================= */

function printQuestions(questions, language) {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    alert("Please allow pop-ups to print the questions.");
    return;
  }

  const title = "Special Days & Events";

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
                  <div class="option">${option}</div>
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
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            margin: 0;
            color: #222;
            background: white;
            font-size: 19px;
          }

          .header {
            text-align: center;
            margin-bottom: 24px;
          }

          .header h1 {
            margin: 0 0 10px;
            font-size: 28px;
          }

          .header p {
            margin: 4px 0;
            font-size: 20px;
          }

          .student-details {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin: 24px 0;
            font-size: 19px;
          }

          .line {
            display: inline-block;
            width: 180px;
            border-bottom: 1px solid #333;
            margin-left: 5px;
          }

          .question {
            margin-bottom: 28px;
            page-break-inside: avoid;
          }

          .question-text {
            font-size: 21px;
            font-weight: bold;
            line-height: 1.5;
            margin-bottom: 12px;
          }

          .options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 25px;
            padding-left: 18px;
          }

          .option {
            font-size: 19px;
            line-height: 1.5;
            padding: 4px 0;
            overflow-wrap: anywhere;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>

      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Level 5</p>
        </div>

        <div class="student-details">
          <div>Name: <span class="line"></span></div>
          <div>Date: <span class="line"></span></div>
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

/* =========================================
   LEVEL 5 COMPONENT
========================================= */

function Level5SpecialDays({ onBack }) {
  const [language, setLanguage] = useState("telugu");
  const [question, setQuestion] = useState(createQuestion());
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showPrintPopup, setShowPrintPopup] = useState(false);
  const [printCount, setPrintCount] = useState(10);

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
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);

    if (answer === question.answer) {
      setIsCorrect(true);
      setShowPopup(true);
      playCorrectSounds();

      setTimeout(() => {
        setShowPopup(false);
        setSelectedAnswer(null);
        setQuestion(createQuestion());
        setQuestionNumber((previous) => previous + 1);
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

    if (!count || count < 1 || count > 200) return;

    const questions = createPrintQuestions(count, language);
    printQuestions(questions, language);
    setShowPrintPopup(false);
  };

  return (
    <div className="level5-quiz">
      <button className="level5-back" onClick={onBack}>
        ← BACK
      </button>

      <div className="level5-hero">
        <div className="level5-hero-icon">🎉</div>

        <div>
          <h1>Special Days</h1>
          <p>Birthdays • Festivals • Events</p>
        </div>

        <div className="level5-hero-icon">📅</div>
      </div>

      <div className="level5-language">
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

      <div className="level5-progress">
        <span>Question</span>
        <strong>{questionNumber}</strong>
      </div>

      <div className="level5-card">
        <div className="level5-card-top">📖</div>

        <h2>{currentQuestion}</h2>

        <div className="level5-options">
          {question.options.map((option) => {
            let className = "level5-option";

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
        className="level5-print"
        onClick={() => setShowPrintPopup(true)}
      >
        🖨️ PRINT QUESTIONS
      </button>

      {showPopup && (
        <div className="level5-popup-overlay">
          {isCorrect ? (
            <div className="level5-success-box">
              <div className="level5-popup-icon">🎉</div>
              <h2>Very Good!</h2>
              <p>Correct Answer!</p>
            </div>
          ) : (
            <div className="level5-wrong-box">
              <div className="level5-popup-icon">💭</div>
              <h2>Malli try cheyu!</h2>
              <p>Try Again</p>
            </div>
          )}
        </div>
      )}

      {showPrintPopup && (
        <div className="level5-print-overlay">
          <div className="level5-print-box">
            <button
              className="level5-print-close"
              onClick={() => setShowPrintPopup(false)}
            >
              ×
            </button>

            <div className="level5-print-icon">🖨️</div>

            <h2>Print Questions</h2>

            <p>How many questions do you want to print?</p>

            <input
              type="number"
              min="1"
              max="200"
              value={printCount}
              onChange={(e) => setPrintCount(e.target.value)}
            />

            <p className="level5-print-info">
              Maximum 200 questions
            </p>

            <div className="level5-print-buttons">
              <button onClick={() => setShowPrintPopup(false)}>
                Cancel
              </button>

              <button onClick={handlePrint}>
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Level5SpecialDays;
