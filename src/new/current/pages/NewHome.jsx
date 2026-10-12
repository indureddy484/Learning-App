
import { useState } from "react";

import MatchingGame from "../components/MatchingGame";
import VideoGame from "../components/VideoGame";

import Level1Today from "../components/Level1Today";
import Level2NinnaToday from "../components/Level2NinnaToday";
import Level3DaysBeforeAfter from "../components/Level3DaysBeforeAfter";
import Level4DaysMonths from "../components/Level4DaysMonths";
import Level5SpecialDays from "../components/Level5SpecialDays";
import MixedLevel from "../components/MixedLevel";

import LevelScreen from "../components/LevelScreen";
import MoneyLevel1 from "../components/MoneyLevel1";

import "./NewHome.css";

function NewHome({ onBack }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedMathsGame, setSelectedMathsGame] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedMoneyGame, setSelectedMoneyGame] = useState(false);

  /* =========================
     EVS - MATCHING GAME
  ========================= */

  if (selectedGame === "match") {
    return (
      <MatchingGame
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  /* =========================
     EVS - VIDEO GAME
  ========================= */

  if (selectedGame === "video") {
    return (
      <VideoGame
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  /* =========================
     MATHS - DAY QUIZ LEVEL SCREEN
  ========================= */

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
          setSelectedLevel(level);
        }}
      />
    );
  }

  /* =========================
     MATHS - DAY QUIZ LEVEL 1
  ========================= */

  if (selectedLevel === "level1") {
    return (
      <Level1Today
        onBack={() => {
          setSelectedLevel(null);
          setSelectedMathsGame("levels");
        }}
      />
    );
  }

  /* =========================
     MATHS - DAY QUIZ LEVEL 2
  ========================= */

  if (selectedLevel === "level2") {
    return (
      <Level2NinnaToday
        onBack={() => {
          setSelectedLevel(null);
          setSelectedMathsGame("levels");
        }}
      />
    );
  }

  /* =========================
     MATHS - DAY QUIZ LEVEL 3
  ========================= */

  if (selectedLevel === "level3") {
    return (
      <Level3DaysBeforeAfter
        onBack={() => {
          setSelectedLevel(null);
          setSelectedMathsGame("levels");
        }}
      />
    );
  }

  /* =========================
     MATHS - DAY QUIZ LEVEL 4
  ========================= */

  if (selectedLevel === "level4") {
    return (
      <Level4DaysMonths
        onBack={() => {
          setSelectedLevel(null);
          setSelectedMathsGame("levels");
        }}
      />
    );
  }

  /* =========================
     MATHS - DAY QUIZ LEVEL 5
  ========================= */

  if (selectedLevel === "level5") {
    return (
      <Level5SpecialDays
        onBack={() => {
          setSelectedLevel(null);
          setSelectedMathsGame("levels");
        }}
      />
    );
  }

  /* =========================
     MATHS - MIXED LEVEL
  ========================= */

  if (selectedLevel === "mixed") {
    return (
      <MixedLevel
        onBack={() => {
          setSelectedLevel(null);
          setSelectedMathsGame("levels");
        }}
      />
    );
  }

  /* =========================
     MATHS - MONEY LEVEL 1
  ========================= */

  if (selectedMoneyGame) {
    return (
      <MoneyLevel1
        onBack={() => {
          setSelectedMoneyGame(false);
        }}
      />
    );
  }

  /* =========================
     SUBJECT PAGE
  ========================= */

  if (selectedSubject) {
    return (
      <div className="new-page">
        <button
          className="top-back-button"
          onClick={() => {
            setSelectedSubject(null);
            setSelectedGame(null);
            setSelectedMathsGame(null);
            setSelectedLevel(null);
            setSelectedMoneyGame(false);
          }}
        >
          ← BACK
        </button>

        <h1>{selectedSubject}</h1>

        {/* =========================
            EVS
        ========================= */}

        {selectedSubject === "EVS" ? (
          <div className="game-tabs">
            <button
              className="game-card"
              onClick={() => setSelectedGame("match")}
            >
              <div className="game-icon">🧩</div>
              <span>Match Game</span>
            </button>

            <button
              className="game-card"
              onClick={() => setSelectedGame("video")}
            >
              <div className="game-icon">🎬</div>
              <span>Video Game</span>
            </button>
          </div>
        ) : selectedSubject === "Maths" ? (
          /* =========================
             MATHS
          ========================= */

          <div className="game-tabs">
            <button
              className="game-card"
              onClick={() => {
                setSelectedMathsGame("levels");
                setSelectedLevel(null);
                setSelectedMoneyGame(false);
              }}
            >
              <div className="game-icon">📅</div>
              <span>Day Quiz</span>
            </button>

            <button
              className="game-card"
              onClick={() => {
                setSelectedMoneyGame(true);
                setSelectedMathsGame(null);
                setSelectedLevel(null);
              }}
            >
              <div className="game-icon">💰</div>
              <span>Money</span>
            </button>
          </div>
        ) : (
          /* =========================
             TELUGU / ENGLISH
          ========================= */

          <div className="coming-soon">
            <p>
              Games for {selectedSubject} will be added here.
            </p>
          </div>
        )}
      </div>
    );
  }

  /* =========================
     MAIN NEW HOME
  ========================= */

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
