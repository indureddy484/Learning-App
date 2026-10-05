import { useState, useRef, useEffect } from "react";
import "./DayQuiz.css";

// =====================================================
// DAYS
// =====================================================

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// =====================================================
// SHUFFLE
// =====================================================

function shuffleArray(array) {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [newArray[i], newArray[j]] = [
      newArray[j],
      newArray[i],
    ];
  }

  return newArray;
}

// =====================================================
// RANDOM NUMBER
// =====================================================

function randomNumber(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

// =====================================================
// GET DAY
// =====================================================

function getDay(day, amount) {
  const index = days.indexOf(day);

  return days[
    (index + amount + days.length) % days.length
  ];
}

// =====================================================
// CREATE DAY OPTIONS
// =====================================================

function createDayOptions(correctAnswer) {
  const possibleAnswers = [
    getDay(correctAnswer, -3),
    getDay(correctAnswer, -2),
    getDay(correctAnswer, -1),
    getDay(correctAnswer, 1),
    getDay(correctAnswer, 2),
    getDay(correctAnswer, 3),
  ];

  const wrongAnswers = shuffleArray(
    possibleAnswers.filter(
      (day) => day !== correctAnswer
    )
  ).slice(0, 3);

  return shuffleArray([
    correctAnswer,
    ...wrongAnswers,
  ]);
}

// =====================================================
// RANDOM DAY QUESTION
// =====================================================

function createRandomDayQuestion() {
  const type = randomNumber(1, 7);

  const randomDay =
    days[randomNumber(0, days.length - 1)];

  let questionTelugu;
  let questionEnglish;
  let answer;

  // ===================================================
  // TODAY → TOMORROW
  // ===================================================

  if (type === 1) {
    answer = getDay(randomDay, 1);

    questionTelugu =
      `Okavela ivala ${randomDay} ayithe, ` +
      `repu em day avtadi?`;

    questionEnglish =
      `If today is ${randomDay}, ` +
      `what day is tomorrow?`;
  }

  // ===================================================
  // YESTERDAY → TODAY
  // ===================================================

  else if (type === 2) {
    const yesterday =
      getDay(randomDay, -1);

    answer = randomDay;

    questionTelugu =
      `Okavela ninna ${yesterday} ayithe, ` +
      `ivala em day avtadi?`;

    questionEnglish =
      `If yesterday was ${yesterday}, ` +
      `what day is today?`;
  }

  // ===================================================
  // TOMORROW → TODAY
  // ===================================================

  else if (type === 3) {
    const tomorrow =
      getDay(randomDay, 1);

    answer = randomDay;

    questionTelugu =
      `Okavela repu ${tomorrow} ayithe, ` +
      `ivala em day avtadi?`;

    questionEnglish =
      `If tomorrow is ${tomorrow}, ` +
      `what day is today?`;
  }

  // ===================================================
  // DAYS AFTER
  // ===================================================

  else if (type === 4) {
    const numberOfDays =
      randomNumber(1, 7);

    answer = getDay(
      randomDay,
      numberOfDays
    );

    questionTelugu =
      `Ivvala ${randomDay} ayithe, ` +
      `${numberOfDays} day${
        numberOfDays > 1 ? "s" : ""
      } taruvatha em day avtadi?`;

    questionEnglish =
      `If today is ${randomDay}, ` +
      `what day will it be ${numberOfDays} ` +
      `${numberOfDays === 1 ? "day" : "days"} from now?`;
  }

  // ===================================================
  // DAYS BEFORE
  // ===================================================

  else if (type === 5) {
    const numberOfDays =
      randomNumber(1, 7);

    answer = getDay(
      randomDay,
      -numberOfDays
    );

    questionTelugu =
      `Ivvala ${randomDay} ayithe, ` +
      `${numberOfDays} day${
        numberOfDays > 1 ? "s" : ""
      } mundu em day padindi?`;

    questionEnglish =
      `If today is ${randomDay}, ` +
      `what day was it ${numberOfDays} ` +
      `${numberOfDays === 1 ? "day" : "days"} ago?`;
  }

  // ===================================================
  // MORE DAYS AFTER
  // ===================================================

  else if (type === 6) {
    const numberOfDays =
      randomNumber(2, 6);

    answer = getDay(
      randomDay,
      numberOfDays
    );

    questionTelugu =
      `Ivvala ${randomDay} ayithe, ` +
      `${numberOfDays} days taruvatha em day avtadi?`;

    questionEnglish =
      `If today is ${randomDay}, ` +
      `what day will it be ${numberOfDays} ` +
      `days from now?`;
  }

  // ===================================================
  // MORE DAYS BEFORE
  // ===================================================

  else {
    const numberOfDays =
      randomNumber(2, 6);

    answer = getDay(
      randomDay,
      -numberOfDays
    );

    questionTelugu =
      `Ivvala ${randomDay} ayithe, ` +
      `${numberOfDays} days mundu em day padindi?`;

    questionEnglish =
      `If today is ${randomDay}, ` +
      `what day was it ${numberOfDays} ` +
      `days ago?`;
  }

  return {
    type: "mcq",

    question: {
      telugu: questionTelugu,
      english: questionEnglish,
    },

    options: createDayOptions(answer),

    answer,
  };
}

// =====================================================
// RANDOM TRUE / FALSE
// =====================================================

function createRandomTrueFalseQuestion() {
  const randomDay =
    days[randomNumber(0, days.length - 1)];

  const shouldBeTrue =
    Math.random() > 0.5;

  let statementDay;

  if (shouldBeTrue) {
    statementDay =
      getDay(randomDay, 1);
  } else {
    statementDay =
      getDay(randomDay, 2);
  }

  const answer =
    shouldBeTrue
      ? "True"
      : "False";

  return {
    type: "truefalse",

    question: {
      telugu:
        `Ivvala ${randomDay} ayithe, ` +
        `repu ${statementDay} avtadi.`,

      english:
        `If today is ${randomDay}, ` +
        `tomorrow is ${statementDay}.`,
    },

    options: [
      "True",
      "False",
    ],

    answer,
  };
}

// =====================================================
// FIXED QUESTIONS
// NO BIRTHDAY QUESTIONS
// =====================================================

const fixedQuestions = [

  // ===================================================
  // CALENDAR
  // ===================================================

  {
    type: "mcq",

    question: {
      telugu:
        "20th September 2026 emi day padindi?",

      english:
        "What day of the week was September 20, 2026?",
    },

    options: [
      "Friday",
      "Saturday",
      "Sunday",
      "Monday",
    ],

    answer: "Sunday",
  },

  {
    type: "mcq",

    question: {
      telugu:
        "20-10-26 ee date em month lo vastundi?",

      english:
        "Which month does the date October 20, 2026 fall in?",
    },

    options: [
      "August",
      "September",
      "October",
      "November",
    ],

    answer: "October",
  },

  {
    type: "mcq",

    question: {
      telugu:
        "23-9-26 ee date em day lo vachindi?",

      english:
        "What day of the week was September 23, 2026?",
    },

    options: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
    ],

    answer: "Wednesday",
  },

  {
    type: "mcq",

    question: {
      telugu:
        "September 2026 lo second Saturday date enti?",

      english:
        "What was the date of the second Saturday in September 2026?",
    },

    options: [
      "5th September",
      "12th September",
      "19th September",
      "26th September",
    ],

    answer: "12th September",
  },

  // ===================================================
  // SPECIAL DAYS
  // ===================================================

  {
    type: "mcq",

    question: {
      telugu:
        "Independence Day eppudu celebrate chesukuntam?",

      english:
        "When do we celebrate Independence Day?",
    },

    options: [
      "26th January",
      "15th August",
      "2nd October",
      "5th September",
    ],

    answer: "15th August",
  },

  {
    type: "mcq",

    question: {
      telugu:
        "Gandhi Jayanthi eppudu celebrate chesukuntam?",

      english:
        "When do we celebrate Gandhi Jayanti?",
    },

    options: [
      "15th August",
      "2nd October",
      "5th September",
      "26th January",
    ],

    answer: "2nd October",
  },

  {
    type: "mcq",

    question: {
      telugu:
        "Teachers Day eppudu celebrate chesukuntam?",

      english:
        "When do we celebrate Teachers' Day?",
    },

    options: [
      "5th September",
      "2nd October",
      "15th August",
      "14th November",
    ],

    answer: "5th September",
  },

  {
    type: "mcq",

    question: {
      telugu:
        "Dasara holidays eppudu start avtunnayi?",

      english:
        "When do the Dasara holidays start?",
    },

    options: [
      "October 5th",
      "October 8th",
      "October 10th",
      "October 15th",
    ],

    answer: "October 10th",
  },

  // ===================================================
  // TRUE / FALSE
  // ===================================================

  {
    type: "truefalse",

    question: {
      telugu:
        "20th October 2026 Friday padindi.",

      english:
        "October 20, 2026 was a Friday.",
    },

    options: [
      "True",
      "False",
    ],

    answer: "False",
  },

  {
    type: "truefalse",

    question: {
      telugu:
        "September lo fourth Saturday 23-9-26.",

      english:
        "The fourth Saturday of September 2026 was September 23.",
    },

    options: [
      "True",
      "False",
    ],

    answer: "False",
  },

  {
    type: "truefalse",

    question: {
      telugu:
        "Gandhi Jayanthi October 3rd celebrate chesukuntam.",

      english:
        "Gandhi Jayanti is celebrated on October 3rd.",
    },

    options: [
      "True",
      "False",
    ],

    answer: "False",
  },

  {
    type: "truefalse",

    question: {
      telugu:
        "20th September 2026 Sunday padindi.",

      english:
        "September 20, 2026 was a Sunday.",
    },

    options: [
      "True",
      "False",
    ],

    answer: "True",
  },

  {
    type: "truefalse",

    question: {
      telugu:
        "Teachers Day September 5th celebrate chesukuntam.",

      english:
        "Teachers' Day is celebrated on September 5th.",
    },

    options: [
      "True",
      "False",
    ],

    answer: "True",
  },

  // ===================================================
  // MATCH THE FOLLOWING
  // ===================================================

  {
    type: "match",

    question: {
      telugu: "Match the following",

      english: "Match the following",
    },

    pairs: [
      {
        left:
          "Independence Day 🇮🇳",

        right:
          "15th August",
      },

      {
        left:
          "Gandhi Jayanthi 🕊️",

        right:
          "2nd October",
      },

      {
        left:
          "23rd September 2026",

        right:
          "Wednesday",
      },

      {
        left:
          "4th October 2026",

        right:
          "Sunday",
      },
    ],
  },
];

// =====================================================
// CREATE NEXT QUESTION
// =====================================================

function createNextQuestion(
  questionNumber,
  fixedIndex
) {
  // Every 5th question is a fixed question.

  if (questionNumber % 5 === 0) {
    return {
      question:
        fixedQuestions[
          fixedIndex %
            fixedQuestions.length
        ],

      nextFixedIndex:
        fixedIndex + 1,
    };
  }

  // Mostly generate day questions.

  const generator =
    randomNumber(1, 10);

  if (generator <= 8) {
    return {
      question:
        createRandomDayQuestion(),

      nextFixedIndex:
        fixedIndex,
    };
  }

  return {
    question:
      createRandomTrueFalseQuestion(),

    nextFixedIndex:
      fixedIndex,
  };
}

// =====================================================
// CREATE PRINT QUESTIONS
// =====================================================

function createPrintQuestions(
  count,
  language
) {
  const questions = [];

  let fixedIndex = 0;

  for (let i = 1; i <= count; i++) {

    let generated;

    // Every 5th question uses a fixed question.

    if (i % 5 === 0) {

      generated =
        fixedQuestions[
          fixedIndex %
            fixedQuestions.length
        ];

      fixedIndex++;
    } else {

      const randomType =
        randomNumber(1, 10);

      if (randomType <= 8) {
        generated =
          createRandomDayQuestion();
      } else {
        generated =
          createRandomTrueFalseQuestion();
      }
    }

    questions.push(generated);
  }

  return questions.map(
    (question, index) => ({
      ...question,
      printNumber: index + 1,
      printQuestion:
        question.question[language],
    })
  );
}

// =====================================================
// PRINT WINDOW
// =====================================================

function printQuestionPaper(
  questions,
  language
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

  const title =
    language === "telugu"
      ? "DAY & DATE QUIZ"
      : "DAY & DATE QUIZ";

  const languageName =
    language === "telugu"
      ? "Telugu"
      : "English";

  const questionHTML =
    questions
      .map((question) => {

        // ---------------------------------------------
        // MATCH
        // ---------------------------------------------

        if (
          question.type === "match"
        ) {

          const pairsHTML =
            question.pairs
              .map(
                (pair) => `
                  <div class="match-print-row">
                    <div class="match-print-left">
                      ${pair.left}
                    </div>

                    <div class="match-print-right">
                      ${pair.right}
                    </div>
                  </div>
                `
              )
              .join("");

          return `
            <div class="print-question">
              <div class="question-text">
                ${question.printNumber}. 
                ${question.printQuestion}
              </div>

              <div class="match-print">
                ${pairsHTML}
              </div>
            </div>
          `;
        }

        // ---------------------------------------------
        // NORMAL QUESTION
        // ---------------------------------------------

        const optionsHTML =
          question.options
            .map(
              (option, optionIndex) => `
                <div class="print-option">
                  ${String.fromCharCode(
                    65 + optionIndex
                  )}) ${option}
                </div>
              `
            )
            .join("");

        return `
          <div class="print-question">

            <div class="question-text">
              ${question.printNumber}.
              ${question.printQuestion}
            </div>

            <div class="options">
              ${optionsHTML}
            </div>

          </div>
        `;
      })
      .join("");

  printWindow.document.write(`
    <!DOCTYPE html>

    <html>

    <head>

      <title>${title}</title>

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />

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
          padding: 0;

          background: white;

          color: #111;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 14px;
        }

        .paper {
          width: 100%;

          max-width: 180mm;

          margin: 0 auto;
        }

        .header {
          text-align: center;

          margin-bottom: 20px;

          border-bottom:
            2px solid #222;

          padding-bottom: 12px;
        }

        .header h1 {
          margin: 0 0 6px;

          font-size: 22px;

          font-weight: 700;
        }

        .header h2 {
          margin: 0;

          font-size: 15px;

          font-weight: 500;
        }

        .student-info {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 25px;

          margin:
            15px 0 25px;
        }

        .info-line {
          border-bottom:
            1px solid #222;

          padding-bottom: 5px;

          min-height: 25px;
        }

        .instructions {
          margin-bottom: 20px;

          font-size: 13px;

          font-weight: 600;
        }

        .print-question {
          margin-bottom: 22px;

          page-break-inside: avoid;

          break-inside: avoid;
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

          column-gap: 30px;

          row-gap: 7px;

          margin-left: 20px;
        }

        .print-option {
          font-size: 14px;

          line-height: 1.4;
        }

        .match-print {
          margin-top: 10px;

          margin-left: 20px;
        }

        .match-print-row {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          border:
            1px solid #999;

          min-height: 35px;
        }

        .match-print-left,
        .match-print-right {
          padding: 8px;

          border-right:
            1px solid #999;
        }

        .match-print-right {
          border-right: none;
        }

        .footer {
          margin-top: 30px;

          padding-top: 10px;

          border-top:
            1px solid #999;

          text-align: center;

          font-size: 11px;

          color: #555;
        }

        @media print {

          body {
            width: 100%;
          }

          .print-question {
            page-break-inside: avoid;
          }

        }

      </style>

    </head>

    <body>

      <div class="paper">

        <div class="header">

          <h1>
            ${title}
          </h1>

          <h2>
            Language: ${languageName}
          </h2>

        </div>

        <div class="student-info">

          <div class="info-line">
            Name:
          </div>

          <div class="info-line">
            Date:
          </div>

        </div>

        <div class="instructions">
          Choose the correct answer.
        </div>

        ${questionHTML}

        <div class="footer">
          Day & Date Quiz
        </div>

      </div>

      <script>

        window.onload = function() {

          setTimeout(
            function() {
              window.print();
            },
            300
          );

        };

      </script>

    </body>

    </html>
  `);

  printWindow.document.close();
}

// =====================================================
// DAY QUIZ
// =====================================================

function DayQuiz({ onBack }) {

  // ===================================================
  // LANGUAGE
  // ===================================================

  const [language, setLanguage] =
    useState("telugu");

  // ===================================================
  // INITIAL QUESTION
  // ===================================================

  const [currentQuestion, setCurrentQuestion] =
    useState(
      createRandomDayQuestion()
    );

  // ===================================================
  // QUESTION NUMBER
  // ===================================================

  const [questionNumber, setQuestionNumber] =
    useState(1);

  // ===================================================
  // ANSWER
  // ===================================================

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  // ===================================================
  // POPUPS
  // ===================================================

  const [showWrong, setShowWrong] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  // ===================================================
  // PRINT POPUP
  // ===================================================

  const [showPrintPopup, setShowPrintPopup] =
    useState(false);

  const [printCount, setPrintCount] =
    useState("10");

  // ===================================================
  // REFS
  // ===================================================

  const timers = useRef([]);

  const locked = useRef(false);

  const fixedIndex = useRef(0);

  // ===================================================
  // AUDIO
  // ===================================================

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

  // ===================================================
  // TIMER
  // ===================================================

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

  // ===================================================
  // STOP EVERYTHING
  // ===================================================

  const stopEverything = () => {

    timers.current.forEach(
      clearTimeout
    );

    timers.current = [];

    if (audioRef.current) {

      Object.values(
        audioRef.current
      ).forEach((audio) => {

        audio.pause();

        audio.currentTime = 0;
      });
    }
  };

  // ===================================================
  // CLEANUP
  // ===================================================

  useEffect(() => {

    return () => {

      timers.current.forEach(
        clearTimeout
      );

      if (audioRef.current) {

        Object.values(
          audioRef.current
        ).forEach((audio) => {

          audio.pause();

          audio.currentTime = 0;
        });
      }
    };

  }, []);

  // ===================================================
  // PLAY AUDIO
  // ===================================================

  const playAudio = (audio) => {

    audio.pause();

    audio.currentTime = 0;

    audio.play().catch(() => {});
  };

  // ===================================================
  // CORRECT SOUNDS
  // ===================================================

  const playCorrectSounds = () => {

    playAudio(
      audioRef.current.success
    );

    schedule(() => {

      playAudio(
        audioRef.current.veryGood
      );

    }, 500);
  };

  // ===================================================
  // WRONG SOUNDS
  // ===================================================

  const playWrongSounds = () => {

    playAudio(
      audioRef.current.fail
    );

    schedule(() => {

      playAudio(
        audioRef.current.tryAgain
      );

    }, 500);
  };

  // ===================================================
  // NEXT QUESTION
  // ===================================================

  const goToNextQuestion = () => {

    const result =
      createNextQuestion(
        questionNumber + 1,
        fixedIndex.current
      );

    fixedIndex.current =
      result.nextFixedIndex;

    setCurrentQuestion(
      result.question
    );

    setQuestionNumber(
      (previous) =>
        previous + 1
    );

    setSelectedAnswer(null);
  };

  // ===================================================
  // ANSWER
  // ===================================================

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

    // =================================================
    // CORRECT
    // =================================================

    if (
      answer ===
      currentQuestion.answer
    ) {

      playCorrectSounds();

      setShowSuccess(true);

      schedule(() => {

        setShowSuccess(false);

        goToNextQuestion();

        locked.current =
          false;

      }, 2500);

      return;
    }

    // =================================================
    // WRONG
    // =================================================

    playWrongSounds();

    setShowWrong(true);

    schedule(() => {

      setShowWrong(false);

      setSelectedAnswer(null);

      locked.current =
        false;

    }, 2500);
  };

  // ===================================================
  // MATCH CONTINUE
  // ===================================================

  const handleMatchContinue = () => {

    if (locked.current) {
      return;
    }

    locked.current = true;

    playCorrectSounds();

    setShowSuccess(true);

    schedule(() => {

      setShowSuccess(false);

      goToNextQuestion();

      locked.current =
        false;

    }, 2500);
  };

  // ===================================================
  // BACK
  // ===================================================

  const handleBack = () => {

    stopEverything();

    onBack();
  };

  // ===================================================
  // OPEN PRINT POPUP
  // ===================================================

  const openPrintPopup = () => {

    setShowPrintPopup(true);
  };

  // ===================================================
  // CLOSE PRINT POPUP
  // ===================================================

  const closePrintPopup = () => {

    setShowPrintPopup(false);
  };

  // ===================================================
  // PRINT
  // ===================================================

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

    printQuestionPaper(
      questions,
      language
    );
  };

  // ===================================================
  // DISPLAY QUESTION
  // ===================================================

  const displayedQuestion =
    currentQuestion.question[
      language
    ];

  // ===================================================
  // MAIN UI
  // ===================================================

  return (
    <div className="day-quiz">

      {/* =================================================
          BACK
      ================================================= */}

      <button
        className="day-back-button"
        onClick={handleBack}
      >
        ← BACK
      </button>

      {/* =================================================
          TITLE
      ================================================= */}

      <h1 className="day-quiz-title">
        Day & Date Quiz
      </h1>

      {/* =================================================
          LANGUAGE
      ================================================= */}

      <div className="quiz-language-switch">

        <button
          className={
            language === "telugu"
              ? "language-button active"
              : "language-button"
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
              ? "language-button active"
              : "language-button"
          }
          onClick={() =>
            setLanguage("english")
          }
        >
          English
        </button>

      </div>

      {/* =================================================
          PROGRESS
      ================================================= */}

      <div className="day-progress">
        Question {questionNumber}
      </div>

      {/* =================================================
          QUESTION CARD
      ================================================= */}

      <div className="day-question-card">

        <h2>
          {displayedQuestion}
        </h2>

        {/* =================================================
            MCQ / TRUE FALSE
        ================================================= */}

        {currentQuestion.type !==
          "match" && (

          <div className="day-options">

            {currentQuestion.options.map(
              (option) => {

                let className =
                  "day-option";

                if (
                  selectedAnswer ===
                  option
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
                    className={
                      className
                    }
                    onClick={() =>
                      handleAnswer(
                        option
                      )
                    }
                    disabled={
                      selectedAnswer !==
                      null
                    }
                  >
                    {option}
                  </button>
                );
              }
            )}

          </div>
        )}

        {/* =================================================
            MATCH
        ================================================= */}

        {currentQuestion.type ===
          "match" && (

          <div className="match-section">

            {currentQuestion.pairs.map(
              (pair) => (

                <div
                  className="match-row"
                  key={pair.left}
                >

                  <div className="match-left">
                    {pair.left}
                  </div>

                  <div className="match-arrow">
                    →
                  </div>

                  <div className="match-right">
                    {pair.right}
                  </div>

                </div>
              )
            )}

            <button
              className="match-continue"
              onClick={
                handleMatchContinue
              }
              disabled={
                showSuccess
              }
            >
              CONTINUE
            </button>

          </div>
        )}

      </div>

      {/* =================================================
          PRINT BUTTON
      ================================================= */}

      <div className="print-questions-container">

        <button
          className="print-questions-button"
          onClick={openPrintPopup}
        >
          🖨️ PRINT QUESTIONS
        </button>

      </div>

      {/* =================================================
          WRONG POPUP
      ================================================= */}

      {showWrong && (

        <div className="day-wrong-popup">

          <div className="day-wrong-box">

            <div className="day-wrong-icon">
              ❌
            </div>

            <h2>
              {language === "telugu"
                ? "Malli try cheyu!"
                : "Try again!"}
            </h2>

            <p>
              {language === "telugu"
                ? "Try again!"
                : "Please try again!"}
            </p>

          </div>

        </div>
      )}

      {/* =================================================
          VERY GOOD POPUP
      ================================================= */}

      {showSuccess && (

        <div className="day-success-popup">

          <div className="day-success-box">

            <div className="celebration celebration-1">
              ✨
            </div>

            <div className="celebration celebration-2">
              🎉
            </div>

            <div className="celebration celebration-3">
              ⭐
            </div>

            <div className="celebration celebration-4">
              🎊
            </div>

            <div className="celebration celebration-5">
              ✨
            </div>

            <div className="success-icon">
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

      {/* =================================================
          PRINT QUESTIONS POPUP
      ================================================= */}

      {showPrintPopup && (

        <div className="print-popup-overlay">

          <div className="print-popup-box">

            <button
              className="print-popup-close"
              onClick={closePrintPopup}
            >
              ×
            </button>

            <div className="print-popup-icon">
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
              className="print-count-input"
            />

            <div className="print-popup-info">
              A4 format • No answers •{" "}
              {language === "telugu"
                ? "Telugu"
                : "English"}
            </div>

            <div className="print-popup-buttons">

              <button
                className="print-cancel-button"
                onClick={closePrintPopup}
              >
                CANCEL
              </button>

              <button
                className="print-confirm-button"
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

export default DayQuiz;