import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CompareTest.css";
import Navbar from "./Navbar";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function CompareTest() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [selectedTime, setSelectedTime] = useState(5);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const navigate = useNavigate();
  const location = useLocation();
  const retryQuestion = location?.state?.retryQuestion;

  const finishTest = useCallback(() => {
    navigate("/result/compare", { state: { answers } });
  }, [navigate, answers]);

  const startTest = () => {
    if (retryQuestion && retryQuestion.question) {
      const [left, , right] = retryQuestion.question.split(" ");
      const qn = {
        left: parseInt(left),
        right: parseInt(right),
        correct: retryQuestion.correct,
      };
      setQuestions([qn]);
    } else {
      const qns = Array.from({ length: 10 }, () => {
        const a = rand(1, 9);
        const b = rand(1, 9);
        const correct = a > b ? ">" : a < b ? "<" : "=";
        return { left: a, right: b, correct };
      });
      setQuestions(qns);
    }
    setTimeLeft(selectedTime * 60);
    setTestStarted(true);
    setQuestionStartTime(Date.now());
  };

  useEffect(() => {
    if (!testStarted || timeLeft <= 0) {
      if (testStarted && timeLeft <= 0) finishTest();
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, testStarted, finishTest]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const submitAnswer = () => {
    if (!selectedSymbol) {
      alert("Please select a symbol before proceeding.");
      return;
    }

    const current = questions[currentIndex];
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);

    setAnswers((prev) => [
      ...prev,
      {
        question: `${current.left} ? ${current.right}`,
        selected: selectedSymbol,
        correct: current.correct,
        isCorrect: selectedSymbol === current.correct,
        time: timeTaken,
      },
    ]);

    if (currentIndex === questions.length - 1) {
      finishTest();
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedSymbol("");
      setQuestionStartTime(Date.now());
    }
  };

  if (!testStarted) {
    return (
      <>
        <Navbar />
        <div className="test-container">
          <h2 className="test-title">🧠 Select Test Duration</h2>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(parseInt(e.target.value))}
            style={{ fontSize: "18px", padding: "8px", borderRadius: "6px" }}
          >
            {[...Array(12)].map((_, i) => {
              const min = (i + 1) * 5;
              return (
                <option key={min} value={min}>
                  {min} minutes
                </option>
              );
            })}
          </select>
          <br />
          <button
            onClick={startTest}
            className="test-submit-btn"
            style={{ marginTop: "20px" }}
          >
            ✅ Start Test
          </button>
        </div>
      </>
    );
  }

  if (questions.length === 0) return <p>Loading test...</p>;

  const current = questions[currentIndex];

  return (
    <div className="test-container">
      <Navbar />
      <h2 className="test-title">🧪 Test Mode – Compare the Numbers</h2>
      <div className="timer">⏰ Time Left: {formatTime(timeLeft)}</div>

      <div className="test-num-row">
        <span className="test-big-num">{current.left}</span>
        <span className="test-sym-box empty-box">
          {selectedSymbol || <span style={{ opacity: 0.4 }}>___</span>}
        </span>
        <span className="test-big-num">{current.right}</span>
      </div>

      <div className="test-sym-row">
        {["<", "=", ">"].map((sym) => (
          <div
            key={sym}
            className={`test-sym-box ${selectedSymbol === sym ? "picked" : ""}`}
            onClick={() => setSelectedSymbol(sym)}
          >
            {sym}
          </div>
        ))}
      </div>

      <button
        onClick={submitAnswer}
        className="test-submit-btn"
        style={{ marginTop: "20px" }}
      >
        ➡️ Next
      </button>

      <button
        onClick={finishTest}
        className="test-submit-btn"
        style={{
          marginTop: "14px",
          backgroundColor: "#f44336",
          position: "fixed",
          bottom: "24px",
          right: "24px",
        }}
      >
        ⛔ End Test
      </button>
    </div>
  );
}