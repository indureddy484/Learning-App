
import { useEffect, useRef, useState } from "react";
import "./PictureAscendingOrder.css";
import "./PictureAscendingOrderLevel2.css";

const TIMER_OPTIONS = [1, 2, 5, 10, 20];

// Four clearly different image scales, relative to the picture area.
const SIZE_VALUES = [30, 48, 68, 90];

const imageContext = require.context(
  "../../../assets/images/ascending",
  false,
  /\.(png|jpe?g|webp|avif)$/i
);

const ALL_IMAGES = imageContext
  .keys()
  .map((key) => {
    const imageModule = imageContext(key);
    return typeof imageModule === "string"
      ? imageModule
      : imageModule.default;
  })
  .filter(Boolean);

const shuffle = (array) => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const createImageDeck = (images, previousImage = null) => {
  const deck = shuffle(images);

  if (
    deck.length > 1 &&
    previousImage &&
    deck[0] === previousImage
  ) {
    [deck[0], deck[1]] = [deck[1], deck[0]];
  }

  return deck;
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

// Create one question using the same picture at four sizes.
const generateQuestion = (questionNumber, imagePath) => {
  const direction =
    Math.random() < 0.5 ? "ascending" : "descending";

  const shuffledSizes = shuffle([0, 1, 2, 3]);

  const options = shuffledSizes.map((sizeIndex, index) => ({
    id: `${questionNumber}-${index}`,
    sizeIndex,
    size: SIZE_VALUES[sizeIndex],
    imagePath,
  }));

  const correctOrder =
    direction === "ascending"
      ? [...options].sort((a, b) => a.sizeIndex - b.sizeIndex)
      : [...options].sort((a, b) => b.sizeIndex - a.sizeIndex);

  return {
    questionNumber,
    imagePath,
    direction,
    prompt:
      direction === "ascending"
        ? "Arrange the pictures in ascending order."
        : "Arrange the pictures in descending order.",
    instruction:
      direction === "ascending"
        ? "Start with the smallest picture and finish with the largest."
        : "Start with the largest picture and finish with the smallest.",
    options,
    correctOrder: correctOrder.map((item) => item.id),
  };
};

// Picture display component.
function Level2Photo({ imagePath, size, compact = false }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [imagePath]);

  return (
    <div className={`level2-photo-stage ${compact ? "compact" : ""}`}>
      {failed ? (
        <span className="level2-photo-fallback">🖼️</span>
      ) : (
        <img
          src={imagePath}
          alt="Picture"
          className="level2-photo"
          style={{
            width: compact ? "100%" : `${size}%`,
          }}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function PictureAscendingOrderLevel2({ onBack, onExit }) {
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [endReason, setEndReason] = useState(null);

  const [timeLeft, setTimeLeft] = useState(120);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState(null);

  // Stores the IDs in the order selected by the child.
  const [selectedOrder, setSelectedOrder] = useState([]);

  const [history, setHistory] = useState([]);

  const imageDeckRef = useRef([]);
  const previousImageRef = useRef(null);
  const advanceTimeoutRef = useRef(null);

  const getNextImage = () => {
    if (imageDeckRef.current.length === 0) {
      imageDeckRef.current = createImageDeck(
        ALL_IMAGES,
        previousImageRef.current
      );
    }

    const nextImage = imageDeckRef.current.shift();
    previousImageRef.current = nextImage;

    return nextImage;
  };

  // Timer.
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);

  // Automatically end when time expires.
  useEffect(() => {
    if (quizStarted && timeLeft === 0 && !quizCompleted) {
      setEndReason("timeout");
      setQuizCompleted(true);
    }
  }, [quizStarted, timeLeft, quizCompleted]);

  // Clean up automatic question transition.
  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const startQuiz = () => {
    if (ALL_IMAGES.length === 0) return;

    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }

    imageDeckRef.current = createImageDeck(ALL_IMAGES);
    previousImageRef.current = null;

    const firstImage = getNextImage();

    setQuestionNumber(1);
    setQuestion(generateQuestion(1, firstImage));
    setSelectedOrder([]);
    setHistory([]);
    setTimeLeft(selectedDuration * 60);
    setEndReason(null);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  // Add a picture to the next available position.
  const selectPicture = (option) => {
    if (
      selectedOrder.length === 4 ||
      selectedOrder.includes(option.id) ||
      quizCompleted ||
      timeLeft <= 0
    ) {
      return;
    }

    const updatedOrder = [...selectedOrder, option.id];

    setSelectedOrder(updatedOrder);

    // Once all four pictures are arranged, save the answer.
    if (updatedOrder.length === 4) {
      const isCorrect = updatedOrder.every(
        (id, index) => id === question.correctOrder[index]
      );

      const record = {
        questionNumber: question.questionNumber,
        prompt: question.prompt,
        instruction: question.instruction,
        direction: question.direction,
        imagePath: question.imagePath,
        options: question.options,
        selectedOrder: updatedOrder,
        correctOrder: question.correctOrder,
        isCorrect,
        status: isCorrect ? "Correct" : "Wrong",
      };

      setHistory((previous) => [...previous, record]);

      // No answer feedback is shown. Move to the next question.
      advanceTimeoutRef.current = setTimeout(() => {
        const nextNumber = questionNumber + 1;
        const nextImage = getNextImage();

        setQuestionNumber(nextNumber);
        setQuestion(generateQuestion(nextNumber, nextImage));
        setSelectedOrder([]);
      }, 700);
    }
  };

  // Remove the last selected picture if the child wants to correct the order.
  const undoLastSelection = () => {
    if (selectedOrder.length === 0 || selectedOrder.length === 4) {
      return;
    }

    setSelectedOrder((previous) => previous.slice(0, -1));
  };

  const endTest = () => {
    if (!quizStarted || quizCompleted) return;

    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }

    setEndReason("manual");
    setQuizCompleted(true);
  };

  const restartQuiz = () => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }

    setQuizStarted(false);
    setQuizCompleted(false);
    setEndReason(null);
    setQuestionNumber(1);
    setQuestion(null);
    setSelectedOrder([]);
    setHistory([]);
    setTimeLeft(selectedDuration * 60);

    imageDeckRef.current = [];
    previousImageRef.current = null;
  };

  // Include the current unfinished question in the final analysis.
  const finalHistory =
    quizCompleted && question
      ? [
          ...history,
          {
            questionNumber: question.questionNumber,
            prompt: question.prompt,
            instruction: question.instruction,
            direction: question.direction,
            imagePath: question.imagePath,
            options: question.options,
            selectedOrder,
            correctOrder: question.correctOrder,
            status:
              selectedOrder.length === 0
                ? "Unanswered"
                : "Incomplete",
          },
        ]
      : history;

  const correctCount = finalHistory.filter(
    (item) => item.status === "Correct"
  ).length;

  const incorrectCount = finalHistory.filter(
    (item) => item.status === "Wrong"
  ).length;

  const unansweredCount = finalHistory.filter(
    (item) =>
      item.status === "Unanswered" ||
      item.status === "Incomplete"
  ).length;

  const totalQuestions = finalHistory.length;

  const accuracy =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  // SETUP SCREEN.
  if (!quizStarted) {
    return (
      <main className="picture-ascending-page">
        <button
          className="picture-back-button setup-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <section className="picture-setup-card">
          <h1 className="setup-heading">
            Picture-Based Ascending Order
          </h1>

          <p className="image-loading-message">
            {ALL_IMAGES.length > 0
              ? `${ALL_IMAGES.length} photographs available`
              : "No photographs found. Check your ascending images folder."}
          </p>

          <div className="level2-setup-label">
            Level 2 – Arrange Pictures
          </div>

          <p className="level2-setup-description">
            Arrange four different sizes of the same picture
            from smallest to largest or largest to smallest.
          </p>

          <div className="setup-section">
            <h3 className="picture-time-heading">
              Select Time Limit
            </h3>

            <div className="picture-time-options">
              {TIMER_OPTIONS.map((duration) => (
                <button
                  key={duration}
                  type="button"
                  className={`picture-time-option ${
                    selectedDuration === duration ? "active" : ""
                  }`}
                  onClick={() => setSelectedDuration(duration)}
                  aria-pressed={selectedDuration === duration}
                >
                  <strong>{duration}</strong>
                  <span>
                    {duration === 1 ? "Minute" : "Minutes"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="picture-primary-button setup-start-button"
            onClick={startQuiz}
            type="button"
            disabled={ALL_IMAGES.length === 0}
          >
            {ALL_IMAGES.length === 0
              ? "No Pictures Available"
              : "▶ Start Level 2"}
          </button>
        </section>
      </main>
    );
  }

  // RESULTS SCREEN.
  if (quizCompleted) {
    return (
      <main className="picture-ascending-page">
        <button
          className="picture-back-button no-print"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <section className="picture-result-card">
          <div className="picture-result-icon">
            {endReason === "timeout" ? "⏰" : "🏆"}
          </div>

          <h1>
            {endReason === "timeout"
              ? "Time's Up!"
              : "Test Completed!"}
          </h1>

          <p className="picture-description">
            {endReason === "timeout"
              ? "Your time is over. Great effort!"
              : "You have successfully ended the test. Great job!"}
          </p>

          <div className="picture-score-box">
            <span>Your Score</span>
            <strong>
              {correctCount} / {totalQuestions}
            </strong>
            <span>{accuracy}% Accuracy</span>
          </div>

          <div className="picture-stats">
            <div className="picture-stat correct">
              <strong>{correctCount}</strong>
              <span>Correct</span>
            </div>

            <div className="picture-stat incorrect">
              <strong>{incorrectCount}</strong>
              <span>Wrong</span>
            </div>

            <div className="picture-stat unanswered">
              <strong>{unansweredCount}</strong>
              <span>Unanswered / Incomplete</span>
            </div>
          </div>

          <p className="picture-total">
            Total Questions: {totalQuestions}
          </p>

          <h2 className="picture-analysis-heading">
            Question-wise Analysis
          </h2>

          {finalHistory.map((item) => {
            const selectedOptions = item.selectedOrder
              .map((id) => item.options.find((option) => option.id === id))
              .filter(Boolean);

            const correctOptions = item.correctOrder
              .map((id) => item.options.find((option) => option.id === id))
              .filter(Boolean);

            return (
              <article
                key={item.questionNumber}
                className={`picture-review-card ${
                  item.status === "Correct"
                    ? "review-correct"
                    : item.status === "Wrong"
                    ? "review-wrong"
                    : "review-unanswered"
                }`}
              >
                <div className="picture-review-header">
                  <strong>
                    Question {item.questionNumber}
                  </strong>
                  <span>{item.status}</span>
                </div>

                <p className="picture-review-prompt">
                  {item.prompt}
                </p>

                <p className="level2-analysis-label">
                  Your arrangement
                </p>

                <div className="level2-analysis-order">
                  {selectedOptions.length > 0 ? (
                    selectedOptions.map((option, index) => (
                      <div
                        className="level2-analysis-item"
                        key={option.id}
                      >
                        <span className="level2-position">
                          {index + 1}
                        </span>
                        <Level2Photo
                          imagePath={option.imagePath}
                          size={option.size}
                          compact
                        />
                      </div>
                    ))
                  ) : (
                    <p>Not attempted</p>
                  )}
                </div>

                <p className="level2-analysis-label">
                  Correct arrangement
                </p>

                <div className="level2-analysis-order">
                  {correctOptions.map((option, index) => (
                    <div
                      className="level2-analysis-item"
                      key={option.id}
                    >
                      <span className="level2-position">
                        {index + 1}
                      </span>
                      <Level2Photo
                        imagePath={option.imagePath}
                        size={option.size}
                        compact
                      />
                    </div>
                  ))}
                </div>
              </article>
            );
          })}

          <button
            className="picture-print-button no-print"
            onClick={() => window.print()}
            type="button"
          >
            🖨️ Print Analysis
          </button>

          <button
            className="picture-primary-button no-print"
            onClick={restartQuiz}
            type="button"
          >
            Play Again
          </button>

          <button
            className="picture-secondary-button no-print"
            onClick={onBack}
            type="button"
          >
            Back to Levels
          </button>

          {onExit && (
            <button
              className="picture-secondary-button no-print"
              onClick={onExit}
              type="button"
            >
              Back to Number Sense
            </button>
          )}
        </section>
      </main>
    );
  }

  // QUIZ SCREEN.
  const selectedOptions = selectedOrder
    .map((id) => question.options.find((option) => option.id === id))
    .filter(Boolean);

  return (
    <main className="picture-ascending-page">
      <header className="picture-quiz-header">
        <button
          className="picture-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <div>
          <span className="picture-eyebrow">
            PICTURE-BASED ASCENDING ORDER
          </span>
          <h1>Level 2</h1>
        </div>
      </header>

      <section className="picture-quiz-card level2-quiz-card">
        <div className="picture-progress">
          <span>Question {questionNumber}</span>
          <span>Score: {correctCount}</span>
        </div>

        <div className="picture-timer-display">
          <span>⏰</span>
          <strong>{formatTime(timeLeft)}</strong>
        </div>

        <h2 className="picture-question">
          {question.prompt}
        </h2>

        <p className="picture-instruction">
          {question.instruction}
        </p>

        <div className="level2-arrangement-area">
          <h3>Your arrangement</h3>

          <div className="level2-answer-slots">
            {[0, 1, 2, 3].map((index) => {
              const option = selectedOptions[index];

              return (
                <div
                  className={`level2-answer-slot ${
                    option ? "filled" : ""
                  }`}
                  key={index}
                >
                  <span className="level2-position">
                    {index + 1}
                  </span>

                  {option ? (
                    <Level2Photo
                      imagePath={option.imagePath}
                      size={option.size}
                    />
                  ) : (
                    <span className="level2-slot-placeholder">
                      Select
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="level2-picture-area">
          <h3>Click the pictures in the correct order</h3>

          <div className="level2-picture-grid">
            {question.options.map((option) => {
              const isSelected = selectedOrder.includes(option.id);

              return (
                <button
                  type="button"
                  key={option.id}
                  className={`level2-picture-card ${
                    isSelected ? "level2-picture-used" : ""
                  }`}
                  onClick={() => selectPicture(option)}
                  disabled={isSelected || selectedOrder.length === 4}
                  aria-label={`Select picture ${option.id}`}
                >
                  <span className="level2-picture-check">
                    {isSelected
                      ? `✓ ${selectedOrder.indexOf(option.id) + 1}`
                      : "＋"}
                  </span>

                  <Level2Photo
                    imagePath={option.imagePath}
                    size={option.size}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="level2-progress-text">
          {selectedOrder.length === 4
            ? "Well done! Moving to the next question..."
            : `${selectedOrder.length} of 4 pictures arranged`}
        </div>

        <div className="picture-quiz-actions">
          <button
            className="picture-secondary-button"
            onClick={undoLastSelection}
            disabled={selectedOrder.length === 0 || selectedOrder.length === 4}
            type="button"
          >
            ↶ Undo Last
          </button>

          <button
            className="picture-end-test-button"
            onClick={endTest}
            type="button"
          >
            End Test
          </button>
        </div>
      </section>
    </main>
  );
}

export default PictureAscendingOrderLevel2;
