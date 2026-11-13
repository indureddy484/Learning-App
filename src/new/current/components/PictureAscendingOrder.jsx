
import { useEffect, useRef, useState } from "react";
import "./PictureAscendingOrder.css";

const TIMER_OPTIONS = [1, 2, 5, 10, 20];

// Four clearly different picture sizes
const SIZE_VALUES = [60, 105, 155, 205];

// Automatically discover all images using Webpack.
// Component: src/new/current/components/
// Images: src/assets/images/ascending/
const imageContext = require.context(
  "../../../assets/images/ascending",
  false,
  /\.(png|jpe?g|webp|avif)$/i
);

// Get all discovered image paths
const ALL_IMAGES = imageContext
  .keys()
  .map((key) => {
    const imageModule = imageContext(key);
    return typeof imageModule === "string"
      ? imageModule
      : imageModule.default;
  })
  .filter(Boolean);

// Shuffle array
const shuffle = (array) => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

// Create random image deck
const createImageDeck = (images, previousImage = null) => {
  const deck = shuffle(images);

  // Avoid repeating the last image immediately at deck boundary
  if (
    deck.length > 1 &&
    previousImage &&
    deck[0] === previousImage
  ) {
    [deck[0], deck[1]] = [deck[1], deck[0]];
  }

  return deck;
};

// Generate question
const generateQuestion = (questionNumber, imagePath) => {
  const object = {
    name: "picture",
    image: "🖼️",
    photo: imagePath,
  };

  const questionType =
    Math.random() < 0.5 ? "smallest" : "largest";

  // Shuffle four different sizes
  const sizes = shuffle([0, 1, 2, 3]);

  const options = sizes.map((sizeIndex, index) => ({
    id: `${questionNumber}-${index}`,
    label: String.fromCharCode(65 + index),
    sizeIndex,
    size: SIZE_VALUES[sizeIndex],
    object,
  }));

  const correctOption = options.find((option) =>
    questionType === "smallest"
      ? option.sizeIndex === 0
      : option.sizeIndex === 3
  );

  return {
    questionNumber,
    object,
    questionType,
    prompt:
      questionType === "smallest"
        ? "Which picture is the smallest?"
        : "Which picture is the largest?",
    options,
    correctId: correctOption.id,
    correctLabel: correctOption.label,
  };
};

// Format timer
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

// Picture component
// compact=true is used in result analysis
function ObjectPhoto({ imagePath, size, compact = false }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imagePath]);

  return (
    <span
      className={`picture-local-image-container ${
        compact ? "picture-compact-image" : ""
      }`}
      style={
        compact
          ? { "--picture-size": "105px" }
          : { "--picture-size": `${size}px` }
      }
    >
      {imageFailed ? (
        <span
          className="picture-image-fallback"
          style={{
            fontSize: compact ? "45px" : `${size * 0.6}px`,
          }}
        >
          🖼️
        </span>
      ) : (
        <img
          src={imagePath}
          alt="Picture"
          className={`real-object-image ${
            compact ? "picture-review-photo" : ""
          }`}
          onError={() => setImageFailed(true)}
        />
      )}
    </span>
  );
}

function PictureAscendingOrder({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState("level1");
  const [selectedDuration, setSelectedDuration] = useState(2);

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [endReason, setEndReason] = useState(null);

  const [timeLeft, setTimeLeft] = useState(120);

  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState(null);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [history, setHistory] = useState([]);

  // Image deck references
  const imageDeckRef = useRef([]);
  const previousImageRef = useRef(null);

  // Get next image without repeating until the deck is exhausted
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

  // Timer
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted]);

  // Automatically end when time expires
  useEffect(() => {
    if (quizStarted && timeLeft === 0 && !quizCompleted) {
      setEndReason("timeout");
      setQuizCompleted(true);
    }
  }, [quizStarted, timeLeft, quizCompleted]);

  // Start quiz
  const startQuiz = () => {
    if (selectedLevel !== "level1" || ALL_IMAGES.length === 0) {
      return;
    }

    // Fresh random order for every test
    imageDeckRef.current = createImageDeck(ALL_IMAGES);
    previousImageRef.current = null;

    const firstImage = getNextImage();

    setQuestionNumber(1);
    setQuestion(generateQuestion(1, firstImage));
    setSelectedAnswer(null);
    setHistory([]);
    setTimeLeft(selectedDuration * 60);
    setEndReason(null);
    setQuizCompleted(false);
    setQuizStarted(true);
  };

  // End test manually
  const endTest = () => {
    if (!quizStarted || quizCompleted) return;

    setEndReason("manual");
    setQuizCompleted(true);
  };

  // Final history includes the current unsubmitted question
  const finalHistory =
    quizCompleted && question
      ? [
          ...history,
          {
            questionNumber: question.questionNumber,
            prompt: question.prompt,
            object: question.object,
            options: question.options,
            selectedLabel: selectedAnswer?.label || null,
            correctLabel: question.correctLabel,
            status:
              selectedAnswer === null
                ? "Unanswered"
                : "Not Submitted",
          },
        ]
      : history;

  // Submit answer
  const submitAnswer = () => {
    if (
      selectedAnswer === null ||
      quizCompleted ||
      timeLeft <= 0 ||
      !question
    ) {
      return;
    }

    const isCorrect =
      selectedAnswer.id === question.correctId;

    const record = {
      questionNumber: question.questionNumber,
      prompt: question.prompt,
      object: question.object,
      options: question.options,
      selectedLabel: selectedAnswer.label,
      correctLabel: question.correctLabel,
      isCorrect,
      status: isCorrect ? "Correct" : "Wrong",
    };

    setHistory((previous) => [...previous, record]);

    const nextNumber = questionNumber + 1;
    const nextImage = getNextImage();

    setQuestionNumber(nextNumber);
    setQuestion(generateQuestion(nextNumber, nextImage));
    setSelectedAnswer(null);
  };

  // Restart quiz
  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setEndReason(null);
    setQuestionNumber(1);
    setQuestion(null);
    setSelectedAnswer(null);
    setHistory([]);
    setTimeLeft(selectedDuration * 60);

    imageDeckRef.current = createImageDeck(ALL_IMAGES);
    previousImageRef.current = null;
  };

  // Results
  const correctCount = finalHistory.filter(
    (item) => item.status === "Correct"
  ).length;

  const incorrectCount = finalHistory.filter(
    (item) => item.status === "Wrong"
  ).length;

  const unansweredCount = finalHistory.filter(
    (item) =>
      item.status === "Unanswered" ||
      item.status === "Not Submitted"
  ).length;

  const totalQuestions = finalHistory.length;

  const accuracy =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  // Setup screen
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
              : "No photographs found. Add images to src/assets/images/ascending."}
          </p>

          <div className="setup-section">
            <label
              htmlFor="picture-level"
              className="picture-level-label"
            >
              Select Level
            </label>

            <select
              id="picture-level"
              className="picture-level-dropdown"
              value={selectedLevel}
              onChange={(event) =>
                setSelectedLevel(event.target.value)
              }
            >
              <option value="level1">
                Level 1 – Smallest and Largest
              </option>

              <option value="level2" disabled>
                Level 2 – Arrange in Ascending Order (Coming Soon)
              </option>

              <option value="level3" disabled>
                Level 3 – Picture Size Sequences (Coming Soon)
              </option>
            </select>
          </div>

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
              : "▶ Start Quiz"}
          </button>
        </section>
      </main>
    );
  }

  // Result screen
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
              <span>Unanswered / Not Submitted</span>
            </div>
          </div>

          <p className="picture-total">
            Total Questions: {totalQuestions}
          </p>

          <h2 className="picture-analysis-heading">
            Question-wise Analysis
          </h2>

          {finalHistory.map((item) => (
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

              <div className="picture-review-options">
                {item.options.map((option) => (
                  <div
                    key={option.id}
                    className={`picture-review-option ${
                      option.label === item.correctLabel
                        ? "review-answer-correct"
                        : option.label === item.selectedLabel
                        ? "review-answer-wrong"
                        : ""
                    }`}
                  >
                    <span>{option.label}</span>

                    <span className="picture-review-emoji">
                      <ObjectPhoto
                        imagePath={option.object.photo}
                        size={option.size}
                        compact
                      />
                    </span>
                  </div>
                ))}
              </div>

              <div className="picture-review-answer">
                <p>
                  <strong>Your Answer:</strong>{" "}
                  {item.selectedLabel
                    ? `Option ${item.selectedLabel}`
                    : "Not answered"}
                </p>

                <p>
                  <strong>Correct Answer:</strong>{" "}
                  Option {item.correctLabel}
                </p>
              </div>
            </article>
          ))}

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
            Back to Number Sense
          </button>
        </section>
      </main>
    );
  }

  // Quiz screen
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
          <h1>Level 1</h1>
        </div>
      </header>

      <section className="picture-quiz-card">
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
          Look at all four pictures and choose one answer.
        </p>

        <div className="picture-options-grid">
          {question.options.map((option) => {
            const isSelected =
              selectedAnswer?.id === option.id;

            return (
              <button
                type="button"
                key={option.id}
                className={`picture-option ${
                  isSelected ? "picture-option-selected" : ""
                }`}
                onClick={() => setSelectedAnswer(option)}
                aria-pressed={isSelected}
              >
                <span className="picture-option-letter">
                  {option.label}
                </span>

                <span className="picture-option-image">
                  <ObjectPhoto
                    imagePath={option.object.photo}
                    size={option.size}
                  />
                </span>
              </button>
            );
          })}
        </div>

        <div className="picture-quiz-actions">
          <button
            className="picture-primary-button next-question-button"
            onClick={submitAnswer}
            disabled={selectedAnswer === null || timeLeft === 0}
            type="button"
          >
            Next Question →
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

export default PictureAscendingOrder;
