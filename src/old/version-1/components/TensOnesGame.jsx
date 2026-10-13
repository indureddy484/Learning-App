import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./TensOnesGame.css";
import Level2Game from "./Level2Game";
import Level3Game from "./Level3Game";
import { useNavigate } from "react-router-dom";


const sfxRight = new Audio("/sounds/success-1-6297.mp3");
const sfxWrong = new Audio("/sounds/fail-2-277575.mp3");
const voiceRight = new Audio("/sounds/very-good.mp3");
const voiceWrong = new Audio("/sounds/try-again.mp3");
const tapSound = new Audio("/sounds/tap.mp3");


function TensOnesGame() {
  const [level, setLevel] = useState("level1");

  const generateNumber = () => Math.floor(Math.random() * 90) + 10;
  const [target, setTarget] = useState(generateNumber());
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);

  const tens = Math.floor(target / 10);
  const ones = target % 10;
  const navigate = useNavigate();
  useEffect(() => {
    generateOptions(target);
  }, [target]);

  const generateOptions = (correct) => {
    const wrong1 = correct + (Math.random() > 0.5 ? -10 : 10);
    const wrong2 = correct + (Math.random() > 0.5 ? -1 : 1);
    const optList = [correct, wrong1, wrong2, wrong1 + 10]
      .filter((val, idx, self) => val >= 10 && val <= 99 && self.indexOf(val) === idx)
      .sort(() => Math.random() - 0.5);
    while (optList.length < 3) {
      const rand = generateNumber();
      if (!optList.includes(rand)) optList.push(rand);
    }
    setOptions(optList);
  };

  const handleAnswer = (num) => {
    tapSound.play();
    setSelected(num);
    if (num === target) {
      sfxRight.play();
      voiceRight.play();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.4 } });
      setResult("correct");
      setScore((prev) => prev + 1);
      setTimeout(() => {
        setTarget(generateNumber());
        setSelected(null);
        setResult(null);
      }, 1500);
    } else {
      sfxWrong.play();
      voiceWrong.play();
      setResult("wrong");
      setTimeout(() => {
        setSelected(null);
        setResult(null);
      }, 1500);
    }
  };

  if (level === "level2") return <Level2Game />;
  if (level === "level3") return <Level3Game />;

  return (
    <div className="quiz-container">
      <button
  onClick={() => navigate(-1)}
  className="back-btn"
>
  🔙 
</button>

      <div className="top-bar center-top">
        <h2 className="score">✓ {score}</h2>
        <label className="level-toggle">
          <select
            className="level-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="level1">Level 1: Choose the Number</option>
            <option value="level2">Level 2: Build the Number</option>
            <option value="level3">Level 3: Bundles and Singles</option>
          </select>
        </label>
      </div>

      <div className="quiz-content">
        <div className="visual-box">
          <div className="block-section card">
            <h3>Tens Blocks</h3>
            <div className="grid-tens">
              {[...Array(tens)].map((_, ti) => (
                <div key={ti} className="grid-strip">
                  {[...Array(10)].map((_, ui) => (
                    <div key={ui} className="grid-block ten-block" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="block-section card">
            <h3>Ones Blocks</h3>
            <div className="ones-display">
              {[...Array(ones)].map((_, oi) => (
                <div key={oi} className="grid-block" />
              ))}
            </div>
          </div>
        </div>

        <div className="options-box center-options">
          {options.map((opt, idx) => (
            <button
              key={idx}
              className={`option-btn ${
                selected === opt ? (opt === target ? "correct" : "wrong") : ""
              }`}
              onClick={() => handleAnswer(opt)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* ✅ Feedback message */}
        {result === "correct" && (
          <p className="result-message">🎉 Very Good Suhaas!</p>
        )}
        {result === "wrong" && (
          <p className="wrong-message">❌ Malli try cheyu Suhaas!</p>
        )}
      </div>
    </div>
  );
}

export default TensOnesGame;
