
import React, { useState } from "react";
import "./ascendingorderpicture.css";

// =====================================
// SOUND FILES
// =====================================

const VERY_GOOD_SOUND = "/sounds/very-good.mp3";
const TRY_AGAIN_SOUND = "/sounds/try-again.mp3";

function playSound(soundPath) {
  const audio = new Audio(soundPath);

  audio.play().catch((error) => {
    console.warn("Unable to play sound:", error);
  });
}

// =====================================
// LOAD IMAGES
// =====================================

const imageFiles = require.context(
  "../../../assets/images/ascending-order",
  false,
  /\.png$/i
);

// =====================================
// SHUFFLE HELPERS
// =====================================

function shuffleItems(items) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
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
      .replace(/\.png$/i, "");

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
      items: [...items].sort(
        (a, b) => a.order - b.order
      ),
    }))
    .filter((question) => {
      const hasFourImages = question.items.length === 4;

      const hasUniqueOrders =
        new Set(
          question.items.map((item) => item.order)
        ).size === 4;

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

  const allPermutations = generatePermutations([
    0, 1, 2, 3,
  ]);

  const incorrectPermutations = shuffleItems(
    allPermutations.filter(
      (pattern) =>
        pattern.some(
          (value, index) => value !== index
        )
    )
  );

  const previousArrangements = {};

  previousRound.forEach((question) => {
    previousArrangements[question.id] =
      question.displayOrder;
  });

  const usedPatterns = new Set();
  const newRound = [];

  let previousQuestionPattern = null;

  shuffledQuestions.forEach((question) => {
    const previousPattern =
      previousArrangements[question.id];

    let availablePatterns = incorrectPermutations.filter(
      (pattern) => {
        const key = pattern.join("");

        return (
          !usedPatterns.has(key) &&
          (!previousPattern ||
            key !== previousPattern.join(""))
        );
      }
    );

    if (availablePatterns.length === 0) {
      availablePatterns = incorrectPermutations.filter(
        (pattern) =>
          !usedPatterns.has(pattern.join(""))
      );
    }

    let selectedPattern;

    if (
      previousQuestionPattern &&
      availablePatterns.length > 0
    ) {
      const scoredPatterns = availablePatterns.map(
        (pattern) => ({
          pattern,
          difference: getDifference(
            pattern,
            previousQuestionPattern
          ),
        })
      );

      const maximumDifference = Math.max(
        ...scoredPatterns.map(
          (item) => item.difference
        )
      );

      const bestPatterns = scoredPatterns
        .filter(
          (item) =>
            item.difference === maximumDifference
        )
        .map((item) => item.pattern);

      selectedPattern = shuffleItems(bestPatterns)[0];
    } else {
      selectedPattern = shuffleItems(
        availablePatterns
      )[0];
    }

    if (!selectedPattern) {
      selectedPattern = shuffleItems(
        incorrectPermutations
      )[0];
    }

    usedPatterns.add(selectedPattern.join(""));
    previousQuestionPattern = selectedPattern;

    newRound.push({
      ...question,

      items: selectedPattern.map(
        (index) => question.items[index]
      ),

      displayOrder: [...selectedPattern],
    });
  });

  return newRound;
}

// =====================================
// PICTURE TILE
// =====================================

function PictureTile({ item, onClick }) {
  return (
    <button
      type="button"
      className="aop-pic"
      onClick={onClick}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData(
          "text/plain",
          item.id
        );
      }}
      aria-label="Select picture"
    >
      <span
        className="aop-photo-wrap"
        style={{ height: `${item.size}px` }}
      >
        <img
          src={item.image}
          alt="Object"
          draggable="false"
        />
      </span>
    </button>
  );
}

// =====================================
// MAIN COMPONENT
// =====================================

export default function AscendingOrderPicture({ onBack }) {
  const [questions, setQuestions] = useState(
    () => createNewRound()
  );

  const [questionIndex, setQuestionIndex] = useState(0);

  const [answer, setAnswer] = useState([
    null,
    null,
    null,
    null,
  ]);

  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // =====================================
  // SAFETY CHECK
  // =====================================

  if (QUESTION_BANK.length === 0) {
    return (
      <main className="aop-page">
        <section className="aop-result">
          <h1>No questions available</h1>

          <p>
            Please add four correctly named PNG images
            for each collection.
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

  const question = questions[questionIndex];

  const available = question.items.filter(
    (item) => !answer.includes(item.id)
  );

  const originalQuestion = QUESTION_BANK.find(
    (item) => item.id === question.id
  );

  const correctOrder = [...originalQuestion.items]
    .sort((a, b) => a.order - b.order)
    .map((item) => item.id);

  // =====================================
  // MOVE TO NEXT QUESTION
  // =====================================

  function moveToNextQuestion() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
    } else {
      // Start another shuffled question set.
      setQuestions((previousQuestions) =>
        createNewRound(previousQuestions)
      );

      setQuestionIndex(0);
    }

    setAnswer([null, null, null, null]);
    setFeedback("");
    setIsChecking(false);
  }

  // =====================================
  // AUTOMATIC ANSWER CHECKING
  // =====================================

  function evaluateAnswer(nextAnswer) {
    if (isChecking) return;

    setIsChecking(true);

    const isCorrect = nextAnswer.every(
      (id, index) => id === correctOrder[index]
    );

    if (isCorrect) {
      setFeedback("success");
      setScore((value) => value + 1);

      playSound(VERY_GOOD_SOUND);

      window.setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    } else {
      setFeedback("wrong");

      playSound(TRY_AGAIN_SOUND);

      // Automatically return all pictures to options.
      // Keep the wrong-answer message visible.
      setAnswer([null, null, null, null]);

      setIsChecking(false);
    }
  }

  // =====================================
  // PLACE PICTURE
  // =====================================

  function placeItem(itemId, slotIndex) {
    if (
      !itemId ||
      isChecking ||
      feedback === "success"
    ) {
      return;
    }

    const next = [...answer];

    const previousIndex = next.indexOf(itemId);
    const displacedId = next[slotIndex];

    // Move an already placed picture if needed.
    if (previousIndex !== -1) {
      next[previousIndex] = displacedId || null;
    }

    next[slotIndex] = itemId;

    setAnswer(next);

    // Automatically check after all four pictures
    // have been arranged.
    if (next.every(Boolean)) {
      evaluateAnswer(next);
    } else {
      setFeedback("");
    }
  }

  // =====================================
  // SINGLE-CLICK PICTURE PLACEMENT
  // =====================================

  function handlePictureClick(itemId) {
    if (
      isChecking ||
      feedback === "success"
    ) {
      return;
    }

    // Find the next empty answer box.
    const nextEmptySlot = answer.findIndex(
      (value) => value === null
    );

    if (nextEmptySlot !== -1) {
      placeItem(itemId, nextEmptySlot);
    }
  }

  // =====================================
  // REMOVE PICTURE
  // =====================================

  function removeItem(slotIndex) {
    if (
      isChecking ||
      feedback === "success"
    ) {
      return;
    }

    setAnswer((current) =>
      current.map((value, index) =>
        index === slotIndex ? null : value
      )
    );

    setFeedback("");
  }

  // =====================================
  // CLEAR ANSWER
  // =====================================

  function resetQuestion() {
    if (
      isChecking ||
      feedback === "success"
    ) {
      return;
    }

    setAnswer([null, null, null, null]);
    setFeedback("");
  }

  // =====================================
  // MAIN SCREEN
  // =====================================

  return (
    <main className="aop-page">

      {/* Main heading */}

      <header className="aop-header">
        <button
          type="button"
          className="aop-back"
          onClick={onBack}
        >
          ← BACK
        </button>

        <h1>Ascending Order</h1>
      </header>

      {/* Picture options */}

      <section className="aop-question">

        <div className="aop-pictures">
          {available.map((item) => (
            <PictureTile
              key={item.id}
              item={item}
              onClick={() =>
                handlePictureClick(item.id)
              }
            />
          ))}
        </div>

        {/* Answer heading */}

        <div className="aop-answer-heading">
          <span>Your answer</span>
          <span>Smallest → Biggest</span>
        </div>

        {/* Answer slots */}

        <div className="aop-slots">
          {answer.map((id, index) => {
            const item = question.items.find(
              (entry) => entry.id === id
            );

            return (
              <button
                type="button"
                key={index}
                className={`aop-slot ${
                  item ? "filled" : ""
                }`}
                onClick={() => {
                  if (item) {
                    removeItem(index);
                  }
                }}
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={(event) => {
                  event.preventDefault();

                  const draggedItemId =
                    event.dataTransfer.getData(
                      "text/plain"
                    );

                  placeItem(draggedItemId, index);
                }}
              >
                <small>{index + 1}</small>

                {item ? (
                  <span
                    className="aop-slot-photo"
                    style={{ height: `${item.size}px` }}
                  >
                    <img
                      src={item.image}
                      alt="Object"
                      draggable="false"
                    />
                  </span>
                ) : (
                  <span className="aop-empty">
                    Drop here
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Clear answer */}

        <div className="aop-actions">
          <button
            type="button"
            className="aop-clear"
            onClick={resetQuestion}
          >
            Clear answer
          </button>
        </div>

        {/* Automatic feedback */}

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

      {/* Score */}

      <p className="aop-score">
        Correct answers: {score}
      </p>

    </main>
  );
}
