import { useState } from "react";

import MatchingGame from "../components/MatchingGame";
import VideoGame from "../components/VideoGame";
import DayQuiz from "../components/DayQuiz";
import BirthdayQuiz from "../components/BirthdayQuiz";
import LevelScreen from "../components/LevelScreen";

import "./NewHome.css";

function NewHome({ onBack }) {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [selectedGame, setSelectedGame] = useState(null);

  const [selectedMathsGame, setSelectedMathsGame] =
    useState(null);

  const [selectedLevel, setSelectedLevel] =
    useState(null);

  // =====================================================
  // MATCHING GAME
  // =====================================================

  if (selectedGame === "match") {
    return (
      <MatchingGame
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  // =====================================================
  // VIDEO GAME
  // =====================================================

  if (selectedGame === "video") {
    return (
      <VideoGame
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  // =====================================================
  // MATHS - LEVEL SCREEN
  // =====================================================

  if (
    selectedMathsGame === "levels" &&
    selectedLevel === null
  ) {
    return (
      <LevelScreen
        onBack={() => {
          setSelectedMathsGame(null);
        }}
        onSelectLevel={(level) => {
          // IMPORTANT:
          // Leave the Level Screen
          setSelectedMathsGame(null);

          // Open the selected level
          setSelectedLevel(level);
        }}
      />
    );
  }

  // =====================================================
  // MATHS - LEVEL 1
  // =====================================================

  if (selectedLevel === "level1") {
    return (
      <DayQuiz
        onBack={() => {
          setSelectedLevel(null);
          setSelectedMathsGame("levels");
        }}
      />
    );
  }

  // =====================================================
  // MATHS - LEVEL 2
  // =====================================================

  if (selectedLevel === "level2") {
    return (
      <BirthdayQuiz
        onBack={() => {
          setSelectedLevel(null);
          setSelectedMathsGame("levels");
        }}
      />
    );
  }

  // =====================================================
  // SUBJECT SELECTED
  // =====================================================

  if (selectedSubject) {
    return (
      <div className="new-page">

        {/* =================================================
            BACK TO SUBJECTS
        ================================================= */}

        <button
          className="top-back-button"
          onClick={() => {
            setSelectedSubject(null);
            setSelectedGame(null);
            setSelectedMathsGame(null);
            setSelectedLevel(null);
          }}
        >
          ← BACK
        </button>

        {/* SUBJECT TITLE */}

        <h1>{selectedSubject}</h1>

        {/* =================================================
            EVS GAMES
        ================================================= */}

        {selectedSubject === "EVS" ? (
          <div className="game-tabs">

            {/* MATCH GAME */}

            <button
              className="game-card"
              onClick={() =>
                setSelectedGame("match")
              }
            >
              <div className="game-icon">
                🧩
              </div>

              <span>
                Match Game
              </span>
            </button>

            {/* VIDEO GAME */}

            <button
              className="game-card"
              onClick={() =>
                setSelectedGame("video")
              }
            >
              <div className="game-icon">
                🎬
              </div>

              <span>
                Video Game
              </span>
            </button>

          </div>

        ) : selectedSubject === "Maths" ? (

          /* =================================================
             MATHS
          ================================================= */

          <div className="game-tabs">

            {/* DAY QUIZ */}

            <button
              className="game-card"
              onClick={() => {
                setSelectedMathsGame("levels");
                setSelectedLevel(null);
              }}
            >
              <div className="game-icon">
                📅
              </div>

              <span>
                Day Quiz
              </span>
            </button>

          </div>

        ) : (

          /* =================================================
             OTHER SUBJECTS
          ================================================= */

          <div className="coming-soon">

            <p>
              Games for {selectedSubject} will be added here.
            </p>

          </div>

        )}

      </div>
    );
  }

  // =====================================================
  // NEW HOME - SUBJECT SELECTION
  // =====================================================

  return (
    <div className="new-home">

      {/* =================================================
          BACK TO VERSION SCREEN
      ================================================= */}

      <button
        className="top-back-button"
        onClick={onBack}
      >
        ← BACK
      </button>

      {/* =================================================
          MAIN TITLE
      ================================================= */}

      <h1 className="new-title">
        Learning App
      </h1>

      {/* =================================================
          SUBJECT GRID
      ================================================= */}

      <div className="subject-grid">

        {/* =================================================
            TELUGU
        ================================================= */}

        <button
          className="subject-card"
          onClick={() =>
            setSelectedSubject("Telugu")
          }
        >
          <span className="subject-icon">
            తెలుగు
          </span>

          <span className="subject-name">
            Telugu
          </span>
        </button>

        {/* =================================================
            ENGLISH
        ================================================= */}

        <button
          className="subject-card"
          onClick={() =>
            setSelectedSubject("English")
          }
        >
          <span className="subject-icon">
            A B C
          </span>

          <span className="subject-name">
            English
          </span>
        </button>

        {/* =================================================
            MATHS
        ================================================= */}

        <button
          className="subject-card"
          onClick={() =>
            setSelectedSubject("Maths")
          }
        >
          <span className="subject-icon">
            123
          </span>

          <span className="subject-name">
            Maths
          </span>
        </button>

        {/* =================================================
            EVS
        ================================================= */}

        <button
          className="subject-card"
          onClick={() =>
            setSelectedSubject("EVS")
          }
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