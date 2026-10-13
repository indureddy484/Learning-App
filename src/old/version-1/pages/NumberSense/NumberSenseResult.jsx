import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const answers = state?.answers || [];
  const totalTime = state?.timeTaken || 0;
  const correct = answers.filter((a) => a.isCorrect).length;
  const minutes = String(Math.floor(totalTime / 60)).padStart(2, "0");
  const seconds = String(totalTime % 60).padStart(2, "0");

  // 🟡 Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(answers.length / pageSize);
  const paginatedAnswers = answers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="result-container">
      <h2 className="result-title">🎉 Quiz Completed!</h2>

      <div className="score-box">
        Score: {correct} / {answers.length}
      </div>

      <div className="time-box">
        Time Taken: {minutes}:{seconds}
      </div>

      <div className="test-sym-row">
        <button className="test-sym-box" onClick={() => navigate("/")}>
          <span className="icon" role="img" aria-label="home">🏠</span>
          <span className="label">Home</span>
        </button>

        <button className="test-sym-box" onClick={() => navigate("/numbersense")}>
          <span className="icon" role="img" aria-label="retry">🔁</span>
          <span className="label">Retry</span>
        </button>
      </div>

      <div className="answers-list">
        {paginatedAnswers.map((ans, i) => (
          <div key={i} className={`answer-block ${ans.isCorrect ? "correct" : "wrong"}`}>
            <div className="answer-question">
              <strong>Q{(page - 1) * pageSize + i + 1}:</strong> {ans.question}
            </div>
            <div>✅ Correct Answer: {ans.correct}</div>
            <div>📝 Your Answer: {ans.selected}</div>
            <div>{ans.isCorrect ? "✔️ Correct" : "❌ Wrong"}</div>
          </div>
        ))}
      </div>

      {/* 🔁 Pagination Controls */}
      {answers.length > pageSize && (
        <div className="pagination-controls">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>⬅ Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next ➡</button>
        </div>
      )}

      <button className="retake-btn" onClick={() => navigate("/")}>
        🚀 Back to Start
      </button>
    </div>
  );
}
