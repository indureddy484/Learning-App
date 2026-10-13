import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Core Screens
import StartScreen from "./components/StartScreen";
import NameInput from "./components/NameInput";

// Story/Video Modes
import StoryMode from "./components/StoryMode";
import PhotoGame from "./components/PhotoGame";
import VideoGame from "./components/VideoGame";

// Quiz Flow
import QuizTopicScreen from "./components/QuizTopicScreen";
import QuizGame from "./components/QuizGame";
import DayQuiz from "./components/DayQuiz";
import ClockQuiz from "./components/ClockQuiz";
import NumberSenseQuiz from "./pages/NumberSense/NumberSenseQuiz";

// Result Pages
import NumberSenseResult from "./pages/NumberSense/NumberSenseResult";
import Result from "./components/Result";
import AscendingResult from "./components/AscendingResult";
import NumberQuizResult from "./pages/quiz/NumberQuizResult";

// Number Games
import CompareGame from "./components/CompareGame";
import CompareTest from "./components/CompareTest";
import AscendingGame from "./components/AscendingGame";
import AscendingTest from "./components/AscendingTest";
import TensOnesGame from "./components/TensOnesGame";
import Level1Game from "./components/Level1Game";
import Level2 from "./components/Level2";
import Level3Test from "./components/Level3Test";
import NumberQuiz from "./pages/quiz/NumberQuiz";

// Blending Games
import ThreeLetterGame from "./components/ThreeLetterWords";
import FourLetterMenu from "./components/FourLetterCategory";
import FourLetterConsonantBlends from "./pages/FourLetterConsonantBlends";
import FourLetterVowelBlends from "./pages/FourLetterVowelBlends";

// Music App Pages
import CategoryPage from "./pages/music/CategoryPage";
import AllAudiosPage from "./pages/music/AllAudiosPage";
import SearchResultsPage from "./pages/music/SearchResultsPage";
import AudioDetailPage from "./pages/music/AudioDetailPage";

// Navbar
import Navbar from "./pages/music/Navbar";

// Games
import ChessGame from "./pages/chess/ChessGame";

// UOI
import UOISystemPage from "./components/UOI/UOISystemPage";

export default function OldApp({ onBack }) {
  const [playerName, setPlayerName] = useState("");
  const location = useLocation();

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");

    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const handleNameSubmit = (name) => {
    setPlayerName(name);
    localStorage.setItem("playerName", name);
  };

  const resetName = () => {
    localStorage.removeItem("playerName");
    setPlayerName("");
  };

  const showNavbarForMusic =
    location.pathname.startsWith("/music") ||
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/audio");

  return (
    <>
      {/* ================================= */}
      {/* BACK TO OLD / NEW SCREEN          */}
      {/* ================================= */}

      <button
        className="old-back-button"
        onClick={onBack}
        aria-label="Back to version selection"
      >
        <span className="back-arrow">←</span>
        <span className="back-text">BACK</span>
      </button>

      {/* Music Navbar */}
      {showNavbarForMusic && <Navbar />}

      <Routes>
        {/* ================================= */}
        {/* HOME                              */}
        {/* ================================= */}

        {!playerName ? (
          <Route
            path="/"
            element={
              <NameInput
                onNameSubmit={handleNameSubmit}
              />
            }
          />
        ) : (
          <Route
            path="/"
            element={
              <StartScreen
                playerName={playerName}
                onReset={resetName}
              />
            }
          />
        )}

        {/* ================================= */}
        {/* QUIZ ROUTES                       */}
        {/* ================================= */}

        <Route
          path="/quiz/:subject"
          element={<QuizTopicScreen />}
        />

        <Route
          path="/quiz/:subject/:topic"
          element={
            <QuizGame
              playerName={playerName}
            />
          }
        />

        <Route
          path="/quiz/day"
          element={
            <DayQuiz
              playerName={playerName}
            />
          }
        />

        <Route
          path="/quiz/clock"
          element={
            <ClockQuiz
              playerName={playerName}
            />
          }
        />

        <Route
          path="/numbersense"
          element={<NumberSenseQuiz />}
        />

        <Route
          path="/quiz/numberquiz/start"
          element={<NumberQuiz />}
        />

        {/* ================================= */}
        {/* RESULT PAGES                      */}
        {/* ================================= */}

        <Route
          path="/result/numbersense"
          element={<NumberSenseResult />}
        />

        <Route
          path="/result/compare"
          element={<Result />}
        />

        <Route
          path="/result"
          element={<Result />}
        />

        <Route
          path="/ascending-result"
          element={<AscendingResult />}
        />

        <Route
          path="/result/numberquiz"
          element={<NumberQuizResult />}
        />

        {/* ================================= */}
        {/* STORY / VIDEO / PHOTO             */}
        {/* ================================= */}

        <Route
          path="/story/:storyId/:mode"
          element={
            <StoryMode
              playerName={playerName}
            />
          }
        />

        <Route
          path="/video"
          element={
            <VideoGame
              playerName={playerName}
            />
          }
        />

        <Route
          path="/photo"
          element={
            <PhotoGame
              playerName={playerName}
            />
          }
        />

        {/* ================================= */}
        {/* NUMBER GAMES                      */}
        {/* ================================= */}

        <Route
          path="/compare"
          element={
            <CompareGame
              playerName={playerName}
            />
          }
        />

        <Route
          path="/compare-test"
          element={<CompareTest />}
        />

        <Route
          path="/ascending"
          element={
            <AscendingGame
              playerName={playerName}
            />
          }
        />

        <Route
          path="/ascending-test"
          element={<AscendingTest />}
        />

        <Route
          path="/TensOnesGame"
          element={<TensOnesGame />}
        />

        <Route
          path="/Level1Game"
          element={<Level1Game />}
        />

        <Route
          path="/Level2"
          element={<Level2 />}
        />

        <Route
          path="/tensones-test"
          element={<Level3Test />}
        />

        <Route
          path="/quiz/numbers"
          element={<NumberQuiz />}
        />

        {/* ================================= */}
        {/* PHONICS                           */}
        {/* ================================= */}

        <Route
          path="/blending/3letter"
          element={<ThreeLetterGame />}
        />

        <Route
          path="/blending/4letter"
          element={<FourLetterConsonantBlends />}
        />

        <Route
          path="/blending/4letter/vowels"
          element={<FourLetterVowelBlends />}
        />

        <Route
          path="/blending/4letter/menu"
          element={<FourLetterMenu />}
        />

        {/* ================================= */}
        {/* MUSIC                             */}
        {/* ================================= */}

        <Route
          path="/music"
          element={<CategoryPage />}
        />

        <Route
          path="/music/all-audios"
          element={<AllAudiosPage />}
        />

        <Route
          path="/search"
          element={<SearchResultsPage />}
        />

        <Route
          path="/audio/:category/:name"
          element={<AudioDetailPage />}
        />

        {/* ================================= */}
        {/* CHESS                             */}
        {/* ================================= */}

        <Route
          path="/pages/chess"
          element={<ChessGame />}
        />

        {/* ================================= */}
        {/* UOI                               */}
        {/* ================================= */}

        <Route
          path="/uoi/:system"
          element={<UOISystemPage />}
        />
      </Routes>
    </>
  );
}