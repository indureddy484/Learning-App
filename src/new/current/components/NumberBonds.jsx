
import React, { useState, useEffect, useRef } from "react";
import NumberBondsQuiz from "./NumberBondsQuiz";
import "./NumberBonds.css";

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function generateQuestionPool(maxNumber) {
  const zeroQuestions = [];
  const normalQuestions = [];

  for (let total = 0; total <= maxNumber; total++) {
    for (let first = 0; first <= total; first++) {
      const second = total - first;

      const firstQuestion = {
        first: null,
        second,
        total,
        blankPosition: "first",
        answer: first,
        hasZero: first === 0 || second === 0,
      };

      const secondQuestion = {
        first,
        second: null,
        total,
        blankPosition: "second",
        answer: second,
        hasZero: first === 0 || second === 0,
      };

      if (firstQuestion.hasZero) {
        zeroQuestions.push(firstQuestion);
        zeroQuestions.push(secondQuestion);
      } else {
        normalQuestions.push(firstQuestion);
        normalQuestions.push(secondQuestion);
      }
    }
  }

  const shuffledZero = shuffleArray(zeroQuestions);
  const shuffledNormal = shuffleArray(normalQuestions);

  const mixedQuestions = [];
  let zeroIndex = 0;
  let normalIndex = 0;
  let count = 0;

  while (
    zeroIndex < shuffledZero.length ||
    normalIndex < shuffledNormal.length
  ) {
    if (
      (count % 6 === 5 || normalIndex >= shuffledNormal.length) &&
      zeroIndex < shuffledZero.length
    ) {
      mixedQuestions.push(shuffledZero[zeroIndex++]);
    } else if (normalIndex < shuffledNormal.length) {
      mixedQuestions.push(shuffledNormal[normalIndex++]);
    } else {
      mixedQuestions.push(shuffledZero[zeroIndex++]);
    }

    count++;
  }

  return mixedQuestions;
}

function generateOptions(answer, maxNumber) {
  const possibleOptions = [];

  for (let number = 0; number <= maxNumber; number++) {
    if (number !== answer) {
      possibleOptions.push(number);
    }
  }

  const wrongAnswers = shuffleArray(possibleOptions).slice(0, 3);

  return shuffleArray([answer, ...wrongAnswers]);
}

function prepareQuestion(question, maxNumber) {
  return {
    ...question,
    options: generateOptions(question.answer, maxNumber),
  };
}

function NumberBonds({ onBack }) {
  const [level, setLevel] = useState("");
  const [question, setQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionPool, setQuestionPool] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (showQuiz) {
    return (
      <NumberBondsQuiz
        onBack={() => setShowQuiz(false)}
      />
    );
  }

  const startPractice = (value) => {
    const maxNumber = Number(value);
    const newPool = generateQuestionPool(maxNumber);

    setLevel(value);
    setQuestion(prepareQuestion(newPool[0], maxNumber));
    setQuestionPool(newPool.slice(1));
    setQuestionCount(1);
    setFeedback("");
    setSelectedOption(null);
  };

  const getNextQuestion = () => {
    let remainingQuestions = [...questionPool];

    if (remainingQuestions.length === 0) {
      remainingQuestions = generateQuestionPool(Number(level));
    }

    const nextQuestion = remainingQuestions[0];

    setQuestionPool(remainingQuestions.slice(1));
    setQuestion(
      prepareQuestion(nextQuestion, Number(level))
    );

    setQuestionCount((previous) => previous + 1);
    setFeedback("");
    setSelectedOption(null);
  };

  const handleAnswer = (option) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);

    if (option === question.answer) {
      setFeedback("Correct! 🎉");

      timerRef.current = setTimeout(() => {
        getNextQuestion();
      }, 650);
    } else {
      setFeedback("Try Again!");

      timerRef.current = setTimeout(() => {
        setFeedback("");
        setSelectedOption(null);
      }, 900);
    }
  };

  const exitPractice = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setLevel("");
    setQuestion(null);
    setQuestionCount(1);
    setFeedback("");
    setSelectedOption(null);
    setQuestionPool([]);
  };

  return (
    <div className="nb-page">

      <button
        className="nb-back-button"
        type="button"
        onClick={() => {
          if (level) {
            exitPractice();
          } else {
            onBack();
          }
        }}
      >
        ← BACK
      </button>

      {!level && (
        <div className="nb-selection-screen">
          <div className="nb-eyebrow">MENTAL MATH</div>

          <h1>Number Bonds</h1>

          <p className="nb-selection-subtitle">
            Choose your level to start practising
          </p>

          <div className="nb-selection-card">
            <div className="nb-selection-icon">🔢</div>

            <label htmlFor="nb-level">
              Select Level
            </label>

            <select
              id="nb-level"
              className="nb-level-select"
              value={level}
              onChange={(event) => startPractice(event.target.value)}
            >
              <option value="">Choose a level</option>
              <option value="5">Up to 5</option>
              <option value="10">Up to 10</option>
            </select>
          </div>
        </div>
      )}

      {level && question && (
        <>
          <header className="nb-practice-topbar">
            <div className="nb-practice-heading">
              <div className="nb-eyebrow">MENTAL MATH</div>
              <h1>Number Bonds Practice</h1>
              <p>
                Find the missing number and choose the correct answer.
              </p>
            </div>

            <button
              className="nb-quiz-button"
              type="button"
              onClick={() => {
                if (timerRef.current) {
                  clearTimeout(timerRef.current);
                }

                setShowQuiz(true);
              }}
            >
              📝 Quiz
            </button>
          </header>

          <main className="nb-practice-panel">
            <div className="nb-panel-top">
              <span>Practice Question {questionCount}</span>
              <span>Up to {level} · No timer</span>
            </div>

            <div className="nb-equation-card">
              {question.blankPosition === "first" ? (
                <>
                  <span className="nb-missing">?</span>
                  <span className="nb-operator">+</span>
                  <span>{question.second}</span>
                </>
              ) : (
                <>
                  <span>{question.first}</span>
                  <span className="nb-operator">+</span>
                  <span className="nb-missing">?</span>
                </>
              )}

              <span className="nb-operator">=</span>
              <span>{question.total}</span>
            </div>

            <p className="nb-instruction">
              Select the correct answer.
            </p>

            <div className="nb-options-grid">
              {question.options.map((option, index) => {
                const letter = ["A", "B", "C", "D"][index];

                let optionClass = "nb-option";

                if (selectedOption === option) {
                  optionClass +=
                    option === question.answer
                      ? " nb-option-correct"
                      : " nb-option-wrong";
                }

                return (
                  <button
                    key={`${questionCount}-${index}`}
                    type="button"
                    className={optionClass}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedOption !== null}
                  >
                    <span className="nb-option-letter">
                      {letter}
                    </span>

                    <span className="nb-option-value">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div
                className={
                  feedback.startsWith("Correct")
                    ? "nb-feedback nb-success"
                    : "nb-feedback nb-error"
                }
                role="status"
                aria-live="polite"
              >
                {feedback}
              </div>
            )}

            <button
              type="button"
              className="nb-exit-button"
              onClick={exitPractice}
            >
              Exit Practice
            </button>
          </main>
        </>
      )}
    </div>
  );
}

export default NumberBonds;
