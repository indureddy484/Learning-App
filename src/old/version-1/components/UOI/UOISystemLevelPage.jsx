import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UOISystemLevelPage.css";

export default function UOISystemLevelPage() {
  const { system, level } = useParams();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(level);

  // Example video URLs per system & level
  const videoMap = {
    skeletal: {
      level1: "/videos/skeletal-level1.mp4",
    },
    respiratory: {
      level1: "/videos/respiratory-level1.mp4",
      level2: "/videos/respiratory-level2.mp4",
      level3: "/videos/respiratory-level3.mp4",
    },
    nervous: {
      level1: "/videos/nervous-level1.mp4",
      level2: "/videos/nervous-level2.mp4",
      level3: "/videos/nervous-level3.mp4",
    },
  };

  const handleLevelChange = (e) => {
    const newLevel = e.target.value;
    setSelectedLevel(newLevel);
    navigate(`/uoi/${system}/${newLevel}`);
  };

  const currentVideo = videoMap[system]?.[selectedLevel];

  return (
    <div className="uoi-level-page">
      <button className="back-btn" onClick={() => navigate(-1)}>🔙 Back</button>

      <h2 className="uoi-heading">📚 {system.toUpperCase()} - {selectedLevel.toUpperCase()}</h2>

      <select value={selectedLevel} onChange={handleLevelChange} className="level-select">
        <option value="level1">🎬 Level 1 (Video Quiz)</option>
        <option value="level2">🖼️ Level 2 (Image Quiz)</option>
        <option value="level3">📄 Level 3 (PDF Quiz)</option>
      </select>

      {currentVideo ? (
        <video
          key={currentVideo}
          src={currentVideo}
          controls
          className="uoi-video"
        />
      ) : (
        <p>⚠️ Video not available for this level.</p>
      )}
    </div>
  );
}
