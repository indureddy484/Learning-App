import React, { useState } from "react";
import "./Level2Game.css";
import TensOnesGame from "./TensOnesGame";
import Level3Game from "./Level3Game";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

const sRight = new Audio("/sounds/success-1-6297.mp3");
const sfxWrong = new Audio("/sounds/fail-2-277575.mp3");
const voiceRight = new Audio("/sounds/very-good.mp3");
const voiceWrong = new Audio("/sounds/try-again.mp3");
const tapSound = new Audio("/sounds/tap.mp3");

export default function Level2Game() {
  const [level, setLevel] = useState("level2");
  const [blockMode, setBlockMode] = useState("color");

  const generateNumber = () => Math.floor(Math.random() * 41) + 10;
  const [target, setTarget] = useState(generateNumber());
  const [tensBlocks, setTensBlocks] = useState(0);
  const [bundledTens, setBundledTens] = useState(0);
  const [onesBlocks, setOnesBlocks] = useState(0);
  const [pickedIndex, setPickedIndex] = useState(null);
  const [usedIndexes, setUsedIndexes] = useState([]);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);

  const totalTens = Math.floor(target / 10);
  const totalOnes = target % 10;
  const navigate = useNavigate();

  const placeInTens = () => {
    if (pickedIndex === null || bundledTens >= totalTens) return;
    tapSound.play();
    setTensBlocks((prev) => {
      const newCount = prev + 1;
      if (newCount === 10) {
        setBundledTens((bt) => bt + 1);
        return 0;
      }
      return newCount;
    });
    setUsedIndexes((prev) => [...prev, pickedIndex]);
    setPickedIndex(null);
  };

  const placeInOnes = () => {
    if (pickedIndex === null || bundledTens < totalTens) return;
    tapSound.play();
    setOnesBlocks((prev) => prev + 1);
    setUsedIndexes((prev) => [...prev, pickedIndex]);
    setPickedIndex(null);
  };

  const handleSubmit = () => {
    const built = bundledTens * 10 + onesBlocks;
    if (built === target) {
      sRight.play();
      voiceRight.play();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setResult("correct");
      setScore((prev) => prev + 1);
      setTimeout(() => {
        setTarget(generateNumber());
        setTensBlocks(0);
        setBundledTens(0);
        setOnesBlocks(0);
        setPickedIndex(null);
        setUsedIndexes([]);
        setResult(null);
      }, 2000);
    } else {
      sfxWrong.play();
      voiceWrong.play();
      setResult("wrong");
    }
  };

  if (level === "level1") return <TensOnesGame />;
  if (level === "level3") return <Level3Game />;
  return (
    <div className="quiz-container">
      <button
  onClick={() => navigate(-1)}
  className="back-btn"
>
  🔙 
</button>

      <div className="top-bar">
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

        <div className="mode-toggle">
          <label htmlFor="blockMode"></label>
          <select
            id="blockMode"
            value={blockMode}
            onChange={(e) => setBlockMode(e.target.value)}
            className="block-mode-select"
          >
            <option value="color">🟦 Color Blocks</option>
            <option value="image">🍫 Chocolate Blocks</option>
          </select>
        </div>
      </div>

      <h2 className="target-number">Build the number: {target}</h2>

      <div className="quiz-content side-by-side">
        <div className="question-blocks">
          <div className="block-section card" onClick={placeInTens}>
            <h3>Tens Box ({bundledTens})</h3>
            <div className="grid-tens">
              {[...Array(bundledTens)].map((_, i) => (
                <div key={i} className="bundle-box">
                  <div className="grid-strip">
                    {[...Array(10)].map((_, j) => (
                      <div key={j} className="grid-block ten-block">
                        {blockMode === "image" && (
                          <img
                            src="/images/choco.png"
                            alt="choco"
                            className="block-image"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {[...Array(tensBlocks)].map((_, i) => (
                <div key={i} className="grid-block">
                  {blockMode === "image" && (
                    <img
                      src="/images/choco.png"
                      alt="choco"
                      className="block-image"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="block-section card" onClick={placeInOnes}>
            <h3>Ones Box ({onesBlocks})</h3>
            <div className="ones-display">
              {[...Array(onesBlocks)].map((_, i) => (
                <div key={i} className="grid-block">
                  {blockMode === "image" && (
                    <img
                      src="/images/choco.png"
                      alt="choco"
                      className="block-image"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="supply-box">
        <div className="supply-grid">
          {[...Array(100)]
            .map((_, i) => i)
            .filter((i) => !usedIndexes.includes(i))
            .map((i) => (
              <div
                key={i}
                className={`supply-block ${
                  pickedIndex === i ? "picked" : ""
                }`}
                onClick={() => {
                  tapSound.play();
                  setPickedIndex(i);
                }}
              >
                {blockMode === "image" && (
                  <img
                    src="/images/choco.png"
                    alt="choco"
                    className="block-image"
                  />
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="submit-section">
        <div className="submit-wrapper">
          <button className="submit-btn" onClick={handleSubmit}>
            ✅ Submit
          </button>
        </div>
        {result === "correct" && (
          <p className="result-message">🎉 Very Good Suhaas!</p>
        )}
        {result === "wrong" && (
          <p className="wrong-message">❌ Malli try cheyu suhaas!</p>
        )}
      </div>
    </div>
  );
}