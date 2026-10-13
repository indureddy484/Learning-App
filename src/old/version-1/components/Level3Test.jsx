import React, { useState, useEffect } from "react";
import "./Level3Game.css";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

const sfxRight = new Audio("/sounds/success-1-6297.mp3");
const sfxWrong = new Audio("/sounds/fail-2-277575.mp3");
const sfxTimerEnd = new Audio("/sounds/timer-end.mp3"); // ⚠️ Make sure this file exists

export default function Level3Test() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [pickedItem, setPickedItem] = useState(null);
  const [pickedIndex, setPickedIndex] = useState(null);
  const [usedBundles, setUsedBundles] = useState([]);
  const [usedPens, setUsedPens] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [selectedTime, setSelectedTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [warningPlayed, setWarningPlayed] = useState(false); // ✅ New

  const startTest = () => {
    setQuestions([generateQuestion()]);
    setTestStarted(true);
    setTimeLeft(selectedTime * 60);
    setStartTime(Date.now());
    setAnswers([]);
    setCurrentIndex(0);
    setTens(0);
    setOnes(0);
    setPickedItem(null);
    setPickedIndex(null);
    setUsedBundles([]);
    setUsedPens([]);
    setWarningPlayed(false); // ✅ Reset warning flag
  };

  const generateQuestion = () => Math.floor(Math.random() * 41) + 10;

  useEffect(() => {
    if (!testStarted || timeLeft <= 0) {
      if (testStarted && timeLeft <= 0) {
        submitTest();
      }
      return;
    }

    // ✅ Play sound warning 8 seconds before time ends
    if (timeLeft === 8 && !warningPlayed) {
      sfxTimerEnd.play();
      setWarningPlayed(true);
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, testStarted, warningPlayed]);

  const handleDrop = (type) => {
    if (!pickedItem || pickedItem !== type) return;

    if (type === "bundle") {
      setTens(tens + 1);
      setUsedBundles((prev) => [...prev, pickedIndex]);
    } else if (type === "pen") {
      setOnes(ones + 1);
      setUsedPens((prev) => [...prev, pickedIndex]);
    }

    setPickedItem(null);
    setPickedIndex(null);
  };

  const handleSubmit = () => {
    const target = questions[currentIndex];
    const built = tens * 10 + ones;
    const isCorrect = built === target;

    if (isCorrect) {
      sfxRight.play();
      confetti({ particleCount: 80, spread: 60 });
    } else {
      sfxWrong.play();
    }

    const answerObj = {
      question: target,
      built,
      isCorrect,
    };
    setAnswers((prev) => [...prev, answerObj]);

    const nextQuestion = generateQuestion();
    setQuestions((prev) => [...prev, nextQuestion]);
    setCurrentIndex(currentIndex + 1);
    setTens(0);
    setOnes(0);
    setPickedItem(null);
    setPickedIndex(null);
    setUsedBundles([]);
    setUsedPens([]);
  };

  const submitTest = () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    navigate("/result", {
      state: {
        answers,
        timeTaken: totalTime,
        type: "level3",
      },
    });
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!testStarted) {
    return (
      <div className="test-container">
        <h2>Select Test Duration</h2>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(parseInt(e.target.value))}
        >
          {[...Array(60)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} minute{i === 0 ? "" : "s"}
            </option>
          ))}
        </select>
        <button className="submit-btn" onClick={startTest}>
          ✅ Start Test
        </button>
      </div>
    );
  }

  const target = questions[currentIndex];

  return (
    <div className="quiz-container">
      <div className="top-bar">
        <h2 className="score">Question {currentIndex + 1}</h2>
        <h3 className="timer">⏰ {formatTime(timeLeft)}</h3>
      </div>

      <div className="target-number">Build the number: {target}</div>

      <div className="side-by-side-boxes">
        {/* Tens Box */}
        <div className="box-column">
          <div className="block-section drop-zone" onClick={() => handleDrop("bundle")}>
            <h3>Tens Box ({tens})</h3>
            <div className="grid-tens fixed-size">
              {[...Array(tens)].map((_, i) => (
                <img key={i} src="/images/pen-bundle.png" alt="bundle" className="block-image" />
              ))}
            </div>
          </div>
          <div className="supply-below">
            <h4>Supply Bundles</h4>
            <div className="supply-grid">
              {[...Array(10)].map((_, i) => (
                <div
                  key={`bundle-${i}`}
                  className={`supply-block ${usedBundles.includes(i) ? "used" : ""} ${pickedItem === "bundle" && pickedIndex === i ? "picked" : ""}`}
                  onClick={() => {
                    if (!usedBundles.includes(i)) {
                      setPickedItem("bundle");
                      setPickedIndex(i);
                    }
                  }}
                >
                  <img src="/images/pen-bundle.png" alt="bundle" className="block-image" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ones Box */}
        <div className="box-column">
          <div className="block-section drop-zone" onClick={() => handleDrop("pen")}>
            <h3>Ones Box ({ones})</h3>
            <div className="ones-display fixed-size">
              {[...Array(ones)].map((_, i) => (
                <img key={i} src="/images/pen.png" alt="pen" className="block-image" />
              ))}
            </div>
          </div>
          <div className="supply-below">
            <h4>Supply Pens</h4>
            <div className="supply-grid">
              {[...Array(10)].map((_, i) => (
                <div
                  key={`pen-${i}`}
                  className={`supply-block ${usedPens.includes(i) ? "used" : ""} ${pickedItem === "pen" && pickedIndex === i ? "picked" : ""}`}
                  onClick={() => {
                    if (!usedPens.includes(i)) {
                      setPickedItem("pen");
                      setPickedIndex(i);
                    }
                  }}
                >
                  <img src="/images/pen.png" alt="pen" className="block-image" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px", justifyContent: "center" }}>
        <button className="submit-btn" onClick={handleSubmit}>➡️ Next</button>
        <button className="submit-btn stop" style={{ backgroundColor: "#ff6565" }} onClick={submitTest}>🛑 Stop & Submit</button>
      </div>
    </div>
  );
}
