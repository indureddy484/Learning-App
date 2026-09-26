import React, { useState } from "react";
import "../components/PhonicsPage.css";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const initialWordSets = {
  ai: ["aid", "aim", "bait", "pail", "nail", "fail", "tail", "gain", "rain", "vain", "pain", "main"],
  oa: ["oats", "boat", "coat", "moan", "loan", "foam", "roam", "toad", "goat", "soap"],
  ie: ["died", "tied", "lies", "pier", "tier", "fier", "mien", "lief", "sies"],
  ee: ["beef", "need", "seed", "meet", "feet", "jeep", "peel", "reed", "heel", "seen"],
  or: ["lord", "fork", "cord", "born", "torn", "port", "sort", "word", "horn", "form"],
  oo: ["wood", "foot", "book", "cook", "look", "good", "hood", "moon", "roof", "boot"]
};

const PAGE_SIZE = 42;

function generatePatternWords(pattern, count) {
  const consonants = "bcdfghjklmnpqrstvwxyz";
  const words = [];

  while (words.length < count) {
    const c1 = consonants[Math.floor(Math.random() * consonants.length)];
    const c2 = consonants[Math.floor(Math.random() * consonants.length)];
    const word = c1 + pattern + c2;
    if (!words.includes(word)) words.push(word);
  }

  return words;
}

export default function FourLetterVowelBlends() {
  const navigate = useNavigate();
  const [rate, setRate] = useState(1);
  const [selectedSet, setSelectedSet] = useState("ai");
  const [page, setPage] = useState(0);
  const [wordSets, setWordSets] = useState(initialWordSets);
  const [pdfCount, setPdfCount] = useState(42); // number of words to export

  const currentWords = wordSets[selectedSet] || [];
  const totalPages = Math.ceil(currentWords.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const visibleWords = currentWords.slice(start, end);

  const speakWord = (word) => {
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = "en-IN";
    utter.rate = rate;
    speechSynthesis.speak(utter);
  };

  const handleNext = () => {
    const nextPage = page + 1;
    const wordsNeeded = (nextPage + 1) * PAGE_SIZE;

    if (currentWords.length < wordsNeeded) {
      const newWords = generatePatternWords(selectedSet, PAGE_SIZE);
      setWordSets((prev) => ({
        ...prev,
        [selectedSet]: [...prev[selectedSet], ...newWords]
      }));
    }

    setPage(nextPage);
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleSetChange = (key) => {
    setSelectedSet(key);
    setPage(0);
    document.getElementById("sidebar").classList.remove("show");
    document.querySelector(".overlay")?.classList.remove("show");
  };

  const downloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("READ & DAB", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text("Read the words with the correct sound.", 105, 30, { align: "center" });

  const cols = 7;
  const spacing = 25;
  const radius = 10;
  const wordsToPrint = visibleWords.slice(0, pdfCount);
  const startX = 25;
  const startY = 50;

  // Set font to bold
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  // Set line width for thicker circles
  doc.setLineWidth(0.6);

  for (let i = 0; i < wordsToPrint.length; i++) {
    const x = startX + (i % cols) * spacing;
    const y = startY + Math.floor(i / cols) * spacing;

    doc.circle(x, y, radius).stroke();
    doc.text(wordsToPrint[i], x, y + 3.5, { align: "center" });
  }

  doc.save(`${selectedSet}-read-and-sound.pdf`);
};


  return (
    <div>
      <div className="navbar">
        <div className="nav-left">
          <span
            className="hamburger"
            onClick={() => document.getElementById("sidebar").classList.toggle("show")}
          >
            &#9776;
          </span>
          <button
            onClick={() => navigate("/")}
            style={{
              marginLeft: "20px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Home
          </button>
        </div>

        <div className="nav-center">4-Letter Vowel Blends</div>

        <div className="nav-right">
          <label>Speed:</label>
          <select value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}>
            <option value="0.05">0.05x</option>
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
          </select>

          <label style={{ marginLeft: "10px" }}>Words:</label>
          <select value={pdfCount} onChange={(e) => setPdfCount(Number(e.target.value))}>
            <option value={28}>28</option>
            <option value={35}>35</option>
            <option value={42}>42</option>
            <option value={56}>56</option>
          </select>

          <button
            onClick={downloadPDF}
            style={{
              marginLeft: "10px",
              padding: "6px 12px",
              fontSize: "14px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            📄 PDF
          </button>
        </div>
      </div>

      <div className="sidebar" id="sidebar">
        {Object.keys(wordSets).map((key) => (
          <button key={key} onClick={() => handleSetChange(key)}>
            {key}
          </button>
        ))}
      </div>

      <div className="overlay" onClick={() => document.getElementById("sidebar").classList.remove("show")}></div>

      <div className="word-grid">
        {visibleWords.map((word, index) => (
          <div className="word-box" key={index} onClick={() => speakWord(word)}>
            {word}
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button onClick={handlePrev} disabled={page === 0}>⬅ Prev</button>
        <span>Page {page + 1}</span>
        <button onClick={handleNext}>Next ➡</button>
      </div>
    </div>
  );
}
