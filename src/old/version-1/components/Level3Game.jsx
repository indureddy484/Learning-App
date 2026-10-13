import React, { useState } from "react";
import "./Level3Game.css";
import Level2Game from "./Level2Game";
import TensOnesGame from "./TensOnesGame";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

const sfxRight = new Audio("/sounds/success-1-6297.mp3");
const sfxWrong = new Audio("/sounds/fail-2-277575.mp3");
const voiceRight = new Audio("/sounds/very-good.mp3");
const voiceWrong = new Audio("/sounds/try-again.mp3");

function Level3Game() {
  const navigate = useNavigate();
  const generateNumber = () => Math.floor(Math.random() * 41) + 10;

  const [level, setLevel] = useState("level3");
  const [target, setTarget] = useState(generateNumber());
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const [usedBundles, setUsedBundles] = useState([]);
  const [usedPens, setUsedPens] = useState([]);
  const [pickedItem, setPickedItem] = useState(null);
  const [pickedIndex, setPickedIndex] = useState(null);

  const totalTens = Math.floor(target / 10);
  const totalOnes = target % 10;

  const handleSubmit = () => {
    const built = tens * 10 + ones;
    if (built === target) {
      sfxRight.play();
      voiceRight.play();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
      setResult("correct");
      setScore(score + 1);
      setTimeout(() => {
        setTarget(generateNumber());
        setTens(0);
        setOnes(0);
        setResult(null);
        setUsedBundles([]);
        setUsedPens([]);
        setPickedItem(null);
        setPickedIndex(null);
      }, 2000);
    } else {
      sfxWrong.play();
      voiceWrong.play();
      setResult("wrong");
    }
  };

  const handleDrop = (type) => {
    if (!pickedItem || pickedItem !== type) return;

    if (type === "bundle" && tens < totalTens) {
      setTens(tens + 1);
      setUsedBundles((prev) => [...prev, pickedIndex]);
    }

    if (type === "pen" && ones < totalOnes) {
      setOnes(ones + 1);
      setUsedPens((prev) => [...prev, pickedIndex]);
    }

    setPickedItem(null);
    setPickedIndex(null);
  };

  // 🔁 Component switching logic
  if (level === "level1") return <TensOnesGame />;
  if (level === "level2") return <Level2Game />;

  return (
    <div className="quiz-container">
      <button onClick={() => navigate(-1)} className="back-btn">🔙</button>

      {/* Top Bar with Dropdown */}
      <div className="top-bar">
  <h2 className="score">✔️ {score}</h2>

  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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

    <button
      className="submit-btn"
      onClick={() => navigate("/tensones-test")}
      style={{
        backgroundColor: "#0077cc",
        fontSize: "14px",
        padding: "8px 12px",
        borderRadius: "10px",
      }}
    >Test 
    </button>
  </div>
</div>


      <div className="header-section">
        <div className="target-number">Build the number: {target}</div>
      </div>

      <div className="side-by-side-boxes">
        {/* Tens */}
        <div className="box-column">
          <div
            className={`block-section drop-zone ${pickedItem === "bundle" ? "drop-ready" : ""}`}
            onClick={() => handleDrop("bundle")}
          >
            <h3>Tens Box ({tens})</h3>
            <div className="grid-tens fixed-size">
              {[...Array(tens)].map((_, i) => (
                <img key={i} src="/images/pen-bundle.png" alt="bundle" className="block-image" />
              ))}
              {tens === totalTens && (
                <div className="lid-overlay animate-lid">
                  <div className="lid-label">LID CLOSED</div>
                </div>
              )}
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

        {/* Ones */}
        <div className="box-column">
          <div
            className={`block-section drop-zone ${pickedItem === "pen" ? "drop-ready" : ""}`}
            onClick={() => handleDrop("pen")}
          >
            <h3>Ones Box ({ones})</h3>
            <div className="ones-display fixed-size">
              {[...Array(ones)].map((_, i) => (
                <img key={i} src="/images/pen.png" alt="pen" className="block-image" />
              ))}
              {ones === totalOnes && (
                <div className="lid-overlay animate-lid">
                  <div className="lid-label">LID CLOSED</div>
                </div>
              )}
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

      <div className="submit-section">
        <button className="submit-btn" onClick={handleSubmit}>✅ Submit</button>
        {result === "correct" && <p className="result-message">🎉 Very Good Suhaas!</p>}
        {result === "wrong" && <p className="wrong-message">❌ Malli try cheyu Suhaas!</p>}
      </div>
    </div>
  );
}

export default Level3Game;
