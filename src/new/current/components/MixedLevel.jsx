
import { useState } from "react";
import "./MixedLevel.css";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

const COMBINATIONS = [
  { label: "Level 1 + Level 2", value: "1,2" },
  { label: "Level 1 + Level 2 + Level 3", value: "1,2,3" },
  { label: "Level 1 + Level 3", value: "1,3" },
  { label: "Level 1 + Level 4 + Level 5", value: "1,4,5" },
  { label: "Level 2 + Level 3 + Level 4", value: "2,3,4" },
  { label: "Levels 1 to 5", value: "1,2,3,4,5" },
];

const FAMILY_DATES = [
  { name: "Amma's Birthday", date: "10 January" },
  { name: "Nanna's Birthday", date: "20 March" },
  { name: "Anna's Birthday", date: "15 June" },
  { name: "Akka's Birthday", date: "25 September" },
];

const SPECIAL_DAYS = [
  { name: "Independence Day", date: "15 August" },
  { name: "Republic Day", date: "26 January" },
  { name: "Gandhi Jayanti", date: "2 October" },
  { name: "Children's Day", date: "14 November" },
  { name: "Teachers' Day", date: "5 September" },
  { name: "Christmas", date: "25 December" },
  { name: "New Year", date: "1 January" },
];

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeOptions(correct, pool) {
  const others = shuffle(pool.filter((item) => item !== correct)).slice(0, 3);
  return shuffle([correct, ...others]);
}

function dayAtOffset(day, offset) {
  const index = DAYS.indexOf(day);
  return DAYS[(index + offset + 7 * 10) % 7];
}

function makeQuestion(level) {
  if (level === 1) {
    const day = DAYS[Math.floor(Math.random() * DAYS.length)];

    return {
      question: `Today is ${day}. What day is today?`,
      options: makeOptions(day, DAYS),
      answer: day,
      level,
    };
  }

  if (level === 2) {
    const reference = ["yesterday", "today", "tomorrow"][
      Math.floor(Math.random() * 3)
    ];
    const today = DAYS[Math.floor(Math.random() * DAYS.length)];

    const referenceDay =
      reference === "yesterday"
        ? dayAtOffset(today, -1)
        : reference === "tomorrow"
        ? dayAtOffset(today, 1)
        : today;

    return {
      question: `If ${reference} is ${referenceDay}, what day is today?`,
      options: makeOptions(today, DAYS),
      answer: today,
      level,
    };
  }

  if (level === 3) {
    const day = DAYS[Math.floor(Math.random() * DAYS.length)];
    const offset = Math.floor(Math.random() * 7) + 1;
    const direction = Math.random() < 0.5 ? -1 : 1;
    const answer = dayAtOffset(day, offset * direction);

    return {
      question: `What day is ${offset} day(s) ${
        direction < 0 ? "before" : "after"
      } ${day}?`,
      options: makeOptions(answer, DAYS),
      answer,
      level,
    };
  }

  if (level === 4) {
    const useMonth = Math.random() < 0.5;
    const list = useMonth ? MONTHS : DAYS;
    const index = Math.floor(Math.random() * list.length);
    const direction = Math.random() < 0.5 ? -1 : 1;
    const answer = list[(index + direction + list.length) % list.length];

    return {
      question: `What comes ${
        direction < 0 ? "before" : "after"
      } ${list[index]}?`,
      options: makeOptions(answer, list),
      answer,
      level,
    };
  }

  const eventList = [...FAMILY_DATES, ...SPECIAL_DAYS];
  const event = eventList[Math.floor(Math.random() * eventList.length)];

  return {
    question: `When is ${event.name}?`,
    options: makeOptions(
      event.date,
      eventList.map((item) => item.date)
    ),
    answer: event.date,
    level,
  };
}

function makeQuestionSet(selectedLevels, count = 20) {
  return shuffle(
    Array.from({ length: count }, () => {
      const level =
        selectedLevels[Math.floor(Math.random() * selectedLevels.length)];
      return makeQuestion(level);
    })
  );
}

function MixedLevel({ onBack }) {
  const [combination, setCombination] = useState("1,2,3");
  const [questions, setQuestions] = useState(() =>
    makeQuestionSet([1, 2, 3])
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  function startGame(value = combination) {
    const selectedLevels = value.split(",").map(Number);

    setCombination(value);
    setQuestions(makeQuestionSet(selectedLevels));
    setCurrentIndex(0);
    setSelectedAnswer("");
    setFeedback("");
    setScore(0);
    setFinished(false);
  }

  function checkAnswer(option) {
    if (selectedAnswer || finished) return;

    setSelectedAnswer(option);

    if (option === currentQuestion.answer) {
      setFeedback("Correct! Well done! 🎉");
      setScore((previous) => previous + 1);

      const audio = new Audio("/sounds/success-1-6297.mp3");
      audio.play().catch(() => {});
    } else {
      setFeedback(`Try again! The correct answer is ${currentQuestion.answer}.`);

      const audio = new Audio("/sounds/fail-2-2777575.mp3");
      audio.play().catch(() => {});
    }
  }

  function nextQuestion() {
    if (!selectedAnswer) return;

    if (currentIndex === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setSelectedAnswer("");
    setFeedback("");
  }

  function printQuestions() {
    const printWindow = window.open("", "_blank", "width=850,height=650");

    if (!printWindow) {
      alert("Please allow pop-ups to print the question paper.");
      return;
    }

    const questionHTML = questions
      .map(
        (question, index) => `
          <div class="question">
            <p><strong>${index + 1}.</strong> ${question.question}</p>
            <div class="options">
              ${question.options
                .map((option, optionIndex) =>
                  `<span>${String.fromCharCode(65 + optionIndex)}. ${option}</span>`
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
          <title>Mixed Level Question Paper</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: Arial, sans-serif; color: #111; }
            h1 { text-align: center; font-size: 22px; }
            .details { display: flex; justify-content: space-between; margin: 24px 0; }
            .question { margin-bottom: 18px; break-inside: avoid; }
            .options { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          </style>
        </head>
        <body>
          <h1>Day & Date — Mixed Level</h1>
          <div class="details">
            <span>Name: __________________</span>
            <span>Date: ______________</span>
          </div>
          ${questionHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  return (
    <div className="mixed-level-page">
      <button className="mixed-back-button" onClick={onBack}>
        ← BACK
      </button>

      <header className="mixed-header">
        <span className="mixed-icon">🎯</span>
        <h1>Mixed Level</h1>
        <p>Practice questions from different levels</p>
      </header>

      <section className="mixed-settings">
        <label htmlFor="level-combination">
          Choose level combination
        </label>

        <select
          id="level-combination"
          value={combination}
          onChange={(event) => startGame(event.target.value)}
        >
          {COMBINATIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <button className="mixed-secondary-button" onClick={printQuestions}>
          🖨️ Print Questions
        </button>
      </section>

      {finished ? (
        <section className="mixed-result">
          <h2>Game Completed! 🎉</h2>
          <p>
            Your score: <strong>{score}</strong> / {questions.length}
          </p>
          <button onClick={() => startGame()}>
            Play Again
          </button>
        </section>
      ) : (
        <section className="mixed-question-card">
          <div className="mixed-progress">
            Question {currentIndex + 1} of {questions.length}
            <span>Level {currentQuestion.level}</span>
          </div>

          <div className="mixed-progress-track">
            <div
              className="mixed-progress-fill"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <h2>{currentQuestion.question}</h2>

          <div className="mixed-options">
            {currentQuestion.options.map((option, index) => {
              let className = "mixed-option";

              if (selectedAnswer && option === currentQuestion.answer) {
                className += " correct-option";
              } else if (selectedAnswer === option) {
                className += " wrong-option";
              }

              return (
                <button
                  key={`${currentIndex}-${option}-${index}`}
                  className={className}
                  onClick={() => checkAnswer(option)}
                  disabled={Boolean(selectedAnswer)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  {option}
                </button>
              );
            })}
          </div>

          {feedback && (
            <p
              className={`mixed-feedback ${
                selectedAnswer === currentQuestion.answer ? "is-correct" : "is-wrong"
              }`}
              role="status"
            >
              {feedback}
            </p>
          )}

          <div className="mixed-footer">
            <span>Score: {score}</span>
            <button
              className="mixed-next-button"
              onClick={nextQuestion}
              disabled={!selectedAnswer}
            >
              {currentIndex === questions.length - 1
                ? "Finish"
                : "Next Question →"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default MixedLevel;
