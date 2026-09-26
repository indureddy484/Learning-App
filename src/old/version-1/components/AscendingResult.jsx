import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./AscendingTest.css";

export default function AscendingResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const answers = state?.answers || [];

  const [retryingQuestion, setRetryingQuestion] = useState(null);
  const [retryInput, setRetryInput] = useState(["", "", ""]);
  const [retryFeedback, setRetryFeedback] = useState("");
  const [retrySubmitted, setRetrySubmitted] = useState(false);
  const [picked, setPicked] = useState(null);

  const correct = answers.filter((a) => a.isCorrect).length;
  const totalTimeTaken = answers.reduce((acc, curr) => acc + (curr.time || 1), 0);
  const minutes = String(Math.floor(totalTimeTaken / 60)).padStart(2, "0");
  const seconds = String(totalTimeTaken % 60).padStart(2, "0");

  const handleRetryClick = (a) => {
    setRetryingQuestion(a);
    setRetryInput(["", "", ""]);
    setRetryFeedback("");
    setRetrySubmitted(false);
    setPicked(null);
  };

  const handleDrop = (index) => {
    if (picked === null || retryInput[index]) return;
    const copy = [...retryInput];
    copy[index] = picked;
    setRetryInput(copy);
    setPicked(null);
  };

  return (
    <div className="test-container">
      <Navbar />
      <h2>🎯 Ascending Order Results</h2>
      <div style={{ fontSize: "20px", marginBottom: "16px" }}>
        ✅ Score: {correct} / {answers.length}
      </div>
      <div style={{ fontSize: "18px", marginBottom: "20px" }}>
        🕒 Total Time Taken: {minutes}:{seconds}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {answers.map((a, i) => {
          const isRetrying = retryingQuestion === a;
          const qTime = a.time || 1;
          const questionArray = a.question.split(",").map(num => num.trim());

          return (
            <div
              key={i}
              className={`answer-block ${a.isCorrect ? "correct" : "wrong"}`}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p><strong>Q{i + 1}:</strong></p>
              <div style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                {questionArray.map((num, idx) => (
                  <button
                    key={idx}
                    style={{
                      padding: "10px 16px",
                      fontSize: "20px",
                      border: "2px solid #555",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      textAlign: "center",
                      backgroundColor: picked === num ? "#cde" : "#fff",
                      cursor: "pointer"
                    }}
                    onClick={() => setPicked(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {isRetrying ? (
                <>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                    {[0, 1, 2].map((idx) => (
                      <div
                        key={idx}
                        className="order-slot"
                        onClick={() => handleDrop(idx)}
                        style={{
                          width: "200px",
                          height: "60px",
                          fontSize: "22px",
                          textAlign: "center",
                          lineHeight: "60px",
                          border: "2px dashed #888",
                          borderRadius: "6px",
                          cursor: "pointer",
                          backgroundColor: retryInput[idx] ? "#e0f7fa" : "#fff"
                        }}
                      >
                        {retryInput[idx] || ""}
                      </div>
                    ))}
                  </div>

                  <button
                    className="retry-submit-btn"
                    onClick={() => {
                      setRetrySubmitted(true);
                      const submittedAnswer = retryInput.join(", ");
                      if (submittedAnswer === a.correct.trim()) {
                        setRetryFeedback("✅ Correct!");
                      } else {
                        setRetryFeedback("❌ Incorrect.");
                      }
                    }}
                  >
                    Check Answer
                  </button>

                  {retrySubmitted && (
                    <>
                      <p style={{ marginTop: "8px", fontWeight: "bold" }}>{retryFeedback}</p>
                      <p>Your Answer: {retryInput.join(", ")}</p>
                      <p>Correct Answer: {a.correct}</p>
                      <p>🕒 Time Taken: {qTime}s</p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p>Your Answer: {a.selected}</p>
                  <p>Correct Answer: {a.correct}</p>
                  <p>🕒 Time Taken: {qTime}s</p>
                  {!a.isCorrect && (
                    <button
                      className="retry-single-btn"
                      onClick={() => handleRetryClick(a)}
                    >
                      🔁 Retry
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/ascending-test")}
        style={{
          fontSize: "20px",
          padding: "12px 24px",
          marginTop: "24px",
          backgroundColor: "#2196f3",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🔁 Retake Test
      </button>
    </div>
  );
}