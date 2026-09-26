import React, { useState } from 'react';
import './NameInput.css';

export default function NameInput({ onNameSubmit }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [speakerOn, setSpeakerOn] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && age) {
      onNameSubmit(name.trim(), parseInt(age) < 7 ? speakerOn : false);
    }
  };

  return (
    <div className="name-input-screen">
      <h2>👋 Welcome! Please enter your name:</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter your age..."
          min="1"
          max="20"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        {age && parseInt(age) < 7 && (
          <div className="speaker-toggle">
            <button
              type="button"
              className={`speaker-btn ${speakerOn ? 'on' : 'off'}`}
              onClick={() => setSpeakerOn(!speakerOn)}
            >
              {speakerOn ? '🔊 Speaker On' : '🔈 Speaker Off'}
            </button>
          </div>
        )}

        <button type="submit">Start Game 🚀</button>
      </form>
    </div>
  );
}
