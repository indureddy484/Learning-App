import { useState } from "react";

import MatchingGame from "../components/MatchingGame";
import VideoGame from "../components/VideoGame";
import Animals from "../components/Animals";
import Plants from "../components/Plants";

import Level1Today from "../components/Level1Today";
import Level2NinnaToday from "../components/Level2NinnaToday";
import Level3DaysBeforeAfter from "../components/Level3DaysBeforeAfter";
import Level4DaysMonths from "../components/Level4DaysMonths";
import Level5SpecialDays from "../components/Level5SpecialDays";
import MixedLevel from "../components/MixedLevel";

import LevelScreen from "../components/LevelScreen";

import MoneyLevel1 from "../components/MoneyLevel1";
import MoneyLevel2 from "../components/MoneyLevel2";
import MoneyLevel3 from "../components/MoneyLevel3";

import VisualLengthLevel1 from "../components/VisualLengthLevel1";
import VisualLengthLevel2 from "../components/VisualLengthLevel2";

// NUMBER SENSE
import NumberSenseMenu from "../components/NumberSenseMenu";
import AscendingOrder from "../components/AscendingOrder";
import CompareNumbers from "../components/CompareNumbers";
import NumberSense from "../components/NumberSense";
import PictureAscendingOrder from "../components/PictureAscendingOrder";
import AdditionQuiz from "../components/AdditionQuiz";
import SubtractionQuiz from "../components/SubtractionQuiz";

// ENGLISH - TENALI RAMA
import TenaliRamaGreedyFarmer from "../components/TenaliRamaGreedyFarmer";
import TenaliLessonMenu from "../components/TenaliLessonMenu";
import TenaliStory from "../components/TenaliStory";
import TenaliQuiz from "../components/TenaliQuiz";

// ENGLISH - LION AND THE MOUSE
import LionMouseLessonMenu from "../components/LionMouseLessonMenu";
import LionMouseVideo from "../components/LionMouseVideo";

// TELUGU
import PrepositionQuiz from "../components/PrepositionQuiz";

// EVS - ANIMALS QUIZ
import AnimalsQuiz from "../components/AnimalsQuiz";

import "./NewHome.css";

function NewHome({ onBack }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedMathsGame, setSelectedMathsGame] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // English navigation
  const [selectedEnglishTopic, setSelectedEnglishTopic] = useState(null);
  const [selectedTenaliOption, setSelectedTenaliOption] = useState(null);

  // Lion and the Mouse navigation
  const [selectedLionMouseOption, setSelectedLionMouseOption] = useState(null);

  // Telugu navigation
  const [selectedTeluguOption, setSelectedTeluguOption] = useState(null);
  const [selectedTeluguQuizTopic, setSelectedTeluguQuizTopic] = useState(null);

  // EVS - Quiz navigation
  const [selectedEvsQuizTopic, setSelectedEvsQuizTopic] = useState(null);

  // Money navigation state
  const [selectedMoneyGame, setSelectedMoneyGame] = useState(false);
  const [selectedMoneyLevel, setSelectedMoneyLevel] = useState(null);

  // Length navigation state
  const [selectedMeasureGame, setSelectedMeasureGame] = useState(false);
  const [selectedMeasureLevel, setSelectedMeasureLevel] = useState(null);

  // Number Sense navigation state
  const [selectedNumberSenseMenu, setSelectedNumberSenseMenu] = useState(false);
  const [selectedNumberSenseActivity, setSelectedNumberSenseActivity] =
    useState(null);

  /* =========================
     EVS - ANIMALS
  ========================= */

  if (selectedGame === "animals") {
    return <Animals onBack={() => setSelectedGame(null)} />;
  }

  /* =========================
     EVS - PLANTS
  ========================= */

  if (selectedGame === "plants") {
    return <Plants onBack={() => setSelectedGame(null)} />;
  }

  /* =========================
     EVS - MISCELLANEOUS MENU
  ========================= */

  if (selectedGame === "miscellaneous") {
    return (
      <div className="new-page">
        <button
          className="top-back-button"
          onClick={() => setSelectedGame(null)}
          type="button"
        >
          ← BACK
        </button>

        <h1>Miscellaneous</h1>

        <div className="game-tabs">
          <button
            className="game-card"
            onClick={() => setSelectedGame("match")}
            type="button"
          >
            <div className="game-icon">🧩</div>
            <span>Match Game</span>
          </button>

          <button
            className="game-card"
            onClick={() => setSelectedGame("video")}
            type="button"
          >
            <div className="game-icon">🎬</div>
            <span>Video Game</span>
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     EVS - QUIZ TOPICS
  ========================= */

  if (
    selectedSubject === "EVS" &&
    selectedGame === "quiz" &&
    selectedEvsQuizTopic === null
  ) {
    return (
      <div className="new-page">
        <button
          className="top-back-button"
          onClick={() => setSelectedGame(null)}
          type="button"
        >
          ← BACK
        </button>

        <h1>EVS Quiz</h1>

        <div className="game-tabs">
          <button
            className="game-card"
            onClick={() => setSelectedEvsQuizTopic("animals")}
            type="button"
          >
            <div className="game-icon">🐘</div>
            <span>Animals Quiz</span>
          </button>

          <button
            className="game-card"
            onClick={() => setSelectedEvsQuizTopic("plants")}
            type="button"
          >
            <div className="game-icon">🌿</div>
            <span>Plants Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     EVS - ANIMALS QUIZ
  ========================= */

  if (
    selectedSubject === "EVS" &&
    selectedGame === "quiz" &&
    selectedEvsQuizTopic === "animals"
  ) {
    return (
      <AnimalsQuiz
        onBack={() => setSelectedEvsQuizTopic(null)}
      />
    );
  }

  /* =========================
     EVS - PLANTS QUIZ
  ========================= */

  if (
    selectedSubject === "EVS" &&
    selectedGame === "quiz" &&
    selectedEvsQuizTopic === "plants"
  ) {
    return (
      <div className="new-page">
        <button
          className="top-back-button"
          onClick={() => setSelectedEvsQuizTopic(null)}
          type="button"
        >
          ← BACK
        </button>

        <h1>Plants Quiz</h1>

        <div className="coming-soon">
          <h2>Quiz</h2>
          <p>Coming Soon!</p>
        </div>
      </div>
    );
  }

  /* =========================
     EVS - MATCHING GAME
  ========================= */

  if (selectedGame === "match") {
    return (
      <MatchingGame
        onBack={() => setSelectedGame("miscellaneous")}
      />
    );
  }

  /* =========================
     EVS - VIDEO GAME
  ========================= */

  if (selectedGame === "video") {
    return (
      <VideoGame
        onBack={() => setSelectedGame("miscellaneous")}
      />
    );
  }

  /* =========================
     MATHS - DAY QUIZ LEVEL SCREEN
  ========================= */

  if (selectedMathsGame === "levels" && selectedLevel === null) {
    return (
      <LevelScreen
        onBack={() => setSelectedMathsGame(null)}
        onSelectLevel={(level) => setSelectedLevel(level)}
      />
    );
  }

  /* =========================
     DAY QUIZ - LEVEL 1
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
     DAY QUIZ - LEVEL 2
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
     DAY QUIZ - LEVEL 3
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
     DAY QUIZ - LEVEL 4
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
     DAY QUIZ - LEVEL 5
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
     DAY QUIZ - MIXED LEVEL
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
     MONEY - LEVEL SELECTION
  ========================= */

  if (selectedMoneyGame && selectedMoneyLevel === null) {
    return (
      <div className="new-page">
        <button
          className="top-back-button"
          onClick={() => {
            setSelectedMoneyGame(false);
            setSelectedMoneyLevel(null);
          }}
          type="button"
        >
          ← BACK
        </button>

        <h1>Money</h1>

        <div className="game-tabs">
          <button
            className="game-card"
            onClick={() => setSelectedMoneyLevel("level1")}
            type="button"
          >
            <div className="game-icon">💵</div>
            <span>Level 1</span>
          </button>

          <button
            className="game-card"
            onClick={() => setSelectedMoneyLevel("level2")}
            type="button"
          >
            <div className="game-icon">💰</div>
            <span>Level 2</span>
          </button>

          <button
            className="game-card"
            onClick={() => setSelectedMoneyLevel("level3")}
            type="button"
          >
            <div className="game-icon">🛍️</div>
            <span>Level 3</span>
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     MONEY - LEVEL 1
  ========================= */

  if (selectedMoneyGame && selectedMoneyLevel === "level1") {
    return <MoneyLevel1 onBack={() => setSelectedMoneyLevel(null)} />;
  }

  /* =========================
     MONEY - LEVEL 2
  ========================= */

  if (selectedMoneyGame && selectedMoneyLevel === "level2") {
    return <MoneyLevel2 onBack={() => setSelectedMoneyLevel(null)} />;
  }

  /* =========================
     MONEY - LEVEL 3
  ========================= */

  if (selectedMoneyGame && selectedMoneyLevel === "level3") {
    return <MoneyLevel3 onBack={() => setSelectedMoneyLevel(null)} />;
  }

  /* =========================
     LENGTH - LEVEL SELECTION
  ========================= */

  if (selectedMeasureGame && selectedMeasureLevel === null) {
    return (
      <div className="new-page">
        <button
          className="top-back-button"
          onClick={() => {
            setSelectedMeasureGame(false);
            setSelectedMeasureLevel(null);
          }}
          type="button"
        >
          ← BACK
        </button>

        <h1>Length</h1>

        <div className="game-tabs">
          <button
            className="game-card"
            onClick={() => setSelectedMeasureLevel("visualLength")}
            type="button"
          >
            <div className="game-icon">📏</div>
            <span>Level 1</span>
            <span>Visual Length</span>
          </button>

          <button
            className="game-card"
            onClick={() => setSelectedMeasureLevel("visualLength2")}
            type="button"
          >
            <div className="game-icon">📐</div>
            <span>Level 2</span>
            <span>Visual Length</span>
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     LENGTH - VISUAL LENGTH LEVEL 1
  ========================= */

  if (selectedMeasureGame && selectedMeasureLevel === "visualLength") {
    return (
      <VisualLengthLevel1
        onBack={() => setSelectedMeasureLevel(null)}
      />
    );
  }

  /* =========================
     LENGTH - VISUAL LENGTH LEVEL 2
  ========================= */

  if (selectedMeasureGame && selectedMeasureLevel === "visualLength2") {
    return (
      <VisualLengthLevel2
        onBack={() => setSelectedMeasureLevel(null)}
      />
    );
  }

  /* =========================
     NUMBER SENSE - MENU
  ========================= */

  if (selectedNumberSenseMenu && selectedNumberSenseActivity === null) {
    return (
      <NumberSenseMenu
        onBack={() => setSelectedNumberSenseMenu(false)}
        onSelectActivity={(activity) => {
          setSelectedNumberSenseActivity(activity);
        }}
      />
    );
  }

  /* =========================
     NUMBER SENSE - COMPARE NUMBERS
  ========================= */

  if (
    selectedNumberSenseMenu &&
    selectedNumberSenseActivity === "compare"
  ) {
    return (
      <CompareNumbers
        onBack={() => setSelectedNumberSenseActivity(null)}
      />
    );
  }

  /* =========================
     NUMBER SENSE - ASCENDING ORDER QUIZ
  ========================= */

  if (
    selectedNumberSenseMenu &&
    selectedNumberSenseActivity === "ascending"
  ) {
    return (
      <AscendingOrder
        onBack={() => setSelectedNumberSenseActivity(null)}
      />
    );
  }

  /* =========================
     NUMBER SENSE - WORD PROBLEMS
  ========================= */

  if (
    selectedNumberSenseMenu &&
    selectedNumberSenseActivity === "numberSense"
  ) {
    return (
      <NumberSense
        onBack={() => setSelectedNumberSenseActivity(null)}
      />
    );
  }

  /* =========================
     NUMBER SENSE - PICTURE-BASED ASCENDING ORDER
  ========================= */

  if (
    selectedNumberSenseMenu &&
    selectedNumberSenseActivity === "pictureAscending"
  ) {
    return (
      <PictureAscendingOrder
        onBack={() => setSelectedNumberSenseActivity(null)}
      />
    );
  }

  /* =========================
     NUMBER SENSE - ADDITION QUIZ
  ========================= */

  if (
    selectedNumberSenseMenu &&
    selectedNumberSenseActivity === "addition"
  ) {
    return (
      <AdditionQuiz
        onBack={() => setSelectedNumberSenseActivity(null)}
      />
    );
  }
  /* =========================
   NUMBER SENSE - SUBTRACTION QUIZ
========================= */

if (
  selectedNumberSenseMenu &&
  selectedNumberSenseActivity === "subtraction"
) {
  return (
    <SubtractionQuiz
      onBack={() => setSelectedNumberSenseActivity(null)}
    />
  );
}

  /* =========================
     ENGLISH - TENALI RAMA STORY / QUIZ MENU
  ========================= */

  if (selectedEnglishTopic === "tenali") {
    if (selectedTenaliOption === "story") {
      return (
        <TenaliStory
          onBack={() => setSelectedTenaliOption(null)}
        />
      );
    }

    if (selectedTenaliOption === "quiz") {
      return (
        <TenaliQuiz
          onBack={() => setSelectedTenaliOption(null)}
        />
      );
    }

    return (
      <TenaliLessonMenu
        onStory={() => setSelectedTenaliOption("story")}
        onQuiz={() => setSelectedTenaliOption("quiz")}
        onBack={() => {
          setSelectedEnglishTopic(null);
          setSelectedTenaliOption(null);
        }}
      />
    );
  }

  /* =========================
     ENGLISH - LION AND THE MOUSE
  ========================= */

  if (selectedEnglishTopic === "lionMouse") {
    if (selectedLionMouseOption === "video") {
      return (
        <LionMouseVideo
          onBack={() => setSelectedLionMouseOption(null)}
        />
      );
    }

    if (selectedLionMouseOption === "quiz") {
      return (
        <div className="new-page">
          <button
            className="top-back-button"
            type="button"
            onClick={() => setSelectedLionMouseOption(null)}
          >
            ← BACK
          </button>

          <h1>Lion and the Mouse</h1>

          <div className="coming-soon">
            <h2>Quiz</h2>
            <p>Coming Soon!</p>
          </div>
        </div>
      );
    }

    return (
      <LionMouseLessonMenu
        onVideo={() => setSelectedLionMouseOption("video")}
        onQuiz={() => setSelectedLionMouseOption("quiz")}
        onBack={() => {
          setSelectedEnglishTopic(null);
          setSelectedLionMouseOption(null);
        }}
      />
    );
  }

  /* =========================
     TELUGU - PREPOSITION QUIZ PAGE
  ========================= */

  if (
    selectedSubject === "Telugu" &&
    selectedTeluguOption === "quiz" &&
    selectedTeluguQuizTopic === "preposition"
  ) {
    return (
      <PrepositionQuiz
        onBack={() => setSelectedTeluguQuizTopic(null)}
      />
    );
  }

  /* =========================
     TELUGU - QUIZ TOPICS
  ========================= */

  if (
    selectedSubject === "Telugu" &&
    selectedTeluguOption === "quiz"
  ) {
    return (
      <div className="new-page">
        <button
          className="top-back-button"
          onClick={() => setSelectedTeluguOption(null)}
          type="button"
        >
          ← BACK
        </button>

        <h1>తెలుగు - Quiz</h1>

        <div className="game-tabs">
          <button
            className="game-card"
            onClick={() => setSelectedTeluguQuizTopic("preposition")}
            type="button"
          >
            <div className="game-icon">📝</div>
            <span>Preposition</span>
          </button>
        </div>
      </div>
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
            setSelectedEvsQuizTopic(null);
            setSelectedMathsGame(null);
            setSelectedLevel(null);
            setSelectedEnglishTopic(null);
            setSelectedTenaliOption(null);
            setSelectedLionMouseOption(null);
            setSelectedTeluguOption(null);
            setSelectedTeluguQuizTopic(null);
            setSelectedMoneyGame(false);
            setSelectedMoneyLevel(null);
            setSelectedMeasureGame(false);
            setSelectedMeasureLevel(null);
            setSelectedNumberSenseMenu(false);
            setSelectedNumberSenseActivity(null);
          }}
          type="button"
        >
          ← BACK
        </button>

        <h1>{selectedSubject}</h1>

        {/* EVS */}

        {selectedSubject === "EVS" ? (
          <div className="game-tabs">
            <button
              className="game-card"
              onClick={() => setSelectedGame("animals")}
              type="button"
            >
              <div className="game-icon">🐘</div>
              <span>Animals</span>
            </button>

            <button
              className="game-card"
              onClick={() => setSelectedGame("plants")}
              type="button"
            >
              <div className="game-icon">🌳</div>
              <span>Plants</span>
            </button>

            <button
              className="game-card"
              onClick={() => setSelectedGame("miscellaneous")}
              type="button"
            >
              <div className="game-icon">📚</div>
              <span>Miscellaneous</span>
            </button>

            {/* EVS QUIZ OPTION */}

            <button
              className="game-card"
              onClick={() => {
                setSelectedGame("quiz");
                setSelectedEvsQuizTopic(null);
              }}
              type="button"
            >
              <div className="game-icon">📝</div>
              <span>Quiz</span>
            </button>
          </div>
        ) : selectedSubject === "Maths" ? (
          /* MATHS */

          <div className="game-tabs">
            <button
              className="game-card"
              onClick={() => {
                setSelectedMathsGame("levels");
                setSelectedLevel(null);
                setSelectedMoneyGame(false);
                setSelectedMoneyLevel(null);
                setSelectedMeasureGame(false);
                setSelectedMeasureLevel(null);
                setSelectedNumberSenseMenu(false);
                setSelectedNumberSenseActivity(null);
              }}
              type="button"
            >
              <div className="game-icon">📅</div>
              <span>Calendar</span>
            </button>

            <button
              className="game-card"
              onClick={() => {
                setSelectedMoneyGame(true);
                setSelectedMoneyLevel(null);
                setSelectedMathsGame(null);
                setSelectedLevel(null);
                setSelectedMeasureGame(false);
                setSelectedMeasureLevel(null);
                setSelectedNumberSenseMenu(false);
                setSelectedNumberSenseActivity(null);
              }}
              type="button"
            >
              <div className="game-icon">💰</div>
              <span>Money</span>
            </button>

            <button
              className="game-card"
              onClick={() => {
                setSelectedMeasureGame(true);
                setSelectedMeasureLevel(null);
                setSelectedMathsGame(null);
                setSelectedLevel(null);
                setSelectedMoneyGame(false);
                setSelectedMoneyLevel(null);
                setSelectedNumberSenseMenu(false);
                setSelectedNumberSenseActivity(null);
              }}
              type="button"
            >
              <div className="game-icon">📏</div>
              <span>Length</span>
            </button>

            {/* NUMBER SENSE */}

            <button
              className="game-card"
              onClick={() => {
                setSelectedNumberSenseMenu(true);
                setSelectedNumberSenseActivity(null);
                setSelectedMathsGame(null);
                setSelectedLevel(null);
                setSelectedMoneyGame(false);
                setSelectedMoneyLevel(null);
                setSelectedMeasureGame(false);
                setSelectedMeasureLevel(null);
              }}
              type="button"
            >
              <div className="game-icon">🔢</div>
              <span>Number Sense</span>
            </button>
          </div>
        ) : selectedSubject === "English" ? (
          /* ENGLISH */

          <div className="game-tabs">
            <button
              className="english-lesson-card"
              onClick={() => {
                setSelectedEnglishTopic("tenali");
                setSelectedTenaliOption(null);
                setSelectedLionMouseOption(null);
              }}
              type="button"
            >
              <div className="english-lesson-icon">📖</div>
              <span>Tenali Rama and the Greedy Farmer</span>
            </button>

            <button
              className="english-lesson-card"
              onClick={() => {
                setSelectedEnglishTopic("lionMouse");
                setSelectedLionMouseOption(null);
                setSelectedTenaliOption(null);
              }}
              type="button"
            >
              <div className="english-lesson-icon">🦁</div>
              <span>The Lion and the Little Mouse</span>
            </button>
          </div>
        ) : selectedSubject === "Telugu" ? (
          /* TELUGU */

          <div className="game-tabs">
            <button
              className="game-card"
              onClick={() => {
                setSelectedTeluguOption("quiz");
                setSelectedTeluguQuizTopic(null);
              }}
              type="button"
            >
              <div className="game-icon">📝</div>
              <span>Quiz</span>
            </button>
          </div>
        ) : (
          <div className="coming-soon">
            <p>Games for {selectedSubject} will be added here.</p>
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
        type="button"
      >
        ← BACK
      </button>

      <h1 className="new-title">Learning App</h1>

      <div className="subject-grid">
        {/* TELUGU */}

        <button
          className="subject-card"
          onClick={() => setSelectedSubject("Telugu")}
          type="button"
        >
          <span className="subject-icon">తెలుగు</span>
          <span className="subject-name">Telugu</span>
        </button>

        {/* ENGLISH */}

        <button
          className="subject-card"
          onClick={() => setSelectedSubject("English")}
          type="button"
        >
          <span className="subject-icon">A B C</span>
          <span className="subject-name">English</span>
        </button>

        {/* MATHS */}

        <button
          className="subject-card"
          onClick={() => setSelectedSubject("Maths")}
          type="button"
        >
          <span className="subject-icon">123</span>
          <span className="subject-name">Maths</span>
        </button>

        {/* EVS */}

        <button
          className="subject-card"
          onClick={() => setSelectedSubject("EVS")}
          type="button"
        >
          <span className="subject-icon">🌱</span>
          <span className="subject-name">EVS</span>
        </button>
      </div>
    </div>
  );
}

export default NewHome;