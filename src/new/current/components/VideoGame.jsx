import { useState, useRef } from "react";
import "./VideoGame.css";

import video1 from "../assets/videos/bee.mp4";
import video2 from "../assets/videos/milk.mp4";

const videoData = [
  {
    video: video1,
    title: "Bee Video",

    questions: [
      {
        question: "Video lo ye purugu undi?",
        options: [
          "Thene purugu",
          "Aavu",
          "Pilli",
          "Chepa",
        ],
        answer: "Thene purugu",
      },
      {
        question: "Thene purugu ekkada kurchundi?",
        options: [
          "Puvvu meeda",
          "Chettu meeda",
          "Chair meeda",
          "Car meeda",
        ],
        answer: "Puvvu meeda",
      },
      {
        question: "Video lo puvvulu ye color lo unnayi?",
        options: [
          "Yellow",
          "Blue",
          "Purple",
          "Black",
        ],
        answer: "Yellow",
      },
      {
        question: "Thene purugu puvvula nundi em collect chestundi?",
        options: [
          "Nectar",
          "Water",
          "Milk",
          "Rice",
        ],
        answer: "Nectar",
      },
      {
        question: "Thene purugulu em tayaru chestayi?",
        options: [
          "Honey",
          "Juice",
          "Butter",
          "Bread",
        ],
        answer: "Honey",
      },
    ],
  },

  {
    video: video2,
    title: "Milk Video",

    questions: [
      {
        question: "Palu manaki ye jantuvu nundi vastayi?",
        options: [
          "Aavu",
          "Pilli",
          "Kukka",
          "Simham",
        ],
        answer: "Aavu",
      },
      {
        question: "Palu manam em cheyyadaniki use chestam?",
        options: [
          "Tagadaniki",
          "Adadaniki",
          "Rasadaniki",
          "Veyadaniki",
        ],
        answer: "Tagadaniki",
      },
      {
        question: "Aavu manaki em istundi?",
        options: [
          "Palu",
          "Honey",
          "Juice",
          "Rice",
        ],
        answer: "Palu",
      },
      {
        question: "Milk oka food item aa?",
        options: [
          "Avunu",
          "Kadu",
        ],
        answer: "Avunu",
      },
      {
        question: "Milk color enti?",
        options: [
          "White",
          "Red",
          "Green",
          "Blue",
        ],
        answer: "White",
      },
    ],
  },
];

function VideoGame({ onBack }) {
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoFinished, setVideoFinished] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [popupType, setPopupType] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  const popupTimer = useRef(null);
  const nextQuestionTimer = useRef(null);

  // =========================================
  // AUDIO FILES
  // =========================================

  const successAudio = useRef(
    new Audio("/sounds/success-1-6297.mp3")
  );

  const failAudio = useRef(
    new Audio("/sounds/fail-2-2777575.mp3")
  );

  const veryGoodAudio = useRef(
    new Audio("/sounds/very-good.mp3")
  );

  const tryAgainAudio = useRef(
    new Audio("/sounds/try-again.mp3")
  );

  const currentVideo = videoData[videoIndex];

  const currentQuestion =
    currentVideo.questions[questionIndex];

  // =========================================
  // PLAY AUDIO
  // =========================================

  const playAudio = (audio) => {
    audio.currentTime = 0;

    audio.play().catch(() => {});
  };

  // =========================================
  // CORRECT AUDIO
  // =========================================

  const playCorrectSounds = () => {
    // First play success sound
    playAudio(successAudio.current);

    // Then play "Very good"
    setTimeout(() => {
      playAudio(veryGoodAudio.current);
    }, 500);
  };

  // =========================================
  // WRONG AUDIO
  // =========================================

  const playWrongSounds = () => {
    // First play fail sound
    playAudio(failAudio.current);

    // Then play "Try again"
    setTimeout(() => {
      playAudio(tryAgainAudio.current);
    }, 500);
  };

  // =========================================
  // VIDEO FINISHED
  // =========================================

  const handleVideoEnd = () => {
    setVideoFinished(true);
  };

  // =========================================
  // SHOW POPUP
  // =========================================

  const showResultPopup = (type) => {
    if (popupTimer.current) {
      clearTimeout(popupTimer.current);
    }

    setPopupType(type);

    popupTimer.current = setTimeout(() => {
      setPopupType(null);
    }, 2500);
  };

  // =========================================
  // ANSWER
  // =========================================

  const handleAnswer = (answer) => {
    // Don't allow another click while popup is showing
    if (popupType) {
      return;
    }

    // =========================================
    // WRONG ANSWER
    // =========================================

    if (answer !== currentQuestion.answer) {
      showResultPopup("wrong");

      playWrongSounds();

      // Stay on the same question
      return;
    }

    // =========================================
    // CORRECT ANSWER
    // =========================================

    showResultPopup("success");

    playCorrectSounds();

    // Wait for popup before moving ahead
    nextQuestionTimer.current = setTimeout(() => {
      setPopupType(null);

      // -----------------------------------------
      // More questions in current video
      // -----------------------------------------

      if (
        questionIndex <
        currentVideo.questions.length - 1
      ) {
        setQuestionIndex(
          (previous) => previous + 1
        );

        return;
      }

      // -----------------------------------------
      // Current video completed
      // Go to next video
      // -----------------------------------------

      if (videoIndex < videoData.length - 1) {
        setVideoIndex(
          (previous) => previous + 1
        );

        setQuestionIndex(0);

        // New video should play
        setVideoFinished(false);

        return;
      }

      // -----------------------------------------
      // All videos completed
      // -----------------------------------------

      setGameCompleted(true);
    }, 2500);
  };

  // =========================================
  // RESET GAME
  // =========================================

  const resetGame = () => {
    if (popupTimer.current) {
      clearTimeout(popupTimer.current);
    }

    if (nextQuestionTimer.current) {
      clearTimeout(nextQuestionTimer.current);
    }

    setVideoIndex(0);
    setQuestionIndex(0);
    setVideoFinished(false);
    setPopupType(null);
    setGameCompleted(false);

    // Stop currently playing sounds
    successAudio.current.pause();
    failAudio.current.pause();
    veryGoodAudio.current.pause();
    tryAgainAudio.current.pause();

    successAudio.current.currentTime = 0;
    failAudio.current.currentTime = 0;
    veryGoodAudio.current.currentTime = 0;
    tryAgainAudio.current.currentTime = 0;
  };

  // =========================================
  // COMPLETED SCREEN
  // =========================================

  if (gameCompleted) {
    return (
      <div className="video-game">

        <button
          className="video-back-button top-left"
          onClick={onBack}
        >
          ← BACK
        </button>

        <button
          className="video-reset-button top-right"
          onClick={resetGame}
        >
          🔄 RESET
        </button>

        <div className="completion-box">

          <div className="completion-icon">
            🎉
          </div>

          <h1>Super!</h1>

          <p>
            Anni videos mariyu questions
            complete chesavu!
          </p>

          <div className="video-game-buttons">

            <button
              className="video-reset-button"
              onClick={resetGame}
            >
              🔄 PLAY AGAIN
            </button>

            <button
              className="video-back-button"
              onClick={onBack}
            >
              ← BACK
            </button>

          </div>

        </div>
      </div>
    );
  }

  // =========================================
  // MAIN SCREEN
  // =========================================

  return (
    <div className="video-game">

      {/* TOP BACK BUTTON */}

      <button
        className="video-back-button top-left"
        onClick={onBack}
      >
        ← BACK
      </button>

      {/* TOP RESET BUTTON */}

      <button
        className="video-reset-button top-right"
        onClick={resetGame}
      >
        🔄 RESET
      </button>

      {/* TITLE */}

      <h1>
        Video Based Comprehension
      </h1>

      <div className="video-progress">
        Video {videoIndex + 1} of{" "}
        {videoData.length}
      </div>

      {/* =====================================
          VIDEO
      ====================================== */}

      <div className="video-container">

        <video
          key={currentVideo.video}
          className="main-video"
          controls
          onEnded={handleVideoEnd}
        >
          <source
            src={currentVideo.video}
            type="video/mp4"
          />

          Your browser does not support
          video playback.
        </video>

        <p className="video-message">
          Video ni carefully choodu.
        </p>

      </div>

      {/* =====================================
          QUESTIONS
      ====================================== */}

      {videoFinished && (
        <div className="question-container">

          <div className="question-progress">
            Question {questionIndex + 1} of{" "}
            {currentVideo.questions.length}
          </div>

          <h2>
            {currentQuestion.question}
          </h2>

          <div className="answer-options">

            {currentQuestion.options.map(
              (option) => (
                <button
                  key={option}
                  className="answer-button"
                  onClick={() =>
                    handleAnswer(option)
                  }
                  disabled={
                    popupType !== null
                  }
                >
                  {option}
                </button>
              )
            )}

          </div>

        </div>
      )}

      {/* =====================================
          WAITING MESSAGE
      ====================================== */}

      {!videoFinished && (
        <p className="question-wait-message">
          Video ayyaka questions vastayi.
        </p>
      )}

      {/* =====================================
          RESULT POPUP
      ====================================== */}

      {popupType && (
        <div className="result-popup-overlay">

          <div
            className={`result-popup ${
              popupType === "success"
                ? "success-popup"
                : "wrong-popup"
            }`}
          >

            {popupType === "success" ? (
              <>
                <div className="result-icon">
                  🎉
                </div>

                <h2>
                  Super!
                </h2>

                <p>
                  Correct answer!
                </p>
              </>
            ) : (
              <>
                <div className="result-icon">
                  ❌
                </div>

                <h2>
                  Malli try cheyu!
                </h2>

                <p>
                  Try again!
                </p>
              </>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default VideoGame;