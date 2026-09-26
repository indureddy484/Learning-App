import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { manualLevel1Questions } from "../../utils/manualLevel1Questions";
import "./NumberQuiz.css";

// Shuffle utility
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const NumberQuiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [printCount, setPrintCount] = useState(10);
  const [maxTime, setMaxTime] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    const shuffled = shuffleArray(manualLevel1Questions).slice(0, 50);
    setQuestions(shuffled);
  }, []);

  useEffect(() => {
    if (!timerStarted) return;
    const timer = setInterval(() => {
      setTimeTaken((prev) => {
        if (prev >= maxTime) {
          clearInterval(timer);
          endTest();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerStarted, maxTime]);

  const currentQ = questions[current];

  const handleSubmitAnswer = () => {
    if (!currentQ) return;
    const isCorrect = selected === currentQ.answer;
    const answerObj = {
      question: currentQ.question,
      selected,
      correct: currentQ.answer,
      isCorrect,
    };
    setAnswers((prev) => [...prev, answerObj]);
    setSelected(null);

    setCurrent((prev) => prev + 1);
  };

  const endTest = () => {
    setTimerStarted(false);
    navigate("/result/numberquiz", {
  state: {
    answers,
    timeTaken,
    type: "numbersense", // 👈 this connects to the retry path
  },
});


  };

  const handlePrintQuestions = () => {
    const doc = new jsPDF();
    doc.setFont("courier");
    doc.setFontSize(18);
    let y = 45;
    const gap = 8;
    const qs = shuffleArray(manualLevel1Questions).slice(0, printCount);

    qs.forEach((q, i) => {
      doc.text(`${i + 1}. ${q.question}`, 20, y);
      y += gap;
      q.options.forEach((opt, idx) => {
        const optLabel = String.fromCharCode(97 + idx) + ")";
        doc.text(`${optLabel} ${opt}`, 30, y);
        y += gap;
      });
      y += 4;
      if ((i + 1) % 5 === 0 && i !== qs.length - 1) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("number_sense_te_en.pdf");
  };

  const minutes = Math.floor(timeTaken / 60);
  const seconds = String(timeTaken % 60).padStart(2, "0");

  return (
    <div className="quiz-container">
      <h2>🧠 Number Sense Quiz  For Aarush </h2>
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅️
      </button>

      <div className="print-controls">
        <label>
          🖨️ <strong>Print Count:</strong>
          <input
            type="number"
            min={1}
            max={50}
            value={printCount}
            onChange={(e) => setPrintCount(parseInt(e.target.value))}
          />
        </label>
        <button onClick={handlePrintQuestions} className="print-btn">
          📄 Print Worksheet
        </button>
      </div>

      {!timerStarted ? (
        <div style={{ marginTop: "20px", fontSize: "18px" }}>
          <label>
            ⏰ <h3>Select Timer:</h3>{" "}
            <select
              value={maxTime}
              onChange={(e) => {
                const time = parseInt(e.target.value);
                setMaxTime(time);
                setTimeTaken(0);
                setTimerStarted(true);
              }}
            >
              <option value={0} disabled>
                -- Select --
              </option>
              {[2, 5, 10, 15, 20, 30, 45, 60].map((min) => (
                <option key={min} value={min * 60}>
                  {min} Minutes
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <div style={{ marginTop: "20px", fontSize: "18px" }}>
          <span style={{ fontWeight: "bold", color: "red" }}>
            ⏳ Time: {minutes}:{seconds}
          </span>
          <button onClick={endTest} className="stop-btn">
            ⏹️ Stop Quiz
          </button>
        </div>
      )}

      {currentQ ? (
        <>
          <p>Question {current + 1}</p>
          <h3 style={{ whiteSpace: "pre-line" }}>{currentQ.question}</h3>

          <div className="options">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(opt)}
                className={`option-btn ${selected === opt ? "selected" : ""}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            className="submit-btn"
            onClick={handleSubmitAnswer}
            disabled={selected === null}
          >
            Submit Answer
          </button>

          <button className="final-submit-btn" onClick={endTest}>
            ✅ Submit Test
          </button>
        </>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
};

export default NumberQuiz;
