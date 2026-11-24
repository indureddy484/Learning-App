import React, { useEffect, useRef, useState } from "react";
import "./ascendingorderpicture.css";
import AscendingOrderPictureWorksheet from "./AscendingOrderPictureWorksheet";

// =====================================
// SOUND FILES - PRACTICE MODE ONLY
// =====================================
const VERY_GOOD_SOUND = "/sounds/very-good.mp3";
const TRY_AGAIN_SOUND = "/sounds/try-again.mp3";
const QUIZ_TIMER_OPTIONS = [1, 2, 5, 10, 20];

function playSound(soundPath) {
  const audio = new Audio(soundPath);
  audio.play().catch((error) => {
    console.warn("Unable to play sound:", error);
  });
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

// =====================================
// LOAD IMAGES
// =====================================
// =====================================
// LOAD IMAGES (PNG, JPG, JPEG)
// =====================================

const imageFiles = require.context(
  "../../../assets/images/ascending-order",
  false,
  /\.(png|jpe?g)$/i
);

// =====================================
// SHUFFLE HELPERS
// =====================================
function shuffleItems(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generatePermutations(items) {
  if (items.length <= 1) return [items];

  const result = [];
  items.forEach((item, index) => {
    const remaining = [
      ...items.slice(0, index),
      ...items.slice(index + 1),
    ];

    generatePermutations(remaining).forEach((permutation) => {
      result.push([item, ...permutation]);
    });
  });

  return result;
}

function getDifference(first, second) {
  return first.reduce(
    (count, value, index) =>
      count + (value !== second[index] ? 1 : 0),
    0
  );
}

// =====================================
// GENERATE QUESTION BANK
// =====================================
function generateQuestions() {
  const collections = {};

  imageFiles.keys().forEach((path) => {
    const filename = path
  .replace("./", "")
  .replace(/\.(png|jpe?g)$/i, "");
    const match = filename.match(
      /^(.*)_(\d+)_(smallest|small|medium|largest)$/i
    );

    if (!match) {
      console.warn("Invalid image filename:", filename);
      return;
    }

    const category = match[1];
    const order = Number(match[2]);

    if (!collections[category]) {
      collections[category] = [];
    }

    const importedImage = imageFiles(path);
    const imageUrl = importedImage.default || importedImage;

    collections[category].push({
      id: `${category}_${order}`,
      size: 55 + (order - 1) * 30,
      order,
      image: imageUrl,
    });
  });

  return Object.entries(collections)
    .map(([category, items]) => ({
      id: category,
      items: [...items].sort((a, b) => a.order - b.order),
    }))
    .filter((question) => {
      const hasFourImages = question.items.length === 4;
      const hasUniqueOrders =
        new Set(question.items.map((item) => item.order)).size === 4;

      return hasFourImages && hasUniqueOrders;
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

const QUESTION_BANK = generateQuestions();

// =====================================
// CREATE A NEW SHUFFLED SET
// =====================================
function createNewRound(previousRound = []) {
  const shuffledQuestions = shuffleItems(QUESTION_BANK);
  const allPermutations = generatePermutations([0, 1, 2, 3]);

  const incorrectPermutations = shuffleItems(
    allPermutations.filter((pattern) =>
      pattern.some((value, index) => value !== index)
    )
  );

  const previousArrangements = {};
  previousRound.forEach((question) => {
    previousArrangements[question.id] = question.displayOrder;
  });

  const usedPatterns = new Set();
  const newRound = [];
  let previousQuestionPattern = null;

  shuffledQuestions.forEach((question) => {
    const previousPattern = previousArrangements[question.id];

    let availablePatterns = incorrectPermutations.filter((pattern) => {
      const key = pattern.join("");
      return (
        !usedPatterns.has(key) &&
        (!previousPattern || key !== previousPattern.join(""))
      );
    });

    if (availablePatterns.length === 0) {
      availablePatterns = incorrectPermutations.filter(
        (pattern) => !usedPatterns.has(pattern.join(""))
      );
    }

    let selectedPattern;

    if (previousQuestionPattern && availablePatterns.length > 0) {
      const scoredPatterns = availablePatterns.map((pattern) => ({
        pattern,
        difference: getDifference(pattern, previousQuestionPattern),
      }));

      const maximumDifference = Math.max(
        ...scoredPatterns.map((item) => item.difference)
      );

      const bestPatterns = scoredPatterns
        .filter((item) => item.difference === maximumDifference)
        .map((item) => item.pattern);

      selectedPattern = shuffleItems(bestPatterns)[0];
    } else {
      selectedPattern = shuffleItems(availablePatterns)[0];
    }

    if (!selectedPattern) {
      selectedPattern = shuffleItems(incorrectPermutations)[0];
    }

    usedPatterns.add(selectedPattern.join(""));
    previousQuestionPattern = selectedPattern;

    newRound.push({
      ...question,
      items: selectedPattern.map((index) => question.items[index]),
      displayOrder: [...selectedPattern],
    });
  });

  return newRound;
}

// =====================================
// PICTURE TILE
// =====================================
function PictureTile({ item, onClick, disabled = false }) {
  return (
    <button
      type="button"
      className="aop-pic"
      onClick={onClick}
      draggable={!disabled}
      disabled={disabled}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", item.id);
      }}
      aria-label="Select picture"
    >
      <span className="aop-photo-wrap" style={{ height: `${item.size}px` }}>
        <img src={item.image} alt="Object" draggable="false" />
      </span>
    </button>
  );
}

// =====================================
// MAIN COMPONENT
// =====================================
export default function AscendingOrderPicture({ onBack }) {
  // Existing practice state
  const [questions, setQuestions] = useState(() => createNewRound());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState([null, null, null, null]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [showWorksheet, setShowWorksheet] = useState(false);
  const practiceAdvanceRef = useRef(null);

  // Timed quiz state
  const [mode, setMode] = useState("practice");
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [quizQuestions, setQuizQuestions] = useState(() => createNewRound());
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState([null, null, null, null]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [finalQuizHistory, setFinalQuizHistory] = useState([]);

  useEffect(() => {
    return () => {
      if (practiceAdvanceRef.current) {
        window.clearTimeout(practiceAdvanceRef.current);
      }
    };
  }, []);

  // Countdown timer runs only during the timed quiz.
  useEffect(() => {
    if (mode !== "quiz" || !quizStarted || quizCompleted) return undefined;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mode, quizStarted, quizCompleted]);

  // Automatically finish when the timer reaches zero.
  useEffect(() => {
    if (mode === "quiz" && quizStarted && !quizCompleted && timeLeft === 0) {
      finishQuiz();
    }
    // finishQuiz intentionally reads the latest render's quiz state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, quizStarted, quizCompleted, timeLeft]);

  // =====================================
  // QUESTION HELPERS
  // =====================================
  const getCorrectOrder = (questionToCheck) => {
    const originalQuestion = QUESTION_BANK.find(
      (item) => item.id === questionToCheck.id
    );

    return [...originalQuestion.items]
      .sort((a, b) => a.order - b.order)
      .map((item) => item.id);
  };

  const getQuestionRecord = (
    questionToRecord,
    selectedAnswer,
    number
  ) => {
    const correctOrder = getCorrectOrder(questionToRecord);
    const isComplete = selectedAnswer.every(Boolean);
    const isCorrect =
      isComplete &&
      selectedAnswer.every((id, index) => id === correctOrder[index]);

    return {
      questionNumber: number,
      questionId: questionToRecord.id,
      questionItems: questionToRecord.items,
      selectedAnswer: [...selectedAnswer],
      correctOrder,
      status: !isComplete
        ? selectedAnswer.some(Boolean)
          ? "Incomplete"
          : "Unanswered"
        : isCorrect
        ? "Correct"
        : "Wrong",
      isCorrect,
    };
  };

  // =====================================
  // PRACTICE MODE FUNCTIONS
  // =====================================
  function moveToNextPracticeQuestion() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
    } else {
      setQuestions((previous) => createNewRound(previous));
      setQuestionIndex(0);
    }

    setAnswer([null, null, null, null]);
    setFeedback("");
    setIsChecking(false);
  }

  function evaluatePracticeAnswer(nextAnswer) {
    if (isChecking) return;

    setIsChecking(true);

    const currentQuestion = questions[questionIndex];
    const correctOrder = getCorrectOrder(currentQuestion);
    const isCorrect = nextAnswer.every(
      (id, index) => id === correctOrder[index]
    );

    if (isCorrect) {
      setFeedback("success");
      setScore((value) => value + 1);
      playSound(VERY_GOOD_SOUND);

      practiceAdvanceRef.current = window.setTimeout(() => {
        moveToNextPracticeQuestion();
      }, 1500);
    } else {
      setFeedback("wrong");
      playSound(TRY_AGAIN_SOUND);
      setAnswer([null, null, null, null]);
      setIsChecking(false);
    }
  }

  function placePracticeItem(itemId, slotIndex) {
    if (!itemId || isChecking || feedback === "success") return;

    const next = [...answer];
    const previousIndex = next.indexOf(itemId);
    const displacedId = next[slotIndex];

    if (previousIndex !== -1) {
      next[previousIndex] = displacedId || null;
    }

    next[slotIndex] = itemId;
    setAnswer(next);

    if (next.every(Boolean)) {
      evaluatePracticeAnswer(next);
    } else {
      setFeedback("");
    }
  }

  function handlePracticePictureClick(itemId) {
    if (isChecking || feedback === "success") return;

    const nextEmptySlot = answer.findIndex((value) => value === null);
    if (nextEmptySlot !== -1) {
      placePracticeItem(itemId, nextEmptySlot);
    }
  }

  function removePracticeItem(slotIndex) {
    if (isChecking || feedback === "success") return;

    setAnswer((current) =>
      current.map((value, index) => (index === slotIndex ? null : value))
    );
    setFeedback("");
  }

  function resetPracticeQuestion() {
    if (isChecking || feedback === "success") return;

    setAnswer([null, null, null, null]);
    setFeedback("");
  }

  // =====================================
  // QUIZ MODE FUNCTIONS
  // =====================================
  function openQuiz() {
    if (practiceAdvanceRef.current) {
      window.clearTimeout(practiceAdvanceRef.current);
      practiceAdvanceRef.current = null;
    }

    setFeedback("");
    setIsChecking(false);
    setMode("quiz");
    setQuizStarted(false);
    setQuizCompleted(false);
  }

  function openPractice() {
    setMode("practice");
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuizAnswer([null, null, null, null]);
  }

  function startQuiz() {
    const firstRound = createNewRound();

    setQuizQuestions(firstRound);
    setQuizQuestionIndex(0);
    setQuizAnswer([null, null, null, null]);
    setQuizHistory([]);
    setFinalQuizHistory([]);
    setTimeLeft(selectedDuration * 60);
    setQuizCompleted(false);
    setQuizStarted(true);
  }

  function moveToNextQuizQuestion() {
    const currentQuestion = quizQuestions[quizQuestionIndex];
    const record = getQuestionRecord(
      currentQuestion,
      quizAnswer,
      quizQuestionIndex + 1 + quizHistory.length
    );

    setQuizHistory((previous) => [...previous, record]);

    if (quizQuestionIndex < quizQuestions.length - 1) {
      setQuizQuestionIndex((index) => index + 1);
    } else {
      const nextRound = createNewRound(quizQuestions);
      setQuizQuestions(nextRound);
      setQuizQuestionIndex(0);
    }

    setQuizAnswer([null, null, null, null]);
  }

  function finishQuiz() {
    if (!quizStarted || quizCompleted) return;

    const currentQuestion = quizQuestions[quizQuestionIndex];
    const currentRecord = getQuestionRecord(
      currentQuestion,
      quizAnswer,
      quizHistory.length + 1
    );

    const completeHistory = [...quizHistory, currentRecord];
    setFinalQuizHistory(completeHistory);
    setQuizHistory(completeHistory);
    setQuizCompleted(true);
    setQuizStarted(false);
  }

  function placeQuizItem(itemId, slotIndex) {
    if (!itemId || quizCompleted) return;

    const next = [...quizAnswer];
    const previousIndex = next.indexOf(itemId);
    const displacedId = next[slotIndex];

    if (previousIndex !== -1) {
      next[previousIndex] = displacedId || null;
    }

    next[slotIndex] = itemId;
    setQuizAnswer(next);
  }

  function handleQuizPictureClick(itemId) {
    const nextEmptySlot = quizAnswer.findIndex((value) => value === null);
    if (nextEmptySlot !== -1) {
      placeQuizItem(itemId, nextEmptySlot);
    }
  }

  function removeQuizItem(slotIndex) {
    setQuizAnswer((current) =>
      current.map((value, index) => (index === slotIndex ? null : value))
    );
  }

  function printAnalysis() {
    const waitForImages = () => {
      const images = Array.from(
        document.querySelectorAll(".aop-analysis-card img")
      );

      return Promise.all(
        images.map((image) => {
          if (image.complete) return Promise.resolve();

          return new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          });
        })
      );
    };

    const timeout = new Promise((resolve) => {
      window.setTimeout(resolve, 1500);
    });

    Promise.race([waitForImages(), timeout]).then(() => {
      window.requestAnimationFrame(() => window.print());
    });
  }

  function restartQuiz() {
    setSelectedDuration(5);
    setQuizStarted(false);
    setQuizCompleted(false);
    setTimeLeft(5 * 60);
    setQuizAnswer([null, null, null, null]);
    setQuizHistory([]);
    setFinalQuizHistory([]);
    setMode("quiz");
  }

  // =====================================
  // SAFETY CHECK
  // =====================================
  if (QUESTION_BANK.length === 0) {
    return (
      <main className="aop-page">
        <section className="aop-result">
          <h1>No questions available</h1>
          <p>
            Please add four correctly named PNG images for each collection.
          </p>
          <button
            type="button"
            className="aop-clear"
            onClick={onBack}
          >
            Back
          </button>
        </section>
      </main>
    );
  }

  // =====================================
  // QUIZ SETUP SCREEN
  // =====================================
  if (mode === "quiz" && !quizStarted && !quizCompleted) {
    return (
      <main className="aop-page aop-quiz-page">
        <div className="aop-quiz-topbar">
          <button
            type="button"
            className="aop-back"
            onClick={openPractice}
          >
            ← PRACTICE
          </button>
          <span className="aop-quiz-mode-label">TIMED QUIZ</span>
        </div>

        <section className="aop-setup-card">
          <div className="aop-setup-icon">📝</div>
          <span className="aop-setup-eyebrow">NUMBER SENSE</span>
          <h1>Ascending Order Quiz</h1>
          <p>Choose your test duration. Arrange the pictures from smallest to biggest.</p>

          <h3>Select Time</h3>
          <div className="aop-timer-options">
            {QUIZ_TIMER_OPTIONS.map((duration) => (
              <button
                key={duration}
                type="button"
                className={`aop-timer-option ${
                  selectedDuration === duration ? "active" : ""
                }`}
                onClick={() => setSelectedDuration(duration)}
                aria-pressed={selectedDuration === duration}
              >
                <strong>{duration}</strong>
                <span>min</span>
              </button>
            ))}
          </div>

          <p className="aop-setup-hint">
            Answer as many questions as you can before the time ends. Your
            answers will be evaluated only after you finish the test.
          </p>

          <button
            type="button"
            className="aop-quiz-primary"
            onClick={startQuiz}
          >
            ▶ Start Quiz
          </button>
        </section>
      </main>
    );
  }

  // =====================================
  // QUIZ ANALYSIS SCREEN
  // =====================================
  if (mode === "quiz" && quizCompleted) {
    const correctCount = finalQuizHistory.filter(
      (item) => item.status === "Correct"
    ).length;
    const wrongCount = finalQuizHistory.filter(
      (item) => item.status === "Wrong"
    ).length;
    const unansweredCount = finalQuizHistory.filter(
      (item) =>
        item.status === "Unanswered" || item.status === "Incomplete"
    ).length;
    const totalQuestions = finalQuizHistory.length;
    const accuracy =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : 0;

    return (
      <main className="aop-page aop-analysis-page">
        <section className="aop-analysis-card">
          <div className="aop-analysis-trophy">🏆</div>
          <h1>Test Completed!</h1>
          <p className="aop-analysis-message">
            Great effort! Review your answers below.
          </p>

          <div className="aop-analysis-score">
            <span>Marks</span>
            <strong>
              {correctCount} / {totalQuestions}
            </strong>
            <span>{accuracy}% Accuracy</span>
          </div>

          <div className="aop-analysis-stats">
            <div className="aop-analysis-stat correct">
              <strong>{correctCount}</strong>
              <span>Correct</span>
            </div>
            <div className="aop-analysis-stat wrong">
              <strong>{wrongCount}</strong>
              <span>Wrong</span>
            </div>
            <div className="aop-analysis-stat unanswered">
              <strong>{unansweredCount}</strong>
              <span>Unanswered</span>
            </div>
          </div>

          <div className="aop-analysis-details">
            <div>
              <span>Total Questions</span>
              <strong>{totalQuestions}</strong>
            </div>
            <div>
              <span>Attempted Questions</span>
              <strong>{correctCount + wrongCount}</strong>
            </div>
            <div>
              <span>Accuracy</span>
              <strong>{accuracy}%</strong>
            </div>
            <div>
              <span>Time Remaining</span>
              <strong>{formatTime(timeLeft)}</strong>
            </div>
          </div>

          <div className="aop-review-section">
            <div className="aop-review-title">
              <h2>Question-wise Analysis</h2>
              <p>Review your answers and learn from each question.</p>
            </div>

            {finalQuizHistory.map((item) => (
              <article
                className={`aop-review-item ${
                  item.status === "Correct"
                    ? "review-correct"
                    : item.status === "Wrong"
                    ? "review-wrong"
                    : "review-unanswered"
                }`}
                key={`${item.questionNumber}-${item.questionId}`}
              >
                <div className="aop-review-heading">
                  <strong>Question {item.questionNumber}</strong>
                  <span>{item.status}</span>
                </div>

                <p className="aop-review-caption">Your answer</p>
                <div className="aop-review-images">
                  {item.selectedAnswer.some(Boolean) ? (
                    item.selectedAnswer.map((id, index) => {
                      const selectedItem = item.questionItems.find(
                        (picture) => picture.id === id
                      );

                      return (
                        <div className="aop-review-picture" key={`${index}-${id || "empty"}`}>
                          {selectedItem ? (
                            <span
                              className="aop-review-photo"
                              style={{ height: `${selectedItem.size}px` }}
                            >
                              <img src={selectedItem.image} alt="Your selected object" />
                            </span>
                          ) : (
                            <span className="aop-review-missing">Not placed</span>
                          )}
                          <small>{index + 1}</small>
                        </div>
                      );
                    })
                  ) : (
                    <p className="aop-review-not-answered">No answer submitted</p>
                  )}
                </div>

                <p className="aop-review-caption">Correct order: Smallest → Biggest</p>
                <div className="aop-review-images aop-correct-order-images">
                  {item.correctOrder.map((id, index) => {
                    const correctItem = item.questionItems.find(
                      (picture) => picture.id === id
                    );

                    return (
                      <div className="aop-review-picture" key={`${index}-${id}`}>
                        <span
                          className="aop-review-photo"
                          style={{ height: `${correctItem.size}px` }}
                        >
                          <img src={correctItem.image} alt="Correctly ordered object" />
                        </span>
                        <small>{index + 1}</small>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="aop-print-button"
            onClick={printAnalysis}
          >
            🖨 Print Analysis
          </button>
          <button
            type="button"
            className="aop-quiz-primary"
            onClick={restartQuiz}
          >
            Play Again
          </button>
          <button
            type="button"
            className="aop-quiz-secondary"
            onClick={openPractice}
          >
            Back to Practice
          </button>
        </section>
      </main>
    );
  }

  // =====================================
  // ACTIVE QUIZ SCREEN
  // =====================================
  if (mode === "quiz" && quizStarted) {
    const question = quizQuestions[quizQuestionIndex];
    const available = question.items.filter(
      (item) => !quizAnswer.includes(item.id)
    );

    return (
      <main className="aop-page aop-active-quiz-page">
        <header className="aop-quiz-header">
          <div>
            <span className="aop-setup-eyebrow">NUMBER SENSE · QUIZ</span>
            <h1>Ascending Order</h1>
            <p>Arrange the pictures from smallest to biggest.</p>
          </div>
          <div className="aop-quiz-header-actions">
            <div className="aop-live-timer">
              <span>⏰</span>
              <strong>{formatTime(timeLeft)}</strong>
            </div>
            <button
              type="button"
              className="aop-end-test"
              onClick={finishQuiz}
            >
              ⛔ End Test
            </button>
          </div>
        </header>

        <section className="aop-question">
          <div className="aop-quiz-progress">
            <span>Question {quizHistory.length + 1}</span>
            <span>Time-based test</span>
          </div>

          <div className="aop-pictures">
            {available.map((item) => (
              <PictureTile
                key={item.id}
                item={item}
                onClick={() => handleQuizPictureClick(item.id)}
              />
            ))}
          </div>

          <div className="aop-answer-heading">
            <span>Your answer</span>
            <span>Smallest → Biggest</span>
          </div>

          <div className="aop-slots">
            {quizAnswer.map((id, index) => {
              const item = question.items.find((entry) => entry.id === id);

              return (
                <button
                  type="button"
                  key={index}
                  className={`aop-slot ${item ? "filled" : ""}`}
                  onClick={() => {
                    if (item) removeQuizItem(index);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    placeQuizItem(
                      event.dataTransfer.getData("text/plain"),
                      index
                    );
                  }}
                >
                  <small>{index + 1}</small>
                  {item ? (
                    <span
                      className="aop-slot-photo"
                      style={{ height: `${item.size}px` }}
                    >
                      <img src={item.image} alt="Object" draggable="false" />
                    </span>
                  ) : (
                    <span className="aop-empty">Drop here</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="aop-quiz-bottom-row">
            <p className="aop-quiz-private-note">
              Your answers will be checked after the test.
            </p>
            <button
              type="button"
              className="aop-quiz-next"
              onClick={moveToNextQuizQuestion}
              disabled={timeLeft === 0}
            >
              Next Question →
            </button>
          </div>
        </section>
      </main>
    );
  }

  // =====================================
  // EXISTING PRACTICE SCREEN
  // =====================================
  const question = questions[questionIndex];
  const available = question.items.filter(
    (item) => !answer.includes(item.id)
  );

  return (
    <main className="aop-page">
      <header className="aop-header">
        <button
          type="button"
          className="aop-back"
          onClick={onBack}
        >
          ← BACK
        </button>
        <h1>Ascending Order</h1>
        <div className="aop-header-actions">
          <button
            type="button"
            className="aop-worksheet-button"
            onClick={() => setShowWorksheet(true)}
          >
            🖨️ Worksheet
          </button>
          <button
            type="button"
            className="aop-quiz-button"
            onClick={openQuiz}
          >
            📝 Quiz
          </button>
        </div>
      </header>

      {showWorksheet && (
        <AscendingOrderPictureWorksheet
          questionBank={QUESTION_BANK}
          onClose={() => setShowWorksheet(false)}
        />
      )}

      <section className="aop-question">
        <div className="aop-pictures">
          {available.map((item) => (
            <PictureTile
              key={item.id}
              item={item}
              onClick={() => handlePracticePictureClick(item.id)}
            />
          ))}
        </div>

        <div className="aop-answer-heading">
          <span>Your answer</span>
          <span>Smallest → Biggest</span>
        </div>

        <div className="aop-slots">
          {answer.map((id, index) => {
            const item = question.items.find((entry) => entry.id === id);

            return (
              <button
                type="button"
                key={index}
                className={`aop-slot ${item ? "filled" : ""}`}
                onClick={() => {
                  if (item) removePracticeItem(index);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  placePracticeItem(
                    event.dataTransfer.getData("text/plain"),
                    index
                  );
                }}
              >
                <small>{index + 1}</small>
                {item ? (
                  <span
                    className="aop-slot-photo"
                    style={{ height: `${item.size}px` }}
                  >
                    <img src={item.image} alt="Object" draggable="false" />
                  </span>
                ) : (
                  <span className="aop-empty">Drop here</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="aop-actions">
          <button
            type="button"
            className="aop-clear"
            onClick={resetPracticeQuestion}
          >
            Clear answer
          </button>
        </div>

        {feedback === "wrong" && (
          <p className="aop-retry">
            Try again! 💛 Check the sizes carefully.
          </p>
        )}
        {feedback === "success" && (
          <p className="aop-good">
            Excellent! 🎉 Your answer is correct!
          </p>
        )}
      </section>

      <p className="aop-score">Correct answers: {score}</p>
    </main>
  );
}