import { useState } from "react";
import MatchingGame from "../components/MatchingGame";
import VideoGame from "../components/VideoGame";
import "./NewHome.css";

function NewHome({ onBack }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  // =========================
  // MATCHING GAME
  // =========================
  if (selectedGame === "match") {
    return (
      <MatchingGame
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  // =========================
  // VIDEO GAME
  // =========================
  if (selectedGame === "video") {
    return (
      <VideoGame
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  // =========================
  // SUBJECT SELECTED
  // =========================
  if (selectedSubject) {
    return (
      <div className="new-page">

        <button
          className="top-back-button"
          onClick={() => setSelectedSubject(null)}
        >
          ← BACK
        </button>

        <h1>{selectedSubject}</h1>

        {/* EVS GAMES */}
        {selectedSubject === "EVS" ? (
          <div className="game-tabs">

            {/* MATCH GAME */}
            <button
              className="game-card"
              onClick={() => setSelectedGame("match")}
            >
              <div className="game-icon">🧩</div>

              <span>Match Game</span>
            </button>

            {/* VIDEO GAME */}
            <button
              className="game-card"
              onClick={() => setSelectedGame("video")}
            >
              <div className="game-icon">🎬</div>

              <span>Video Game</span>
            </button>

          </div>
        ) : (
          <div className="coming-soon">
            <p>
              Games for {selectedSubject} will be added here.
            </p>
          </div>
        )}

      </div>
    );
  }

  // =========================
  // NEW HOME - SUBJECTS
  // =========================
  return (
    <div className="new-home">

      <button
        className="top-back-button"
        onClick={onBack}
      >
        ← BACK
      </button>

      <h1 className="new-title">
        Learning App
      </h1>

      <div className="subject-grid">

        {/* TELUGU */}
        <button
          className="subject-card"
          onClick={() => setSelectedSubject("Telugu")}
        >
          <span className="subject-icon">
            తెలుగు
          </span>

          <span className="subject-name">
            Telugu
          </span>
        </button>

        {/* ENGLISH */}
        <button
          className="subject-card"
          onClick={() => setSelectedSubject("English")}
        >
          <span className="subject-icon">
            A B C
          </span>

          <span className="subject-name">
            English
          </span>
        </button>

        {/* MATHS */}
        <button
          className="subject-card"
          onClick={() => setSelectedSubject("Maths")}
        >
          <span className="subject-icon">
            123
          </span>

          <span className="subject-name">
            Maths
          </span>
        </button>

        {/* EVS */}
        <button
          className="subject-card"
          onClick={() => setSelectedSubject("EVS")}
        >
          <span className="subject-icon">
            🌱
          </span>

          <span className="subject-name">
            EVS
          </span>
        </button>

      </div>

    </div>
  );
}

export default NewHome;