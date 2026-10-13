import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./AscendingTest.css";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function AscendingTest() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [selected, setSelected] = useState(["", "", ""]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [selectedTime, setSelectedTime] = useState(5);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  const finishTest = useCallback(() => {
    navigate("/ascending-result", { state: { answers } });
  }, [navigate, answers]);

  const startTest = () => {
    const qns = Array.from({ length: 5 }, () => {
      const nums = [];
      while (nums.length < 3) {
        const r = rand(1, 9);
        if (!nums.includes(r)) nums.push(r);
      }
      return nums;
    });
    setQuestions(qns);
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

  const handlePick = (n) => {
    setPicked(n);
  };

  const handleDrop = (index) => {
    if (picked === null || selected[index]) return;
    const copy = [...selected];
    copy[index] = picked;
    setSelected(copy);
    setPicked(null);
  };

  const submitAnswer = () => {
    const currentQ = questions[currentIndex];
    const sorted = [...currentQ].sort((a, b) => a - b);
    const correct = sorted.every((n, i) => selected[i] === n);
    const timeTaken = questionStartTime ? Math.floor((Date.now() - questionStartTime) / 1000) : 1;

    setAnswers((prev) => [
      ...prev,
      {
        question: currentQ.join(", "),
        selected: selected.join(", "),
        correct: sorted.join(", "),
        isCorrect: correct,
        time: timeTaken,
      },
    ]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(["", "", ""]);
      setPicked(null);
      setQuestionStartTime(Date.now());
    } else {
      finishTest();
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

  if (!questions.length) return null;
  const nums = questions[currentIndex];

  return (
    <div className="test-container">
      <h2 className="test-title">🔢 Arrange in Ascending Order</h2>
      <div className="timer">⏰ Time Left: {formatTime(timeLeft)}</div>

      <div className="num-buttons">
        {nums.map((n, idx) => (
          <button
            key={idx}
            className={`num-btn ${picked === n ? "picked" : ""}`}
            onClick={() => handlePick(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="order-row">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`order-slot ${selected[i] ? "filled" : ""}`}
            onClick={() => handleDrop(i)}
          >
            {selected[i] || ""}
          </div>
        ))}
      </div>

      <button
        onClick={submitAnswer}
        disabled={selected.includes("")}
        className="test-submit-btn"
        style={{ marginTop: "20px" }}
      >
        ➡️ Next
      </button>

      <button
        onClick={finishTest}
        className="test-submit-btn end-test-btn"
      >
        ⛔ End Test
      </button>
    </div>
  );
}