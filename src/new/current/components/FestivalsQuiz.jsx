
import React, { useEffect, useRef, useState } from "react";
import "./FestivalsQuiz.css";

const VERY_GOOD_SOUND = "/sounds/very-good.mp3";
const TRY_AGAIN_SOUND = "/sounds/try-again.mp3";

// =========================================
// LEVEL 1 - MULTIPLE CHOICE QUESTIONS
// =========================================

const questions = [
  {
    question: "Lights Festival ani emi festival ni pilustaru?",
    options: ["Holi", "Diwali", "Christmas", "Eid"],
    answer: "Diwali",
    explanation: "Diwali ni Festival of Lights ani pilustaru.",
  },
  {
    question: "December 25th roju manam emi festival celebrate chesukuntam?",
    options: ["Christmas", "Holi", "Eid", "Diwali"],
    answer: "Christmas",
    explanation: "December 25th roju manam Christmas celebrate chesukuntam.",
  },
  {
    question: "Colours Festival ani emi festival ni pilustaru?",
    options: ["Eid", "Diwali", "Holi", "Christmas"],
    answer: "Holi",
    explanation: "Holi ni Festival of Colours ani pilustaru.",
  },
  {
    question: "August 15th roju manam emi special day celebrate chesukuntam?",
    options: [
      "Republic Day",
      "Independence Day",
      "Teachers Day",
      "Children's Day",
    ],
    answer: "Independence Day",
    explanation:
      "August 15th roju manam Independence Day celebrate chesukuntam.",
  },
  {
    question: "January 26th roju emi day celebrate chesukuntam?",
    options: [
      "Gandhi Jayanthi",
      "Independence Day",
      "Republic Day",
      "Teachers Day",
    ],
    answer: "Republic Day",
    explanation:
      "January 26th roju manam Republic Day celebrate chesukuntam.",
  },
  {
    question: "Teachers ki thanks cheppadaniki emi day celebrate chestam?",
    options: [
      "Children's Day",
      "Teachers Day",
      "Sports Day",
      "Annual Day",
    ],
    answer: "Teachers Day",
    explanation:
      "Teachers ki respect and thanks cheppadaniki Teachers Day celebrate chestam.",
  },
  {
    question: "November 14th roju emi special day celebrate chestam?",
    options: [
      "Teachers Day",
      "Republic Day",
      "Children's Day",
      "Independence Day",
    ],
    answer: "Children's Day",
    explanation:
      "November 14th roju Children's Day celebrate chestam.",
  },
  {
    question: "October 2nd roju evari birthday ni gurthu chesukuntam?",
    options: [
      "Jawaharlal Nehru",
      "Mahatma Gandhi",
      "Dr. B. R. Ambedkar",
      "Subhas Chandra Bose",
    ],
    answer: "Mahatma Gandhi",
    explanation:
      "October 2nd roju Mahatma Gandhi birthday ni Gandhi Jayanthi ga celebrate chestam.",
  },
  {
    question: "Muslim friends celebrate chesukune important festival edi?",
    options: ["Diwali", "Christmas", "Eid", "Holi"],
    answer: "Eid",
    explanation: "Eid Muslim community ki mukhyamaina festival.",
  },
  {
    question: "Guru Nanak Dev Ji ni gurthu chesukune festival edi?",
    options: [
      "Christmas",
      "Guru Nanak Jayanthi",
      "Holi",
      "Diwali",
    ],
    answer: "Guru Nanak Jayanthi",
    explanation:
      "Guru Nanak Dev Ji birth anniversary ni Guru Nanak Jayanthi ga celebrate chestaru.",
  },
  {
    question: "Manam puttina roju ni emani pilustam?",
    options: ["Wedding Day", "Birthday", "Annual Day", "Sports Day"],
    answer: "Birthday",
    explanation: "Manam puttina roju ni Birthday ani pilustam.",
  },
  {
    question: "Pelli jariginappudu celebrate chesukune occasion edi?",
    options: [
      "Birthday",
      "Naming Ceremony",
      "Wedding",
      "Sports Day",
    ],
    answer: "Wedding",
    explanation:
      "Marriage jariginappudu family and friends kalisi Wedding celebrate chestaru.",
  },
  {
    question: "Baby ki peru pette function ni emani pilustaru?",
    options: [
      "Annual Day",
      "Naming Ceremony",
      "Birthday",
      "Wedding",
    ],
    answer: "Naming Ceremony",
    explanation:
      "Baby ki peru pette function ni Naming Ceremony ani pilustaru.",
  },
  {
    question: "School lo students performances unde special event edi?",
    options: [
      "Annual Day",
      "Eid",
      "Republic Day",
      "Birthday",
    ],
    answer: "Annual Day",
    explanation:
      "School students dances, songs and other performances Annual Day lo chestaru.",
  },
  {
    question: "School lo games and competitions unde event edi?",
    options: [
      "Teachers Day",
      "Sports Day",
      "Christmas",
      "Naming Ceremony",
    ],
    answer: "Sports Day",
    explanation:
      "Students games and sports competitions lo participate chese event Sports Day.",
  },
  {
    question: "India ki Independence e year lo vachindi?",
    options: ["1945", "1947", "1950", "1952"],
    answer: "1947",
    explanation:
      "India 1947 lo British rule nundi independence pondindi.",
  },
  {
    question: "Diwali appudu illalo em light chestaru?",
    options: ["Diyas", "Balloons", "Candles only", "Flags"],
    answer: "Diyas",
    explanation:
      "Diwali appudu chala mandi illalo diyas and lights veligistaru.",
  },
  {
    question: "Holi festival appudu manam em use chestam?",
    options: ["Flowers only", "Colours", "Diyas", "Flags"],
    answer: "Colours",
    explanation: "Holi appudu people colours tho celebrate chesukuntaru.",
  },
  {
    question: "Christmas appudu decorate chese tree edi?",
    options: [
      "Mango Tree",
      "Neem Tree",
      "Christmas Tree",
      "Banana Tree",
    ],
    answer: "Christmas Tree",
    explanation:
      "Christmas appudu Christmas Tree ni lights and decorations tho decorate chestaru.",
  },
  {
    question: "Teachers Day roju manam evariki respect and thanks cheptam?",
    options: ["Doctors", "Teachers", "Farmers", "Players"],
    answer: "Teachers",
    explanation:
      "Teachers manaki knowledge and guidance istaru. Anduke vallaki thanks cheptam.",
  },
];

// =========================================
// LEVEL 2 - MATCH THE DATE
// =========================================

const dateMatchingItems = [
  {
    id: "republic",
    date: "January 26",
    festival: "Republic Day",
  },
  {
    id: "independence",
    date: "August 15",
    festival: "Independence Day",
  },
  {
    id: "teachers",
    date: "September 5",
    festival: "Teachers' Day",
  },
  {
    id: "gandhi",
    date: "October 2",
    festival: "Gandhi Jayanthi",
  },
  {
    id: "children",
    date: "November 14",
    festival: "Children's Day",
  },
  {
    id: "christmas",
    date: "December 25",
    festival: "Christmas",
  },
];

// =========================================
// HELPER FUNCTION
// =========================================

const shuffleArray = (array) => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

// =========================================
// MAIN COMPONENT
// =========================================

function FestivalsQuiz({ onBack }) {
  const [selectedLevel, setSelectedLevel] = useState(null);

  // LEVEL 1 STATES
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // LEVEL 2 STATES
  const [selectedDate, setSelectedDate] = useState(null);
  const [matchedDates, setMatchedDates] = useState([]);
  const [shuffledFestivals, setShuffledFestivals] = useState([]);
  const [draggedFestivalId, setDraggedFestivalId] = useState(null);
  const [matchFeedback, setMatchFeedback] = useState("");
  const [matchScore, setMatchScore] = useState(0);
  const [showMatchResult, setShowMatchResult] = useState(false);
  const [isMatchAdvancing, setIsMatchAdvancing] = useState(false);

  const advanceTimer = useRef(null);

  const question = questions[currentQuestion];

  // Clear pending timer when component unmounts.
  useEffect(() => {
    return () => {
      if (advanceTimer.current) {
        clearTimeout(advanceTimer.current);
      }
    };
  }, []);

  // =========================================
  // SOUND FUNCTION
  // =========================================

  const playSound = (soundPath) => {
    const audio = new Audio(soundPath);

    audio.play().catch((error) => {
      console.warn("Unable to play quiz sound:", error);
    });
  };

  // =========================================
  // LEVEL SELECTION
  // =========================================

  const startLevel1 = () => {
    setSelectedLevel(1);
    setStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setFeedback("");
    setIsAdvancing(false);
    setShowResult(false);
  };

  const startLevel2 = () => {
    setSelectedLevel(2);
    setSelectedDate(null);
    setMatchedDates([]);
    setMatchScore(0);
    setMatchFeedback("");
    setShuffledFestivals(shuffleArray(dateMatchingItems));
    setDraggedFestivalId(null);
    setShowMatchResult(false);
    setIsMatchAdvancing(false);
  };

  const backToLevels = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }

    setSelectedLevel(null);
    setStarted(false);
    setShowResult(false);
    setShowMatchResult(false);
    setIsAdvancing(false);
    setIsMatchAdvancing(false);
  };

  // =========================================
  // LEVEL 1 FUNCTIONS
  // =========================================

  const moveToNextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      setShowResult(true);
      setIsAdvancing(false);
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
    setFeedback("");
    setIsAdvancing(false);
  };

  const handleAnswer = (selectedOption) => {
    if (isAdvancing || showResult) return;

    if (selectedOption === question.answer) {
      playSound(VERY_GOOD_SOUND);

      setScore((previous) => previous + 1);
      setFeedback("Very good! Correct answer!");
      setIsAdvancing(true);

      advanceTimer.current = setTimeout(() => {
        moveToNextQuestion();
      }, 1200);
    } else {
      playSound(TRY_AGAIN_SOUND);
      setFeedback("Try again! Vere option select cheyyi.");
    }
  };

  const handlePlayAgain = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }

    setCurrentQuestion(0);
    setScore(0);
    setFeedback("");
    setIsAdvancing(false);
    setShowResult(false);
    setStarted(true);
  };

  // =========================================
  // LEVEL 2 - DATE MATCHING FUNCTIONS
  // =========================================

  // Keep the dates fixed on the left and let the child arrange the
  // shuffled festival names in the matching rows on the right.
  const updateFestivalArrangement = (festivalId, targetDateId) => {
    if (isMatchAdvancing || showMatchResult) return;

    const sourceIndex = shuffledFestivals.findIndex(
      (festival) => festival.id === festivalId
    );
    const targetIndex = dateMatchingItems.findIndex(
      (date) => date.id === targetDateId
    );

    if (sourceIndex < 0 || targetIndex < 0) return;

    const updatedOrder = [...shuffledFestivals];
    const [chosenFestival] = updatedOrder.splice(sourceIndex, 1);
    updatedOrder.splice(targetIndex, 0, chosenFestival);

    // If the item came from before the target row, the remove/insert
    // operation above shifts the positions correctly. Rebuild matches.
    setShuffledFestivals(updatedOrder);
    const correctIds = dateMatchingItems
      .filter((date, index) => updatedOrder[index]?.id === date.id)
      .map((date) => date.id);

    const newlyCorrect = correctIds.length > matchedDates.length;
    setMatchedDates(correctIds);
    setMatchScore(correctIds.length);
    setSelectedDate(null);

    if (updatedOrder[targetIndex]?.id === targetDateId) {
      playSound(VERY_GOOD_SOUND);
      setMatchFeedback("Very good! Correct arrangement!");
    } else {
      playSound(TRY_AGAIN_SOUND);
      setMatchFeedback("Keep trying! Arrange the festival beside its correct date.");
    }

    if (correctIds.length === dateMatchingItems.length) {
      setIsMatchAdvancing(true);
      advanceTimer.current = setTimeout(() => {
        setShowMatchResult(true);
        setIsMatchAdvancing(false);
      }, 1200);
    } else if (!newlyCorrect && correctIds.length < matchedDates.length) {
      setMatchFeedback("Keep trying! Arrange the festival beside its correct date.");
    }
  };

  const handleDateClick = (item) => {
    if (isMatchAdvancing || showMatchResult) return;
    setSelectedDate((previous) => previous?.id === item.id ? null : item);
    setMatchFeedback("");
  };

  const handleFestivalClick = (item) => {
    if (isMatchAdvancing || showMatchResult) return;
    if (!selectedDate) {
      setMatchFeedback("First select a date, then select a festival name.");
      return;
    }
    updateFestivalArrangement(item.id, selectedDate.id);
  };

  const handleFestivalDragStart = (event, item) => {
    if (isMatchAdvancing || showMatchResult) {
      event.preventDefault();
      return;
    }
    setDraggedFestivalId(item.id);
    event.dataTransfer.setData("text/plain", item.id);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDateDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDateDrop = (event, dateItem) => {
    event.preventDefault();
    const festivalId = event.dataTransfer.getData("text/plain") || draggedFestivalId;
    if (!festivalId) return;
    updateFestivalArrangement(festivalId, dateItem.id);
    setDraggedFestivalId(null);
  };

  const handleMatchingPlayAgain = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    setSelectedDate(null);
    setMatchedDates([]);
    setMatchScore(0);
    setMatchFeedback("");
    setShuffledFestivals(shuffleArray(dateMatchingItems));
    setDraggedFestivalId(null);
    setShowMatchResult(false);
    setIsMatchAdvancing(false);
  };

  // =========================================
  // LEVEL SELECTION SCREEN
  // =========================================

  if (!selectedLevel) {
    return (
      <div className="festivals-quiz-container">
        <div className="quiz-level-selection">
          <button
            className="quiz-back-button"
            onClick={onBack}
            type="button"
          >
            ← BACK
          </button>

          <h1>Festivals Quiz</h1>

          <p className="quiz-level-subtitle">
            Choose your level and start learning!
          </p>

          <div className="quiz-level-cards">
            <button
              className="quiz-level-card level-one-card"
              onClick={startLevel1}
              type="button"
            >
              <span className="quiz-level-number">LEVEL 1</span>
              <span className="quiz-level-icon">📝</span>
              <span className="quiz-level-name">
                Multiple Choice
              </span>
              <span className="quiz-level-description">
                Read the question and select the correct answer.
              </span>
              <span className="quiz-level-start">
                Start Level 1 →
              </span>
            </button>

            <button
              className="quiz-level-card level-two-card"
              onClick={startLevel2}
              type="button"
            >
              <span className="quiz-level-number">LEVEL 2</span>
              <span className="quiz-level-icon">📅</span>
              <span className="quiz-level-name">
                Match the Following
              </span>
              <span className="quiz-level-description">
                Match each date with its correct festival or special day.
              </span>
              <span className="quiz-level-start">
                Start Level 2 →
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // LEVEL 1 INTRO SCREEN
  // =========================================

  if (selectedLevel === 1 && !started) {
    return (
      <div className="festivals-quiz-container">
        <div className="quiz-intro-card">
          <button
            className="quiz-back-button"
            onClick={backToLevels}
            type="button"
          >
            ← BACK TO LEVELS
          </button>

          <h1>Festivals Quiz</h1>
          <h2>Level 1 - Multiple Choice</h2>

          <p>
            Festivals gurinchi questions answer cheyyandi.
            Correct answer select chese varaku try cheyyandi!
          </p>

          <p>Total Questions: {questions.length}</p>

          <button
            className="quiz-start-button"
            onClick={() => setStarted(true)}
            type="button"
          >
            Start Level 1
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // LEVEL 1 RESULT SCREEN
  // =========================================

  if (selectedLevel === 1 && showResult) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    return (
      <div className="festivals-quiz-container">
        <div className="quiz-result-card">
          <h1>Level 1 Completed!</h1>
          <h2>Your Score</h2>

          <div className="quiz-final-score">
            {score} / {questions.length}
          </div>

          <p>You got {percentage}% correct answers.</p>

          <h3>
            {percentage === 100
              ? "Excellent! Chala baaga chesavu!"
              : percentage >= 70
              ? "Very good! Keep learning!"
              : percentage >= 40
              ? "Good try! Inka practice cheyyi!"
              : "Keep practicing! You can do it!"}
          </h3>

          <button
            className="quiz-start-button"
            onClick={handlePlayAgain}
            type="button"
          >
            Play Again
          </button>

          <button
            className="quiz-back-button"
            onClick={backToLevels}
            type="button"
          >
            ← Choose Level
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // LEVEL 1 QUESTION SCREEN
  // =========================================

  if (selectedLevel === 1 && started) {
    return (
      <div className="festivals-quiz-container">
        <div className="quiz-card">
          <div className="quiz-top-bar">
            <button
              className="quiz-back-button"
              onClick={backToLevels}
              type="button"
            >
              ← BACK
            </button>

            <h2>Festivals Quiz - Level 1</h2>
          </div>

          <div className="quiz-progress-section">
            <div className="quiz-progress-info">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>Score: {score}</span>
            </div>

            <div className="quiz-progress-bar">
              <div
                className="quiz-progress-fill"
                style={{
                  width: `${
                    ((currentQuestion + 1) / questions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="quiz-question-section">
            <h2>{question.question}</h2>
            <p className="quiz-instruction">
              Correct answer select cheyyandi!
            </p>
          </div>

          <div className="quiz-options-grid">
            {question.options.map((option, index) => (
              <button
                key={`${currentQuestion}-${option}`}
                className="quiz-option-button"
                onClick={() => handleAnswer(option)}
                type="button"
                disabled={isAdvancing}
              >
                <span className="quiz-option-letter">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span>{option}</span>
              </button>
            ))}
          </div>

          {feedback && (
            <div
              className={`quiz-feedback ${
                isAdvancing ? "correct-feedback" : "wrong-feedback"
              }`}
              role="status"
              aria-live="polite"
            >
              {feedback}
            </div>
          )}

          {isAdvancing && (
            <div className="quiz-explanation">
              {question.explanation}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================
  // LEVEL 2 RESULT SCREEN
  // =========================================

  if (selectedLevel === 2 && showMatchResult) {
    const percentage = Math.round(
      (matchScore / dateMatchingItems.length) * 100
    );

    return (
      <div className="festivals-quiz-container">
        <div className="quiz-result-card">
          <h1>Level 2 - Date Matching Completed!</h1>
          <h2>Your Score</h2>

          <div className="quiz-final-score">
            {matchScore} / {dateMatchingItems.length}
          </div>

          <p>You matched {matchScore} out of 6 dates correctly.</p>

          <h3>
            {percentage === 100
              ? "Excellent! All dates matched correctly!"
              : "Very good! Keep practicing!"}
          </h3>

          <p>
            Picture matching will be added in the next part.
          </p>

          <button
            className="quiz-start-button"
            onClick={handleMatchingPlayAgain}
            type="button"
          >
            Play Again
          </button>

          <button
            className="quiz-back-button"
            onClick={backToLevels}
            type="button"
          >
            ← Choose Level
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // LEVEL 2 - SIDE-BY-SIDE DATE ARRANGEMENT
  // =========================================

  if (selectedLevel === 2) {
    const progress = Math.round((matchedDates.length / dateMatchingItems.length) * 100);

    return (
      <div className="festivals-quiz-container">
        <div className="quiz-card matching-quiz-card">
          <style>{`
            .date-arrange-board { display: grid; grid-template-columns: minmax(145px, 0.9fr) minmax(190px, 1.2fr); gap: 14px; margin-top: 18px; }
            .date-arrange-column { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
            .date-arrange-heading { min-height: 38px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #49356f; }
            .date-arrange-date, .date-arrange-festival { min-height: 58px; width: 100%; box-sizing: border-box; border: 2px solid #d8d3ee; border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; gap: 9px; background: #fff; color: #30264b; font: inherit; text-align: left; }
            .date-arrange-date { cursor: pointer; font-weight: 700; }
            .date-arrange-date.is-selected { border-color: #7654c8; background: #f1ecff; box-shadow: 0 0 0 2px rgba(118,84,200,.12); }
            .date-arrange-festival { justify-content: space-between; background: #f5f1ff; border-color: #c9bce9; cursor: grab; font-weight: 650; }
            .date-arrange-festival:active { cursor: grabbing; }
            .date-arrange-festival.is-correct, .date-arrange-date.is-correct { border-color: #35a66a; background: #eaf8ef; color: #17643a; }
            .date-arrange-festival.is-dragging { opacity: .45; }
            .date-arrange-festival .drag-handle { color: #806bb0; font-size: 20px; line-height: 1; }
            .date-arrange-help { margin: 10px 0; color: #625b70; }
            @media (max-width: 560px) { .date-arrange-board { grid-template-columns: minmax(110px, .85fr) minmax(155px, 1.15fr); gap: 8px; } .date-arrange-date, .date-arrange-festival { min-height: 54px; padding: 8px; font-size: 13px; } }
          `}</style>

          <div className="quiz-top-bar">
            <button className="quiz-back-button" onClick={backToLevels} type="button">
              ← BACK
            </button>
            <h2>Festivals Quiz - Level 2</h2>
          </div>

          <div className="matching-round-heading">
            <h2>Arrange the Festivals by Date</h2>
            <p>Dates are on the left. Arrange the festival names on the right in the correct order.</p>
          </div>

          <div className="quiz-progress-section">
            <div className="quiz-progress-info">
              <span>Correctly arranged: {matchedDates.length} / {dateMatchingItems.length}</span>
              <span>Score: {matchScore}</span>
            </div>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <p className="date-arrange-help"><strong>How to play:</strong> Drag a festival name up or down on the right to place it beside the correct date. You can also select a date on the left and click a festival on the right.</p>

          <div className="date-arrange-board">
            <div className="date-arrange-column">
              <div className="date-arrange-heading">Dates</div>
              {dateMatchingItems.map((item, index) => {
                const isSelected = selectedDate?.id === item.id;
                const isCorrect = matchedDates.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`date-arrange-date ${isSelected ? "is-selected" : ""} ${isCorrect ? "is-correct" : ""}`}
                    onClick={() => handleDateClick(item)}
                    disabled={isMatchAdvancing || showMatchResult}
                    aria-pressed={isSelected}
                  >
                    <span>{index + 1}.</span>
                    <span>{item.date}</span>
                    {isCorrect && <span aria-label="correct">✓</span>}
                  </button>
                );
              })}
            </div>

            <div className="date-arrange-column">
              <div className="date-arrange-heading">Festival Names — Drag to Arrange</div>
              {shuffledFestivals.map((item, index) => {
                const isCorrect = dateMatchingItems[index]?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`date-arrange-festival ${isCorrect ? "is-correct" : ""} ${draggedFestivalId === item.id ? "is-dragging" : ""}`}
                    draggable={!isMatchAdvancing && !showMatchResult}
                    onDragStart={(event) => handleFestivalDragStart(event, item)}
                    onDragOver={handleDateDragOver}
                    onDrop={(event) => handleDateDrop(event, dateMatchingItems[index])}
                    onClick={() => handleFestivalClick(item)}
                    disabled={isMatchAdvancing || showMatchResult}
                    aria-label={`Move ${item.festival} to its matching date`}
                  >
                    <span>{String.fromCharCode(65 + index)}. {item.festival}</span>
                    <span className="drag-handle" aria-hidden="true">⠿</span>
                    {isCorrect && <span aria-label="correct">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {matchFeedback && (
            <div
              className={`quiz-feedback ${matchFeedback.startsWith("Very good") ? "correct-feedback" : "wrong-feedback"}`}
              role="status"
              aria-live="polite"
            >
              {matchFeedback}
            </div>
          )}

          {isMatchAdvancing && (
            <div className="quiz-explanation">Excellent! All festivals are in the correct date order!</div>
          )}

          <div className="matching-total-score">Total Correct Positions: {matchScore} / 6</div>
        </div>
      </div>
    );
  }

  return null;
}

export default FestivalsQuiz;
