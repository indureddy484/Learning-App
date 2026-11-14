

import { useEffect, useRef, useState } from "react";



import "./PictureAscendingOrder.css";

import "./PictureAscendingOrderLevel2.css";



const TIMER_OPTIONS = [1, 2, 5, 10, 20];



// LEVEL 1: Four different picture sizes.

const SIZE_VALUES = [60, 105, 155, 205];



// LEVEL 2: Four relative image sizes.

// const LEVEL2_SIZE_VALUES = [30, 50, 72, 94];

// const LEVEL2_SIZE_VALUES = [25, 40, 60, 85];
const LEVEL2_SIZE_VALUES = [50, 75, 105, 140];



// Automatically discover images using Webpack.

// Component: src/new/current/components/

// Images: src/assets/images/ascending/



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



// Shuffle array.

const shuffle = (array) => {

  const result = [...array];



  for (let i = result.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];

  }



  return result;

};



// Create random image deck.

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



// Format timer.

const formatTime = (seconds) => {

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;



  return `${String(minutes).padStart(2, "0")}:${String(

    remainingSeconds

  ).padStart(2, "0")}`;

};



// ======================================================

// SHARED IMAGE COMPONENT

// ======================================================



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



// ======================================================

// LEVEL 1 QUESTION GENERATOR

// ======================================================



const generateQuestion = (questionNumber, imagePath) => {

  const object = {

    name: "picture",

    image: "🖼️",

    photo: imagePath,

  };



  const questionType =

    Math.random() < 0.5 ? "smallest" : "largest";



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



// ======================================================

// LEVEL 2 QUESTION GENERATOR

// ======================================================



const generateLevel2Question = (questionNumber, imagePath) => {

  const direction =

    Math.random() < 0.5 ? "ascending" : "descending";



  // Randomly display the four sizes.

  const shuffledSizes = shuffle([0, 1, 2, 3]);



  const options = shuffledSizes.map((sizeIndex, index) => ({

    id: `${questionNumber}-L2-${index}`,

    sizeIndex,

    size: LEVEL2_SIZE_VALUES[sizeIndex],

    imagePath,

  }));



  // Calculate correct order.

  const correctOrder = [...options]

    .sort((a, b) =>

      direction === "ascending"

        ? a.sizeIndex - b.sizeIndex

        : b.sizeIndex - a.sizeIndex

    )

    .map((option) => option.id);



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

    correctOrder,

  };

};



// ======================================================

// LEVEL 2 IMAGE COMPONENT

// ======================================================



function Level2Photo({ imagePath, size, compact = false }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imagePath]);

  return (
    <div className={`level2-photo-stage ${compact ? "compact" : ""}`}>
      {imageFailed ? (
        <span className="level2-photo-fallback">🖼️</span>
      ) : (
        <img
          src={imagePath}
          alt="Picture"
          className="level2-photo"
          style={{
            height: compact ? `${size * 0.5}px` : `${size}px`,
            width: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  );
}



// ======================================================

// LEVEL 2 COMPONENT

// ======================================================



function PictureAscendingLevel2({ onBack, onExit }) {

  const [selectedDuration, setSelectedDuration] = useState(2);



  const [quizStarted, setQuizStarted] = useState(false);

  const [quizCompleted, setQuizCompleted] = useState(false);

  const [endReason, setEndReason] = useState(null);



  const [timeLeft, setTimeLeft] = useState(120);

  const [questionNumber, setQuestionNumber] = useState(1);

  const [question, setQuestion] = useState(null);



  const [selectedOrder, setSelectedOrder] = useState([]);

  const [history, setHistory] = useState([]);



  const imageDeckRef = useRef([]);

  const previousImageRef = useRef(null);

  const advanceTimeoutRef = useRef(null);



  // Get next image without repeating until all are used.

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

      if (advanceTimeoutRef.current) {

        clearTimeout(advanceTimeoutRef.current);

        advanceTimeoutRef.current = null;

      }



      setEndReason("timeout");

      setQuizCompleted(true);

    }

  }, [quizStarted, timeLeft, quizCompleted]);



  // Clear pending transition when component unmounts.

  useEffect(() => {

    return () => {

      if (advanceTimeoutRef.current) {

        clearTimeout(advanceTimeoutRef.current);

      }

    };

  }, []);



  // Start Level 2.

  const startQuiz = () => {

    if (ALL_IMAGES.length === 0) return;



    if (advanceTimeoutRef.current) {

      clearTimeout(advanceTimeoutRef.current);

    }



    imageDeckRef.current = createImageDeck(ALL_IMAGES);

    previousImageRef.current = null;



    const firstImage = getNextImage();



    setQuestionNumber(1);

    setQuestion(generateLevel2Question(1, firstImage));

    setSelectedOrder([]);

    setHistory([]);

    setTimeLeft(selectedDuration * 60);

    setEndReason(null);

    setQuizCompleted(false);

    setQuizStarted(true);

  };



  // Select picture and arrange it.

  const selectPicture = (option) => {

    if (

      !question ||

      quizCompleted ||

      timeLeft <= 0 ||

      selectedOrder.length >= 4 ||

      selectedOrder.includes(option.id)

    ) {

      return;

    }



    const updatedOrder = [...selectedOrder, option.id];



    setSelectedOrder(updatedOrder);



    // Once four pictures are selected, evaluate silently.

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

        status: isCorrect ? "Correct" : "Wrong",

      };



      setHistory((previous) => [...previous, record]);



      // No correct/wrong feedback is revealed.

      advanceTimeoutRef.current = setTimeout(() => {

        if (timeLeft <= 0) return;



        const nextNumber = questionNumber + 1;

        const nextImage = getNextImage();



        setQuestionNumber(nextNumber);

        setQuestion(

          generateLevel2Question(nextNumber, nextImage)

        );

        setSelectedOrder([]);

        advanceTimeoutRef.current = null;

      }, 700);

    }

  };



  // Undo last selected picture.

  const undoLastSelection = () => {

    if (

      selectedOrder.length === 0 ||

      selectedOrder.length === 4 ||

      quizCompleted

    ) {

      return;

    }



    setSelectedOrder((previous) => previous.slice(0, -1));

  };



  // End test.

  const endTest = () => {

    if (!quizStarted || quizCompleted) return;



    if (advanceTimeoutRef.current) {

      clearTimeout(advanceTimeoutRef.current);

      advanceTimeoutRef.current = null;

    }



    setEndReason("manual");

    setQuizCompleted(true);

  };



  // Restart.

  const restartQuiz = () => {

    if (advanceTimeoutRef.current) {

      clearTimeout(advanceTimeoutRef.current);

      advanceTimeoutRef.current = null;

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



  // Include unfinished current question in final analysis.

  const currentQuestionAlreadyRecorded =
    question &&
    history.some(
      (item) => item.questionNumber === question.questionNumber
    );

  const finalHistory =
    quizCompleted && question && !currentQuestionAlreadyRecorded
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



  // Level 2 setup screen.

 // Level 2 setup screen
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
            : "No photographs found. Check your images folder."}
        </p>

        {/* LEVEL DROPDOWN */}
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
            value="level2"
            onChange={(event) => {
              if (event.target.value === "level1") {
                onBack();
              }
            }}
          >
            <option value="level1">
              Level 1 – Smallest and Largest
            </option>

            <option value="level2">
              Level 2 – Arrange Pictures in Order
            </option>

            <option value="level3" disabled>
              Level 3 – Picture Size Sequences (Coming Soon)
            </option>
          </select>

        </div>

        {/* TIME SELECTION */}
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

        {/* START BUTTON */}
        <button
          className="picture-primary-button setup-start-button"
          onClick={startQuiz}
          type="button"
          disabled={ALL_IMAGES.length === 0}
        >
          ▶ Start Quiz
        </button>

      </section>
    </main>
  );
}


  // Level 2 result screen.

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

              .map((id) =>

                item.options.find((option) => option.id === id)

              )

              .filter(Boolean);



            const correctOptions = item.correctOrder

              .map((id) =>

                item.options.find((option) => option.id === id)

              )

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



          <button

            className="picture-secondary-button no-print"

            onClick={onExit}

            type="button"

          >

            Back to Number Sense

          </button>

        </section>

      </main>

    );

  }



  // Current selected pictures.

  const selectedOptions = selectedOrder

    .map((id) =>

      question.options.find((option) => option.id === id)

    )

    .filter(Boolean);



  // Level 2 quiz screen.

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

                  disabled={

                    isSelected ||

                    selectedOrder.length === 4 ||

                    timeLeft === 0

                  }

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

            disabled={

              selectedOrder.length === 0 ||

              selectedOrder.length === 4

            }

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



// ======================================================

// MAIN PICTURE ASCENDING ORDER COMPONENT

// ======================================================



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



  const imageDeckRef = useRef([]);

  const previousImageRef = useRef(null);



  // Get next image for Level 1.

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



  // Start Level 1.

  const startQuiz = () => {

    if (selectedLevel !== "level1" || ALL_IMAGES.length === 0) {

      return;

    }



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



  // End Level 1 manually.

  const endTest = () => {

    if (!quizStarted || quizCompleted) return;



    setEndReason("manual");

    setQuizCompleted(true);

  };



  // Final history for Level 1.

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



  // Submit Level 1 answer.

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



  // Restart Level 1.

  const restartQuiz = () => {

    setQuizStarted(false);

    setQuizCompleted(false);

    setEndReason(null);

    setQuestionNumber(1);

    setQuestion(null);

    setSelectedAnswer(null);

    setHistory([]);

    setTimeLeft(selectedDuration * 60);



    imageDeckRef.current = [];

    previousImageRef.current = null;

  };



  // Level 1 results.

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



  // Open Level 2.

  if (selectedLevel === "level2") {

    return (

      <PictureAscendingLevel2

        onBack={() => setSelectedLevel("level1")}

        onExit={onBack}

      />

    );

  }



  // Setup screen.

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



              <option value="level2">

                Level 2 – Arrange Pictures in Order

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



  // Level 1 result screen.

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



  // Level 1 quiz screen.

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
