import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Level1Game.css";

export default function Level1Game() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState("level1");
  const [currentNumber, setCurrentNumber] = useState(3);
  const [score, setScore] = useState(0);
  const [blocksInBox, setBlocksInBox] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("message");
  const [retryVisible, setRetryVisible] = useState(false);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    generateNewNumber();
    createBlocks();
    resetBox();
  }, []);

  const generateNewNumber = () => {
    const num = Math.floor(Math.random() * 9) + 1;
    setCurrentNumber(num);
  };

  const createBlocks = () => {
    const blockList = [];
    for (let i = 0; i < 15; i++) {
      blockList.push({ id: i, emoji: "🧱" });
    }
    setBlocks(blockList);
  };

  const resetBox = () => {
    setBlocksInBox(0);
    setGameActive(true);
    setMessage("");
    setMessageClass("message");
    setRetryVisible(false);

    const boxLid = document.getElementById("box-lid");
    const storageBox = document.getElementById("storage-box");

    if (boxLid) boxLid.classList.remove("closed");
    if (storageBox) storageBox.classList.remove("correct");

    const inBoxBlocks = storageBox?.querySelectorAll(".block.in-box");
    inBoxBlocks?.forEach((block) => block.remove());
  };

  const handleDrop = () => {
    if (!gameActive) return;

    const storage = document.getElementById("storage-box");
    const dragged = document.querySelector(".block.dragging");

    if (dragged && !dragged.classList.contains("in-box")) {
      const clone = dragged.cloneNode(true);
      clone.classList.add("in-box");
      clone.classList.remove("dragging");
      clone.draggable = false;

      storage.appendChild(clone);
      const newCount = blocksInBox + 1;
      setBlocksInBox(newCount);

      if (newCount === currentNumber) {
        setMessage("Correct! 🎉");
        setMessageClass("message correct");
        document.getElementById("box-lid").classList.add("closed");
        document.getElementById("storage-box").classList.add("correct");

        setScore(score + 1);
        setGameActive(false);

        setTimeout(() => {
          generateNewNumber();
          createBlocks();
          resetBox();
        }, 3000);
      } else if (newCount > currentNumber) {
        setMessage("Too many blocks! Try again.");
        setMessageClass("message incorrect");
        setRetryVisible(true);
        setGameActive(false);
      }
    }
  };

  return (
    <div className="level1-container">
      <label style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
        🔄 Switch Level:
      </label>
      <select
        value={selectedLevel}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedLevel(value);
          if (value === "level2") navigate("/Level2");
        }}
        style={{
          padding: "8px",
          borderRadius: "10px",
          fontSize: "16px",
          marginBottom: "1rem",
        }}
      >
        <option value="level1">🔢 Level 1</option>
        <option value="level2">🔁 Go to Level 2</option>
      </select>

      <div className="game-header">
        <div className="number-display">Number: <span>{currentNumber}</span></div>
        <div className="score">Score: <span>{score}</span></div>
      </div>

      <div className="game-area">
        <div
          className="storage-box"
          id="storage-box"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="storage-box-lid" id="box-lid">Great Job! 🎉</div>
        </div>

        <div className="blocks-area">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="block"
              draggable={gameActive}
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
      </div>

      <div className={messageClass}>{message}</div>
      {retryVisible && (
        <button className="retry-button" onClick={resetBox}>
          Try Again
        </button>
      )}
    </div>
  );
}
