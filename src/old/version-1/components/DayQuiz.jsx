import React, { useState } from "react";
import confetti from "canvas-confetti";
import "./DayQuiz.css";
import { speak } from "../utils/speak";
import {useNavigate} from "react-router-dom";

const sfxRight = new Audio("/sounds/success-1-6297.mp3");
const sfxWrong = new Audio("/sounds/fail-2-277575.mp3");
const voiceRightSuhaas = new Audio("/sounds/very-good.mp3");
const voiceWrongSuhaas = new Audio("/sounds/try-again.mp3");

const dayQuestions = [
  {
    question: " MONDAY  TARAWATHA  EM DAY VASTADI?",
    options: ["Sunday", "Tuesday", "Wednesday", "Sunday"],
    answer: "Tuesday",
  },
  {
    question: "THURSDAY MUNDU EM DAY VASTADI? ",
    options: ["Monday", "Tuesday", "Wednesday", "Friday"],
    answer: "Wednesday",
  },
  {
    question: " SUNDAY MUNDU EM DAY VASTADI? ",
    options: ["Thursday", "Friday", "Saturday", "Sunday"],
    answer: "Saturday",
  },
  {
    question: "TUESDAY TARAWATHA EM DAY VASTADI?",
    options: ["Monday", "Wednesday", "Thursday", "Friday"],
    answer: "Wednesday",
  },
  {
    question: "WEDNESDAY MUNDU EM DAY VASTADI?",
    options: ["Tuesday", "Thursday", "Friday", "Saturday"],
    answer: "Tuesday",
  },
  {
    question: "FRIDAY TARAWATHA EM DAY VASTADI?",
    options: ["Thursday", "Saturday", "Sunday", "Monday"],
    answer: "Saturday",
  },
  {
    question: "SATURDAY MUNDU EM DAY VASTADI?",
    options: ["Friday", "Sunday", "Monday", "Tuesday"],
    answer: "Friday",
  },
  {
    question: " IVALA THURSDAY. REPU EM DAY?",
    options: ["Friday", "Saturday", "Sunday", "Monday"],
    answer: "Friday",
  },
  {
    question: " IVALA FRIDAY. NINNA EM DAY?",
    options: ["Thursday", "Saturday", "Sunday", "Monday"],
    answer: "Thursday",
  }
];

export default function DayQuiz({ playerName = "Suhaas" }) {
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();
  const question = dayQuestions[quizIndex];

  const handleAnswer = (opt) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);

    if (opt === question.answer) {
      sfxRight.play();

      if (playerName.toLowerCase() === "suhaas") {
        voiceRightSuhaas.currentTime = 0;
        voiceRightSuhaas.play();
      } else {
        speak(`Very good ${playerName}`);
      }

      setShowVideo(true);
      setFeedback(`🎉 Very good ${playerName}!`);

      setTimeout(() => {
        confetti({ particleCount: 100, spread: 70 });
        setSelectedOpt("");
        setFeedback("");
        setShowVideo(false);

        if (quizIndex + 1 < dayQuestions.length) {
          setQuizIndex(quizIndex + 1);
        } else {
          setFeedback("🎊 Quiz Completed!");
        }
      }, 4000);
    } else {
      sfxWrong.play();

      if (playerName.toLowerCase() === "suhaas") {
        voiceWrongSuhaas.currentTime = 0;
        voiceWrongSuhaas.play();
      } else {
        speak(`Try again ${playerName}`);
      }

      setFeedback(`❌ Malli try cheyu ${playerName}!`);
      setTimeout(() => {
        setSelectedOpt("");
        setFeedback("");
      }, 3000);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-box">
        <div className="quiz-content">
          <button className="back-btn" onClick={() => navigate("/")}>🔙</button>
          <h2 className="quiz-question">{question.question}</h2>

          <div className="quiz-options">
            {question.options.map((opt, i) => {
              const isChosen = selectedOpt === opt;
              const isCorrect = isChosen && opt === question.answer;
              const isWrong = isChosen && opt !== question.answer;

              return (
                <button
                  key={i}
                  className={`quiz-option ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                  disabled={!!selectedOpt}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && <p className="quiz-feedback">{feedback}</p>}
        </div>
      </div>

      {showVideo && (
        <video
          autoPlay
          muted
          loop
          className="voice-character-right"
          style={{ width: "200px", borderRadius: "20px" }}
        >
          <source src="/videos/character-speak.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
