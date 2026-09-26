import React, { useState, useEffect } from "react";
import "./Level2.css";

const sfxRight = new Audio("/sounds/success-1-6297.mp3");
const sfxWrong = new Audio("/sounds/fail-2-277575.mp3");

const voiceRightSuhaas = new Audio("/sounds/very-good.mp3");
const voiceWrongSuhaas = new Audio("/sounds/try-again.mp3");

export default function Level2() {
  const [selectedLevel, setSelectedLevel] = useState("Level2");
  const [ones, setOnes] = useState([]);
  const [tens, setTens] = useState([]);
  const [count, setCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState(10);

  useEffect(() => {
    generateOnes();
    generateRandomTarget();
  }, []);

  const generateOnes = () => {
    const blocks = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      emoji: "🧱",
    }));
    setOnes(blocks);
  };

  const generateRandomTarget = () => {
    const multiplesOfTen = [10, 20, 30, 40, 50];
    const random = multiplesOfTen[Math.floor(Math.random() * multiplesOfTen.length)];
    setTarget(random);
    setTens([]);
    setCount(0);
  };

  const handleDrop = () => {
    if (count < 10) {
      const newCount = count + 1;
      setCount(newCount);

      if (newCount === 10) {
        setShowPopup(true);
        setTimeout(() => {
          setTens((prev) => [...prev, Array.from({ length: 10 })]);
          setCount(0);
          setShowPopup(false);
        }, 2000);
      }
    }
  };

  const handleCheckAnswer = () => {
    const currentValue = tens.length * 10 + count;
    if (currentValue === target) {
      sfxRight.play();
      voiceRightSuhaas.play();
      setMessage(`✅ very good suhaas!`);
      setTimeout(() => {
        setMessage("");
        generateRandomTarget();
      }, 3000);
    } else {
      sfxWrong.play();
      voiceWrongSuhaas.play();
      setMessage(`❌ Malli try cheyu suhaas!`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="level2-container">
      {/* Level Switch */}
      <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
        🔄 Switch Level:
      </label>
      <select
        value={selectedLevel}
        onChange={(e) => (window.location.href = `/${e.target.value}`)}
      >
        <option value="Level1Game">Level 1</option>
        <option value="Level2">Level 2</option>
      </select>

      {/* Question Display */}
      <h2 style={{ color: "teal", margin: "1rem 0" }}>
        🎯 Build the number: {target}
      </h2>

      {/* Tens Display */}
      <div className="tens-box">
        {tens.map((_, i) => (
          <div key={i} className="ten-bundle">
            {Array.from({ length: 10 }).map((_, j) => (
              <div key={j} className="tiny-block-in-box">🧱</div>
            ))}
          </div>
        ))}
      </div>

      {/* Drop Area */}
      <div
        className="ones-box"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="ones-content">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="tiny-block-in-box">🧱</div>
          ))}
        </div>
        <p>Drop 10 blocks here</p>
      </div>

      {/* ✅ Check Answer Button */}
      <button className="check-btn" onClick={handleCheckAnswer}>
        ✅ Check Answer
      </button>

      {/* 🎉 Feedback Message */}
      {message && <div className="success-message">{message}</div>}

      {/* Blocks Supply */}
      <div className="ones-supply">
        {ones.map((block) => (
          <div
            key={block.id}
            className="draggable-block"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", "");
              e.currentTarget.classList.add("dragging");
            }}
            onDragEnd={(e) => e.currentTarget.classList.remove("dragging")}
          >
            {block.emoji}
          </div>
        ))}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>
              🎉 {tens.length + 1} {tens.length + 1 === 1 ? "ten" : "tens"} ={" "}
              {(tens.length + 1) * 10} ones
            </h3>
            <div className="visual-row">
              <div className="ten-box-highlight">🧱</div>
              <span style={{ fontSize: "20px" }}>=</span>
              <div className="ones-row">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} style={{ fontSize: "18px", margin: "2px" }}>
                    🧱
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
