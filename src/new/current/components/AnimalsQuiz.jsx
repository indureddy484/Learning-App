import React, { useEffect, useState } from "react";
import "./AnimalsQuiz.css";
import AnimalsPracticeWorksheet from "./AnimalsPracticeWorksheet";

// =========================================
// ANIMAL DATA
// =========================================

const ANIMAL_GROUPS = {
  "Pet Animals": [
    { name: "Rabbit", image: "/images/animals/pet/rabbit.jpg" },
    { name: "Dog", image: "/images/animals/farm/dog.jpg" },
  ],

  "Farm Animals": [
    { name: "Buffalo", image: "/images/animals/farm/buffalo.jpg" },
    { name: "Goat", image: "/images/animals/farm/goat.jpg" },
    { name: "Sheep", image: "/images/animals/farm/sheep.jpg" },
    { name: "Camel", image: "/images/animals/farm/camel.jpg" },
    { name: "Horse", image: "/images/animals/farm/horse.jpg" },
    { name: "Cow", image: "/images/animals/farm/cow.png" },
  ],

  "Wild Animals": [
    { name: "Bear", image: "/images/animals/wild/bear.jpg" },
    { name: "Elephant", image: "/images/animals/wild/elephant.jpg" },
    { name: "Zebra", image: "/images/animals/wild/zebra.jpg" },
    { name: "Tiger", image: "/images/animals/wild/tiger.jpg" },
    { name: "Giraffe", image: "/images/animals/wild/giraffe.jpg" },
  ],

  "Water Animals": [
    { name: "Octopus", image: "/images/animals/water/octopus.jpg" },
    { name: "Crab", image: "/images/animals/water/crab.jpg" },
    { name: "Dolphin", image: "/images/animals/water/dolphin.jpg" },
    { name: "Jellyfish", image: "/images/animals/water/jellyfish.jpg" },
    { name: "Oyster", image: "/images/animals/water/oyster.jpg" },
    { name: "Seahorse", image: "/images/animals/water/seahorse.jpg" },
  ],

  Birds: [
    { name: "Toucan", image: "/images/animals/birds/toucans.jpg" },
    { name: "Goose", image: "/images/animals/birds/goose.jpg" },
    { name: "Quail", image: "/images/animals/birds/quail.jpg" },
    { name: "Kiwi", image: "/images/animals/birds/kiwi.jpg" },
    { name: "Owl", image: "/images/animals/birds/owl.jpg" },
  ],
};

const CATEGORY_NAMES = Object.keys(ANIMAL_GROUPS);
const TIMER_OPTIONS = [1, 2, 3, 5];

const QUESTION_PROMPTS = {
  "Pet Animals": "Which one is a pet animal?",
  "Farm Animals": "Which one is a farm animal?",
  "Wild Animals": "Which one is a wild animal?",
  "Water Animals": "Which one is a water animal?",
  Birds: "Which one is a bird?",
};

// =========================================
// SHUFFLE
// =========================================

const shuffle = (items) => {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

const createCategoryDeck = () => shuffle(CATEGORY_NAMES);

// =========================================
// CREATE QUESTION
// =========================================

const createQuestion = (category, questionNumber) => {
  const correctAnimal = shuffle(ANIMAL_GROUPS[category])[0];

  const distractors = CATEGORY_NAMES
    .filter((name) => name !== category)
    .flatMap((name) => ANIMAL_GROUPS[name]);

  const options = shuffle([
    correctAnimal,
    ...shuffle(distractors).slice(0, 3),
  ]).map((animal, index) => ({
    ...animal,
    id: `${questionNumber}-${index}-${animal.name}`,
    label: ["A", "B", "C", "D"][index],
  }));

  return {
    questionNumber,
    category,
    prompt: QUESTION_PROMPTS[category],
    options,
    correctAnswer: options.find(
      (option) => option.name === correctAnimal.name
    ),
  };
};

// =========================================
// TIMER FORMAT
// =========================================

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

// =========================================
// MAIN COMPONENT
// =========================================

function AnimalsQuiz({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState("level1");
  const [quizLevel, setQuizLevel] = useState("level1");

  const [selectedDuration, setSelectedDuration] = useState(2);

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(120);

  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [history, setHistory] = useState([]);

  const [categoryDeck, setCategoryDeck] = useState([]);
  const [deckIndex, setDeckIndex] = useState(0);

  const [endReason, setEndReason] = useState("manual");

  const [showWorksheetModal, setShowWorksheetModal] = useState(false);

  // =========================================
  // LEVEL NAME
  // =========================================

  const levelName =
    quizLevel === "level1" ? "Level 1" : "Level 2";

  // =========================================
  // GENERATE NEXT QUESTION
  // =========================================

  const generateNextQuestion = (
    currentHistoryLength,
    currentDeck,
    currentDeckIndex
  ) => {
    let deck = currentDeck;
    let index = currentDeckIndex;

    if (!deck.length || index >= deck.length) {
      deck = createCategoryDeck();
      index = 0;
    }

    const category = deck[index];

    const nextQuestion = createQuestion(
      category,
      currentHistoryLength + 1
    );

    setCategoryDeck(deck);
    setDeckIndex(index + 1);
    setQuestion(nextQuestion);
    setSelectedAnswer(null);
  };

  // =========================================
  // START QUIZ
  // =========================================

  const startQuiz = () => {
    const newDeck = createCategoryDeck();

    setHistory([]);
    setCategoryDeck(newDeck);
    setDeckIndex(0);

    setTimeLeft(selectedDuration * 60);

    setQuizLevel(selectedLevel);
    setQuizCompleted(false);
    setEndReason("manual");

    setQuizStarted(true);

    generateNextQuestion(0, newDeck, 0);
  };

  // =========================================
  // FINISH QUIZ
  // =========================================

  const finishQuiz = (reason = "manual") => {
    if (quizCompleted) return;

    let finalHistory = [...history];

    if (question) {
      const alreadyRecorded = finalHistory.some(
        (item) =>
          item.questionNumber === question.questionNumber
      );

      if (!alreadyRecorded) {
        finalHistory.push({
          ...question,
          selectedAnswer,
          status: !selectedAnswer
            ? "Unanswered"
            : selectedAnswer.name === question.correctAnswer.name
            ? "Correct"
            : "Wrong",
        });
      }
    }

    setHistory(finalHistory);
    setQuizCompleted(true);
    setQuizStarted(false);
    setEndReason(reason);
  };

  // =========================================
  // SUBMIT ANSWER
  // =========================================

  const submitAnswer = () => {
    if (!selectedAnswer || !question || quizCompleted) return;

    const result = {
      ...question,
      selectedAnswer,
      status:
        selectedAnswer.name === question.correctAnswer.name
          ? "Correct"
          : "Wrong",
    };

    const updatedHistory = [...history, result];

    setHistory(updatedHistory);

    generateNextQuestion(
      updatedHistory.length,
      categoryDeck,
      deckIndex
    );
  };

  // =========================================
  // TIMER
  // =========================================

  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);

  // =========================================
  // AUTOMATIC FINISH
  // =========================================

  useEffect(() => {
    if (quizStarted && timeLeft === 0) {
      finishQuiz("timeout");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, quizStarted]);

  // =========================================
  // RESULTS
  // =========================================

  const correctCount = history.filter(
    (item) => item.status === "Correct"
  ).length;

  const wrongCount = history.filter(
    (item) => item.status === "Wrong"
  ).length;

  const unansweredCount = history.filter(
    (item) => item.status === "Unanswered"
  ).length;

  const totalQuestions = history.length;

  const accuracy =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  // =========================================
  // RESET QUIZ
  // =========================================

  const resetToSetup = () => {
    setQuizStarted(false);
    setQuizCompleted(false);

    setQuestion(null);
    setSelectedAnswer(null);

    setHistory([]);
    setCategoryDeck([]);
    setDeckIndex(0);

    setTimeLeft(selectedDuration * 60);
    setEndReason("manual");
  };

  // =========================================
  // RENDER OPTION
  // LEVEL 1 = IMAGE
  // LEVEL 2 = TEXT
  // =========================================

  const renderQuizOption = (option) => {
    const isSelected = selectedAnswer?.id === option.id;

    if (quizLevel === "level2") {
      return (
        <button
          type="button"
          key={option.id}
          className={`aq-text-option-card ${
            isSelected ? "aq-option-selected" : ""
          }`}
          onClick={() => setSelectedAnswer(option)}
          aria-pressed={isSelected}
        >
          <span className="aq-text-option-label">
            {option.label.toLowerCase()})
          </span>

          <strong>{option.name.toLowerCase()}</strong>
        </button>
      );
    }

    return (
      <button
        type="button"
        key={option.id}
        className={`aq-option-card ${
          isSelected ? "aq-option-selected" : ""
        }`}
        onClick={() => setSelectedAnswer(option)}
        aria-pressed={isSelected}
      >
        <span className="aq-option-label">
          {option.label}
        </span>

        <img
          src={option.image}
          alt={option.name}
          onError={(event) => {
            event.currentTarget.style.visibility = "hidden";
          }}
        />

        <strong>{option.name}</strong>
      </button>
    );
  };

  // =========================================
  // RESULT ANALYSIS OPTION
  // =========================================

  const renderReviewOptions = (item) => {
    if (quizLevel === "level2") {
      return (
        <div className="aq-review-text-options">
          {item.options.map((option) => (
            <div
              key={option.id}
              className={`aq-review-text-option ${
                option.name === item.correctAnswer.name
                  ? "aq-answer-correct"
                  : item.selectedAnswer?.name === option.name
                  ? "aq-answer-wrong"
                  : ""
              }`}
            >
              <span>{option.label.toLowerCase()})</span>
              <strong>{option.name.toLowerCase()}</strong>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="aq-review-options">
        {item.options.map((option) => (
          <div
            key={option.id}
            className={`aq-review-option ${
              option.name === item.correctAnswer.name
                ? "aq-answer-correct"
                : item.selectedAnswer?.name === option.name
                ? "aq-answer-wrong"
                : ""
            }`}
          >
            <span>{option.label}</span>

            <img
              src={option.image}
              alt={option.name}
            />

            <strong>{option.name}</strong>
          </div>
        ))}
      </div>
    );
  };

  // =========================================
  // RESULT ANALYSIS SCREEN
  // =========================================

  if (quizCompleted) {
    return (
      <main className="animals-quiz-page">
        <div className="aq-top-actions no-print">
          <button
            className="aq-back-button"
            onClick={resetToSetup}
            type="button"
          >
            ← BACK TO QUIZ
          </button>
        </div>

        <section className="aq-result-card">
          <div className="aq-result-icon">
            {endReason === "timeout" ? "⏰" : "🏆"}
          </div>

          <p className="aq-eyebrow">
            {levelName.toUpperCase()} RESULTS
          </p>

          <h1>
            {endReason === "timeout"
              ? "Time's Up!"
              : "Quiz Completed!"}
          </h1>

          <p>
            Well done! Here is your quiz performance.
          </p>

          <div className="aq-score-box">
            <span>Your Score</span>

            <strong>
              {correctCount} / {totalQuestions}
            </strong>

            <span>{accuracy}% Accuracy</span>
          </div>

          <div className="aq-stats">
            <div className="correct">
              <strong>{correctCount}</strong>
              <span>Correct</span>
            </div>

            <div className="wrong">
              <strong>{wrongCount}</strong>
              <span>Wrong</span>
            </div>

            <div className="unanswered">
              <strong>{unansweredCount}</strong>
              <span>Unanswered</span>
            </div>
          </div>

          <h2 className="aq-analysis-heading">
            Question-wise Analysis
          </h2>

          {history.map((item) => (
            <article
              className={`aq-review-card ${
                item.status === "Correct"
                  ? "aq-review-correct"
                  : item.status === "Wrong"
                  ? "aq-review-wrong"
                  : "aq-review-unanswered"
              }`}
              key={item.questionNumber}
            >
              <div className="aq-review-header">
                <strong>
                  Question {item.questionNumber}
                </strong>

                <span>{item.status}</span>
              </div>

              <p className="aq-review-prompt">
                {item.prompt}
              </p>

              {renderReviewOptions(item)}

              <p>
                <strong>Your Answer:</strong>{" "}
                {item.selectedAnswer
                  ? `${item.selectedAnswer.label.toLowerCase()}) ${item.selectedAnswer.name.toLowerCase()}`
                  : "Not answered"}
              </p>

              <p>
                <strong>Correct Answer:</strong>{" "}
                {item.correctAnswer.label.toLowerCase()}){" "}
                {item.correctAnswer.name.toLowerCase()}
              </p>
            </article>
          ))}

          <div className="aq-result-actions no-print">
            <button
              className="aq-primary-button"
              onClick={() => window.print()}
              type="button"
            >
              🖨️ Print Analysis / Save as PDF
            </button>

            <button
              className="aq-secondary-button"
              onClick={resetToSetup}
              type="button"
            >
              ↻ Play Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  // =========================================
  // ACTIVE QUIZ SCREEN
  // =========================================

  if (quizStarted) {
    return (
      <main className="animals-quiz-page">
        <header className="aq-quiz-header">
          <button
            className="aq-back-button"
            onClick={() => finishQuiz("manual")}
            type="button"
          >
            End Quiz
          </button>

          <div>
            <p>ANIMALS QUIZ</p>
            <h1>{levelName}</h1>
          </div>

          <div className="aq-timer">
            ⏰ {formatTime(timeLeft)}
          </div>
        </header>

        <section className="aq-quiz-card">
          <div className="aq-question-progress">
            <span>
              Question {question?.questionNumber}
            </span>

            <span>
              Score: {correctCount}
            </span>
          </div>

          <h2>{question?.prompt}</h2>

          <p className="aq-instruction">
            {quizLevel === "level1"
              ? "Look at all four pictures and choose the correct answer."
              : "Read all four options and choose the correct answer."}
          </p>

          <div
            className={
              quizLevel === "level2"
                ? "aq-text-options-grid"
                : "aq-options-grid"
            }
          >
            {question?.options.map(renderQuizOption)}
          </div>

          <button
            className="aq-primary-button aq-next-button"
            onClick={submitAnswer}
            disabled={!selectedAnswer}
            type="button"
          >
            Next Question →
          </button>
        </section>
      </main>
    );
  }

  // =========================================
  // MAIN QUIZ SETUP PAGE
  // =========================================

  return (
    <main className="animals-quiz-page">
      <div className="aq-page-top no-print">
        <button
          className="aq-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK TO EVS QUIZ
        </button>
      </div>

      <section className="aq-setup-card">
        <div className="aq-heading-icon">
          🐾
        </div>

        <p className="aq-eyebrow">
          ANIMALS QUIZ
        </p>

        <h1>Animals Quiz</h1>

        <p className="aq-description">
          Identify animals and improve your animal knowledge.
        </p>

        {/* LEVEL DROPDOWN */}

        <div className="aq-level-section">
          <h3>Select Quiz Level</h3>

          <select
            id="aq-level-select"
            className="aq-level-select"
            value={selectedLevel}
            onChange={(event) =>
              setSelectedLevel(event.target.value)
            }
          >
            <option value="level1">
              Level 1 – Animal Identification
            </option>

            <option value="level2">
              Level 2 – Animal Names
            </option>

            <option value="level3" disabled>
              Level 3 – Coming Soon
            </option>
          </select>

          <p className="aq-level-description">
            {selectedLevel === "level1"
              ? "Identify animals by looking at their pictures."
              : "Identify the correct animal using text options."}
          </p>
        </div>

        {/* CATEGORY LABELS */}

        <div className="aq-category-list">
          <span>🐶 Pet Animals</span>
          <span>🐄 Farm Animals</span>
          <span>🦁 Wild Animals</span>
          <span>🐬 Water Animals</span>
          <span>🦉 Birds</span>
        </div>

        {/* TIME SELECTION */}

        <h3 className="aq-time-heading">
          Select Time
        </h3>

        <div className="aq-timer-options">
          {TIMER_OPTIONS.map((duration) => (
            <button
              key={duration}
              type="button"
              className={
                selectedDuration === duration ? "active" : ""
              }
              onClick={() => setSelectedDuration(duration)}
            >
              <strong>{duration}</strong>
              <span>min</span>
            </button>
          ))}
        </div>

        <p className="aq-timer-description">
          Answer as many questions as you can before time runs out!
        </p>

        {/* START QUIZ */}

        <button
          className="aq-primary-button aq-start-button"
          onClick={startQuiz}
          type="button"
        >
          ▶ Start Quiz
        </button>

        {/* WORKSHEET */}

        <div className="aq-or-divider">
          <span></span>
          <strong>OR</strong>
          <span></span>
        </div>

        <button
          className="aq-worksheet-button"
          onClick={() => setShowWorksheetModal(true)}
          type="button"
        >
          🖨️ Print Practice Worksheet
        </button>

        <p className="aq-worksheet-description">
          Generate a worksheet for practice without a timer.
        </p>
      </section>

      {/* SEPARATE WORKSHEET COMPONENT */}

      {showWorksheetModal && (
  <AnimalsPracticeWorksheet
    selectedLevel={selectedLevel}
    onClose={() => setShowWorksheetModal(false)}
  />
)}
    </main>
  );
}

export default AnimalsQuiz;