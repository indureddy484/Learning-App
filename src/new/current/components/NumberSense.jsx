
import { useEffect, useState } from "react";
import "./NumberSense.css";

const TIMER_OPTIONS = [2, 5, 10, 15, 20];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = (items) => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const makeNumberOptions = (correct, candidates) => {
  const unique = [...new Set([correct, ...candidates])].filter(
    (number) =>
      Number.isInteger(number) && number >= 1 && number <= 100
  );

  while (unique.length < 4) {
    const candidate = randomInt(1, 100);
    if (!unique.includes(candidate)) unique.push(candidate);
  }

  return shuffle(unique.slice(0, 4));
};

// Generates four unique arrangements from all six possible permutations.
const makeOrderOptions = (numbers, correctOrder) => {
  const [a, b, c] = numbers;

  const allOrders = [
    [a, b, c],
    [a, c, b],
    [b, a, c],
    [b, c, a],
    [c, a, b],
    [c, b, a],
  ];

  const wrongOrders = allOrders.filter(
    (order) =>
      !order.every(
        (number, index) => number === correctOrder[index]
      )
  );

  return shuffle([
    [...correctOrder],
    ...shuffle(wrongOrders).slice(0, 3),
  ]);
};

// LANGUAGE TEXT
const TEXT = {
  english: {
    languageTitle: "Choose Your Language",
    languageDescription: "Select the language for your quiz.",

    setupTitle: "Number Sense Quiz",
    setupDescription: "Choose your quiz time.",
    selectTime: "Select Time",
    minutes: "min",
    setupHint: "Answer as many questions as you can before time runs out!",
    startQuiz: "▶ Start Quiz",
    changeLanguage: "Change Language",

    instruction: "Read the question and choose the correct answer.",
    chooseAnswer: "Choose one correct answer.",
    question: "Question",
    score: "Score",
    timeLeft: "Time Left",
    next: "➡ Next",
    endTest: "⛔ End Test",
    back: "← BACK",

    completed: "Quiz Completed!",
    resultMessage: "Great effort! Your quiz has ended.",
    yourScore: "Your Score",
    accuracy: "Accuracy",
    correct: "Correct",
    incorrect: "Incorrect",
    unanswered: "Unanswered",
    totalQuestions: "Total Questions",
    playAgain: "Play Again",
    backToMenu: "Back to Number Sense Menu",

    titles: {
      before: "Before Number",
      after: "After Number",
      between: "Between Numbers",
      smallest: "Smallest Number",
      biggest: "Biggest Number",
      ascending: "Ascending Order",
      descending: "Descending Order",
    },

    prompts: {
      before: (number) => `What number comes before ${number}?`,
      after: (number) => `What number comes after ${number}?`,
      between: (first, second) =>
        `Which number comes between ${first} and ${second}?`,
      smallest: "Which is the smallest number?",
      biggest: "Which is the biggest number?",
      ascending: "Arrange the numbers from smallest to biggest.",
      descending: "Arrange the numbers from biggest to smallest.",
    },
  },

  // TELUGU OPTION - ALL QUIZ CONTENT IN TENGLISH
  tenglish: {
    languageTitle: "Choose Your Language",
    languageDescription: "Mee quiz language select cheyyandi.",

    setupTitle: "Number Sense Quiz",
    setupDescription: "Quiz time select cheyyandi.",
    selectTime: "Time Select Cheyyandi",
    minutes: "min",
    setupHint:
      "Time aipoye lopu enni questions answer cheyyagaligite anni cheyyandi!",
    startQuiz: "▶ Quiz Start Cheyyandi",
    changeLanguage: "Language Marchandi",

    instruction:
      "Question chadivi correct answer select cheyyandi.",
    chooseAnswer: "Oka correct answer select cheyyandi.",
    question: "Question",
    score: "Score",
    timeLeft: "Migilina Time",
    next: "➡ Next",
    endTest: "⛔ Test End Cheyyandi",
    back: "← BACK",

    completed: "Quiz Complete Ayyindi!",
    resultMessage:
      "Chala baaga try chesaru! Mee quiz complete ayyindi.",
    yourScore: "Mee Score",
    accuracy: "Accuracy",
    correct: "Correct",
    incorrect: "Incorrect",
    unanswered: "Answer Cheyyanivi",
    totalQuestions: "Total Questions",
    playAgain: "Malli Aadandi",
    backToMenu: "Number Sense Menu Ki Vellandi",

    titles: {
      before: "Before Number",
      after: "After Number",
      between: "Between Numbers",
      smallest: "Smallest Number",
      biggest: "Biggest Number",
      ascending: "Ascending Order",
      descending: "Descending Order",
    },

    prompts: {
      before: (number) =>
        `${number} mundu ye number vastundi?`,
      after: (number) =>
        `${number} tarvatha ye number vastundi?`,
      between: (first, second) =>
        `${first} ki ${second} ki madhyalo ye number vastundi?`,
      smallest: "Veetilo chinna number edi?",
      biggest: "Veetilo pedda number edi?",
      ascending:
        "Chinna number nundi pedda number varaku arrange cheyyandi.",
      descending:
        "Pedda number nundi chinna number varaku arrange cheyyandi.",
    },
  },
};

const generateQuestion = (language = "english") => {
  const text = TEXT[language] || TEXT.english;

  const types = [
    "before",
    "after",
    "between",
    "smallest",
    "biggest",
    "ascending",
    "descending",
  ];

  const type = types[randomInt(0, types.length - 1)];

  // BEFORE NUMBER
  if (type === "before") {
    const number = randomInt(2, 100);
    const correct = number - 1;

    return {
      type,
      title: text.titles.before,
      prompt: text.prompts.before(number),
      options: makeNumberOptions(correct, [
        number - 2,
        number + 1,
        number + 2,
      ]),
      correct,
    };
  }

  // AFTER NUMBER
  if (type === "after") {
    const number = randomInt(1, 99);
    const correct = number + 1;

    return {
      type,
      title: text.titles.after,
      prompt: text.prompts.after(number),
      options: makeNumberOptions(correct, [
        number - 1,
        number + 2,
        number + 3,
      ]),
      correct,
    };
  }

  // BETWEEN NUMBERS
  // Exactly one number comes between the given numbers.
  // Example: 7 and 9 -> 8
  if (type === "between") {
    const first = randomInt(1, 98);
    const second = first + 2;
    const correct = first + 1;

    return {
      type,
      title: text.titles.between,
      prompt: text.prompts.between(first, second),
      numbers: [first, second],
      options: makeNumberOptions(correct, [
        first - 1,
        first + 3,
        second + 1,
      ]),
      correct,
    };
  }

  // SMALLEST AND BIGGEST NUMBER
  if (type === "smallest" || type === "biggest") {
    const numbers = [];

    while (numbers.length < 3) {
      const number = randomInt(1, 100);
      if (!numbers.includes(number)) numbers.push(number);
    }

    const correct =
      type === "smallest"
        ? Math.min(...numbers)
        : Math.max(...numbers);

    const distractor =
      type === "smallest"
        ? Math.max(...numbers) + 1
        : Math.min(...numbers) - 1;

    return {
      type,
      title:
        type === "smallest"
          ? text.titles.smallest
          : text.titles.biggest,
      prompt:
        type === "smallest"
          ? text.prompts.smallest
          : text.prompts.biggest,
      numbers,
      options: makeNumberOptions(correct, [
        ...numbers.filter((number) => number !== correct),
        distractor,
      ]),
      correct,
    };
  }

  // ASCENDING AND DESCENDING ORDER
  const numbers = [];

  while (numbers.length < 3) {
    const number = randomInt(1, 100);
    if (!numbers.includes(number)) numbers.push(number);
  }

  const correctOrder = [...numbers].sort((a, b) =>
    type === "ascending" ? a - b : b - a
  );

  return {
    type,
    title:
      type === "ascending"
        ? text.titles.ascending
        : text.titles.descending,
    prompt:
      type === "ascending"
        ? text.prompts.ascending
        : text.prompts.descending,
    numbers,
    options: makeOrderOptions(numbers, correctOrder),
    correct: correctOrder,
  };
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

const isCorrectAnswer = (selected, correct) => {
  if (Array.isArray(correct)) {
    return (
      Array.isArray(selected) &&
      selected.length === correct.length &&
      selected.every((number, index) => number === correct[index])
    );
  }

  return selected === correct;
};

function NumberSense({ onBack }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(5);

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [question, setQuestion] = useState(generateQuestion);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const text = TEXT[selectedLanguage || "english"];

  // TIMER
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);

  // AUTO END WHEN TIMER REACHES ZERO
  useEffect(() => {
    if (quizStarted && timeLeft === 0) {
      setQuizCompleted(true);
    }
  }, [quizStarted, timeLeft]);

  // LANGUAGE SELECTION
  const chooseLanguage = (language) => {
    setSelectedLanguage(language);
    setQuestion(generateQuestion(language));
  };

  // START QUIZ
  const startQuiz = () => {
    setQuestion(generateQuestion(selectedLanguage));
    setSelectedAnswer(null);
    setQuestionNumber(1);
    setCorrectCount(0);
    setIncorrectCount(0);
    setTimeLeft(selectedDuration * 60);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  // SUBMIT ANSWER
  const submitAnswer = () => {
    if (
      selectedAnswer === null ||
      quizCompleted ||
      timeLeft === 0
    ) {
      return;
    }

    if (isCorrectAnswer(selectedAnswer, question.correct)) {
      setCorrectCount((previous) => previous + 1);
    } else {
      setIncorrectCount((previous) => previous + 1);
    }

    setQuestion(generateQuestion(selectedLanguage));
    setSelectedAnswer(null);
    setQuestionNumber((previous) => previous + 1);
  };

  // END TEST
  const endTest = () => {
    setQuizCompleted(true);
  };

  // RESTART QUIZ
  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setSelectedDuration(5);
    setTimeLeft(5 * 60);
    setQuestion(generateQuestion(selectedLanguage));
    setSelectedAnswer(null);
    setQuestionNumber(1);
    setCorrectCount(0);
    setIncorrectCount(0);
  };

  // CURRENT QUESTION COUNTS AS UNANSWERED WHEN QUIZ ENDS
  const unansweredCount = quizCompleted ? 1 : 0;

  const totalQuestions =
    correctCount + incorrectCount + unansweredCount;

  const accuracy =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  // STEP 1: LANGUAGE SELECTION
  if (selectedLanguage === null) {
    return (
      <main className="number-sense-quiz-page">
        <button
          className="number-sense-back"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <section className="number-sense-setup-card">
          <div className="number-sense-setup-icon">🌐</div>

          <span className="number-sense-eyebrow">
            NUMBER SENSE
          </span>

          <h1>{TEXT.english.languageTitle}</h1>

          <p className="number-sense-setup-description">
            {TEXT.english.languageDescription}
          </p>

          <div className="number-sense-timer-options">
            <button
              type="button"
              className="number-sense-timer-option"
              onClick={() => chooseLanguage("english")}
            >
              <strong>ABC</strong>
              <span>English</span>
            </button>

            <button
              type="button"
              className="number-sense-timer-option"
              onClick={() => chooseLanguage("tenglish")}
            >
              <strong className="telugu-language-icon">
                అఆఇ
              </strong>
              <span>తెలుగు</span>
            </button>
          </div>
        </section>
      </main>
    );
  }

  // STEP 2: TIMER SELECTION
  if (!quizStarted) {
    return (
      <main className="number-sense-quiz-page">
        <button
          className="number-sense-back"
          onClick={onBack}
          type="button"
        >
          {text.back}
        </button>

        <section className="number-sense-setup-card">
          <div className="number-sense-setup-icon">🧠</div>

          <span className="number-sense-eyebrow">
            NUMBER SENSE
          </span>

          <h1>{text.setupTitle}</h1>

          <p className="number-sense-setup-description">
            {text.setupDescription}
          </p>

          <h3>{text.selectTime}</h3>

          <div className="number-sense-timer-options">
            {TIMER_OPTIONS.map((duration) => (
              <button
                key={duration}
                type="button"
                className={`number-sense-timer-option ${
                  selectedDuration === duration ? "active" : ""
                }`}
                onClick={() => setSelectedDuration(duration)}
                aria-pressed={selectedDuration === duration}
              >
                <strong>{duration}</strong>
                <span>{text.minutes}</span>
              </button>
            ))}
          </div>

          <p className="number-sense-setup-hint">
            {text.setupHint}
          </p>

          <button
            className="number-sense-primary-button"
            onClick={startQuiz}
            type="button"
          >
            {text.startQuiz}
          </button>

          <button
            className="number-sense-secondary-button"
            onClick={() => setSelectedLanguage(null)}
            type="button"
          >
            {text.changeLanguage}
          </button>
        </section>
      </main>
    );
  }

  // STEP 3: RESULT SCREEN
  if (quizCompleted) {
    return (
      <main className="number-sense-quiz-page">
        <button
          className="number-sense-back"
          onClick={onBack}
          type="button"
        >
          {text.back}
        </button>

        <section className="number-sense-result-card">
          <div className="number-sense-result-icon">🏆</div>

          <h1>{text.completed}</h1>

          <p className="number-sense-result-message">
            {text.resultMessage}
          </p>

          <div className="number-sense-final-score">
            <span>{text.yourScore}</span>

            <strong>
              {correctCount} / {totalQuestions}
            </strong>

            <span>
              {accuracy}% {text.accuracy}
            </span>
          </div>

          <div className="number-sense-result-stats">
            <div className="number-sense-stat correct-stat">
              <strong>{correctCount}</strong>
              <span>{text.correct}</span>
            </div>

            <div className="number-sense-stat incorrect-stat">
              <strong>{incorrectCount}</strong>
              <span>{text.incorrect}</span>
            </div>

            <div className="number-sense-stat unanswered-stat">
              <strong>{unansweredCount}</strong>
              <span>{text.unanswered}</span>
            </div>
          </div>

          <p className="number-sense-total-questions">
            {text.totalQuestions}: {totalQuestions}
          </p>

          <button
            className="number-sense-primary-button"
            onClick={restartQuiz}
            type="button"
          >
            {text.playAgain}
          </button>

          <button
            className="number-sense-secondary-button"
            onClick={onBack}
            type="button"
          >
            {text.backToMenu}
          </button>
        </section>
      </main>
    );
  }

  // STEP 4: QUIZ SCREEN
  return (
    <main className="number-sense-quiz-page">
      <header className="number-sense-quiz-header">
        <button
          className="number-sense-back"
          onClick={onBack}
          type="button"
        >
          {text.back}
        </button>

        <div>
          <span className="number-sense-eyebrow">
            NUMBER SENSE
          </span>

          <h1>{question.title}</h1>

          <p>{text.instruction}</p>
        </div>
      </header>

      <section className="number-sense-quiz-card">
        <div className="number-sense-quiz-progress">
          <span>
            {text.question} {questionNumber}
          </span>

          <span>
            {text.score}: {correctCount}
          </span>
        </div>

        <div className="number-sense-timer-display">
          <span>⏰</span>
          <span>
            {text.timeLeft}: {formatTime(timeLeft)}
          </span>
        </div>

        <div className="number-sense-question-content">
          <h2>{question.prompt}</h2>

          {question.numbers && (
            <div className="number-sense-given-numbers">
              {question.numbers.map((number) => (
                <span key={number}>{number}</span>
              ))}
            </div>
          )}
        </div>

        <p className="number-sense-instruction">
          {text.chooseAnswer}
        </p>

        <div className="number-sense-options">
          {question.options.map((option, index) => {
            const isSelected = Array.isArray(option)
              ? Array.isArray(selectedAnswer) &&
                option.every(
                  (number, i) => number === selectedAnswer[i]
                )
              : selectedAnswer === option;

            return (
              <button
                key={`${question.type}-${index}`}
                type="button"
                className={`number-sense-option ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() => setSelectedAnswer(option)}
                aria-pressed={isSelected}
              >
                <span className="number-sense-option-letter">
                  {String.fromCharCode(65 + index)}
                </span>

                <span>
                  {Array.isArray(option)
                    ? option.join(", ")
                    : option}
                </span>
              </button>
            );
          })}
        </div>

        <button
          className="number-sense-primary-button number-sense-next-button"
          onClick={submitAnswer}
          type="button"
          disabled={selectedAnswer === null || timeLeft === 0}
        >
          {text.next}
        </button>

        <button
          className="number-sense-end-button"
          onClick={endTest}
          type="button"
        >
          {text.endTest}
        </button>
      </section>
    </main>
  );
}

export default NumberSense;
