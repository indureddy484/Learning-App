// src/components/QuizTopicScreen.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./QuizTopicScreen.css";

// Define topics by subject
const allTopics = {
  english: [
    { id: "howmany", label: "🔢 How Many?" },
    { id: "prepositions", label: "📍 Prepositions" },
    { id: "adjectives", label: "🎨 Adjectives" },
    { id: "misc", label: "🧠 Miscellaneous" }
  ],
  telugu: [
     { id: "howmany", label: "🔢 How Many?" },
    { id: "prepositions", label: "📍 Prepositions" },
    { id: "adjectives", label: "🎨 Adjectives" },
    { id: "misc", label: "🧠 Miscellaneous" }
  ]
};

const QuizTopicScreen = () => {
  const navigate = useNavigate();
  const { subject } = useParams();

  const topics = allTopics[subject?.toLowerCase()] || [];

  return (
    <div className="topic-screen">
      <button className="back-button-top-left" onClick={() => navigate("/")}>🏠</button>
      <h1 className="animated-title">🎯 {subject?.toUpperCase()} Quiz Topics</h1>

      <div className="topic-grid">
        {topics.map((topic) => (
          <button
            key={topic.id}
            className="topic-btn"
            onClick={() => navigate(`/quiz/${subject}/${topic.id}`)}
          >
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizTopicScreen;
