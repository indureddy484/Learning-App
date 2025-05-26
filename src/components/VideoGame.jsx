import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./VideoGame.css";

const levels = [
  ["vid1.mp4", "vid2.mp4", "vid3.mp4", "vid4.mp4", "vid5.mp4", "vid6.mp4", "vid7.mp4", "vid8.mp4", "vid9.mp4"],
  ["scene1.mp4", "scene2.mp4", "scene3.mp4", "scene4.mp4", "scene5.mp4", "scene6.mp4", "scene7.mp4"]
];

const successSound = new Audio("/sounds/success-1-6297.mp3");
const failSound = new Audio("/sounds/fail-2-277575.mp3");
const voiceSuccess = new Audio("/sounds/very-good.mp3");
const voiceFail = new Audio("/sounds/try-again.mp3");

const levelDescriptions = [
  "💧 Potty Story",
  "🍎 Field Story"
];

const VideoGame = () => {
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem("video-level");
    return saved ? parseInt(saved) : 1;
  });

  const [selectedId, setSelectedId] = useState(null);
  const [clips, setClips] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [targets, setTargets] = useState([]);
  const [message, setMessage] = useState("");
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  useEffect(() => {
    const levelData = levels[level - 1];
    if (!levelData) {
      alert("🎉 All video levels completed!");
      return;
    }

    const items = levelData.map((file, i) => ({
      id: `clip-${i}`,
      src: `/videos/level${level}/${file}`
    }));

    setClips(shuffleArray(items));
    setCorrectOrder(items.map((c) => c.id));
    setTargets(new Array(items.length).fill(null));
    setSelectedId(null);
    setMessage("");
  }, [level]);

  const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());
  const getVideoById = (id) => clips.find((c) => c.id === id)?.src;

  const handleSlotClick = (index) => {
    if (!targets[index] && selectedId) {
      const newTargets = [...targets];
      newTargets[index] = selectedId;
      setTargets(newTargets);
      setSelectedId(null);
    }
  };

  const checkAnswer = () => {
    if (targets.includes(null)) {
      setMessage("🚫 Please complete all slots.");
      return;
    }

    const isCorrect = targets.join() === correctOrder.join();
    if (isCorrect) {
      successSound.play();
      voiceSuccess.play();
      confetti({ particleCount: 150, spread: 60, origin: { y: 0.6 } });
      setShowLevelComplete(true);
    } else {
      failSound.play();
      voiceFail.play();
      setMessage("❌ Malli try cheyu Suhaas!");
      setTargets(new Array(clips.length).fill(null));
    }
  };

  const resetProgress = () => {
    setLevel(1);
    localStorage.setItem("video-level", 1);
    setMessage("🔁 Level reset to 1.");
  };

  const removeFromSlot = (index) => {
    const updated = [...targets];
    updated[index] = null;
    setTargets(updated);
  };

  if (showLevelComplete) {
    return (
      <div className="photo-container">
        <h2>Level {level} Complete! 🎉 Veru good suhaas! 🎉</h2>
        <button
          className="check-btn"
          onClick={() => {
            setShowLevelComplete(false);
            const next = level + 1;
            setLevel(next);
            localStorage.setItem("video-level", next);
          }}
        >
          ➡️ Go to Level {level + 1}
        </button>
      </div>
    );
  }

  return (
    <div className="photo-container animated-bg">
      <h2 className="story-title">{levelDescriptions[level - 1]}</h2>

      <select
        className="level-select"
        value={level}
        onChange={(e) => {
          const selected = parseInt(e.target.value);
          setLevel(selected);
          localStorage.setItem("video-level", selected);
        }}
      >
        {levels.map((_, i) => (
          <option key={i} value={i + 1}>Level {i + 1}</option>
        ))}
      </select>

      <div className="photo-row">
        {clips
          .filter((c) => !targets.includes(c.id))
          .map((c) => (
            <div
              key={c.id}
              className={`photo-box ${selectedId === c.id ? "selected" : ""}`}
              onClick={() => setSelectedId(c.id)}
            >
              <video
                src={c.src}
                className="video-player small"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          ))}
      </div>

      <div className="target-row">
        {targets.map((id, index) => (
          <div
            key={index}
            className="drop-slot"
            onClick={() => handleSlotClick(index)}
          >
            {id ? (
              <div className="slot-with-remove">
                <video
                  src={getVideoById(id)}
                  className="photo-img small"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <button
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromSlot(index);
                  }}
                >
                  ❌
                </button>
              </div>
            ) : (
              <div className="placeholder">{index + 1}</div>
            )}
          </div>
        ))}
      </div>

      <button onClick={checkAnswer} className="check-btn">✅ Check Answer</button>
      <button onClick={resetProgress} className="reset-btn">🔁 Reset Progress</button>
      <p className="message">{message}</p>
    </div>
  );
};

export default VideoGame;
