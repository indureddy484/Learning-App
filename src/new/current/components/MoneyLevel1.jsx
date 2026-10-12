
import { useState, useRef, useEffect } from "react";
import "./MoneyLevel1.css";

const NOTE_IMAGES = {
  10: "/money-notes/ten-rupee-note.png",
  20: "/money-notes/20-rupee-note.png",
  50: "/money-notes/50-rupee-note.png",
};

const DENOMINATIONS = [10, 20, 50];

function createQuestions(denomination) {
  // Two notes through ten notes.
  return Array.from({ length: 9 }, (_, index) => {
    const count = index + 2;

    return {
      count,
      answer: count * denomination,
    };
  });
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createOptions(answer, denomination) {
  const choices = [];

  for (let count = 2; count <= 10; count++) {
    const amount = count * denomination;

    if (amount !== answer) {
      choices.push(amount);
    }
  }

  return shuffle([
    answer,
    ...shuffle(choices).slice(0, 3),
  ]);
}

function MoneyLevel1({ onBack }) {
  const [denomination, setDenomination] = useState(10);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(false);

  const [questions, setQuestions] = useState(() =>
    createQuestions(10)
  );

  const [optionsByQuestion, setOptionsByQuestion] = useState(() =>
    createQuestions(10).map((question) =>
      createOptions(question.answer, 10)
    )
  );

  const successAudio = useRef(null);
  const failAudio = useRef(null);
  const veryGoodAudio = useRef(null);
  const tryAgainAudio = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const question = questions[questionIndex];

  const playAudio = (audioRef) => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  const schedule = (callback, delay) => {
    const timer = setTimeout(callback, delay);
    timers.current.push(timer);
  };

  const changeDenomination = (value) => {
    const newDenomination = Number(value);

    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];

    const newQuestions = createQuestions(newDenomination);

    setDenomination(newDenomination);
    setQuestions(newQuestions);

    setOptionsByQuestion(
      newQuestions.map((item) =>
        createOptions(item.answer, newDenomination)
      )
    );

    setQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setIsCorrect(false);
    setFinished(false);
  };

  const moveToNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      setSelectedAnswer(null);
      setFeedback("");
      setIsCorrect(false);
    } else {
      setFinished(true);
    }
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null || finished) return;

    setSelectedAnswer(answer);

    if (answer === question.answer) {
      setIsCorrect(true);
      setFeedback("Very Good! 🎉");

      playAudio(successAudio);

      schedule(() => {
        playAudio(veryGoodAudio);

        schedule(() => {
          moveToNextQuestion();
        }, 900);
      }, 700);
    } else {
      setIsCorrect(false);
      setFeedback("Try Again!");

      playAudio(failAudio);

      schedule(() => {
        playAudio(tryAgainAudio);

        schedule(() => {
          setSelectedAnswer(null);
          setFeedback("");
        }, 900);
      }, 700);
    }
  };

  const restartGame = () => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];

    const newQuestions = createQuestions(denomination);

    setQuestions(newQuestions);

    setOptionsByQuestion(
      newQuestions.map((item) =>
        createOptions(item.answer, denomination)
      )
    );

    setQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setIsCorrect(false);
    setFinished(false);
  };

  if (!question) return null;

  return (
    <div className="money-level-screen">
      <audio
        ref={successAudio}
        src="/sounds/success-1-6297.mp3"
        preload="auto"
      />

      <audio
        ref={failAudio}
        src="/sounds/fail-2-2777575.mp3"
        preload="auto"
      />

      <audio
        ref={veryGoodAudio}
        src="/sounds/very-good.mp3"
        preload="auto"
      />

      <audio
        ref={tryAgainAudio}
        src="/sounds/try-again.mp3"
        preload="auto"
      />

      <button
        className="money-back-button"
        onClick={onBack}
        type="button"
      >
        ← BACK
      </button>

      <div className="money-toolbar">
        <label htmlFor="money-denomination">
          Select Note:
        </label>

        <select
          id="money-denomination"
          className="money-denomination-select"
          value={denomination}
          onChange={(event) =>
            changeDenomination(event.target.value)
          }
        >
          {DENOMINATIONS.map((value) => (
            <option key={value} value={value}>
              ₹{value} note
            </option>
          ))}
        </select>
      </div>

      <div className="money-question-card">
        {finished ? (
          <div className="money-complete-card">
            <div className="money-complete-icon">🏆</div>

            <h2>Level Completed!</h2>

            <p>
              Excellent work! You completed the ₹{denomination}
              note addition game.
            </p>

            <button
              className="money-action-button"
              onClick={restartGame}
              type="button"
            >
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div className="money-addition">
              {Array.from(
                { length: question.count },
                (_, index) => (
                  <span
                    className="money-note-item"
                    key={index}
                  >
                    <img
                      src={NOTE_IMAGES[denomination]}
                      alt={`₹${denomination} note`}
                      className="money-note-inline"
                    />

                    {index < question.count - 1 && (
                      <span className="money-plus-sign">
                        +
                      </span>
                    )}
                  </span>
                )
              )}

              <span className="money-equals">
                = ______
              </span>
            </div>

            <div className="money-options">
              {optionsByQuestion[questionIndex].map((option) => {
                let buttonClass = "money-option-button";

                if (selectedAnswer === option) {
                  buttonClass +=
                    option === question.answer
                      ? " money-correct"
                      : " money-wrong";
                }

                return (
                  <button
                    key={option}
                    type="button"
                    className={buttonClass}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    ₹{option}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div
                className={`money-feedback ${
                  isCorrect
                    ? "money-feedback-correct"
                    : "money-feedback-wrong"
                }`}
              >
                {feedback}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MoneyLevel1;
