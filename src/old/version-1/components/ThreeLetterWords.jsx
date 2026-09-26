import React, { useState } from 'react';
import './PhonicsPage.css';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";

const initialWordSets = {
  a: ["cat", "bat", "mat", "rat", "sat", "pat", "cap", "map", "tap", "gap",
      "nap", "jam", "man", "fan", "bag", "tag", "wag", "lap", "cab", "dad",
      "pad", "van", "ram", "can", "sap", "had", "bad", "lad", "mad", "yam"],
  e: ["bed", "red", "led", "net", "pet", "ten", "pen", "men", "hen", "den",
      "fed", "bet", "vet", "wet", "peg", "leg", "set", "get", "yet", "met",
      "zed", "jet", "let", "web", "gem", "ned", "hem", "beg", "ken", "lex"],
  i: ["big", "dig", "fig", "pig", "wig", "hit", "bit", "kit", "lit", "sit",
      "zip", "tip", "dip", "rip", "lid", "kid", "mid", "fin", "win", "bin",
      "tin", "jib", "nip", "pip", "him", "rim", "sib", "gig", "hip", "vim"],
  o: ["cot", "dot", "hot", "lot", "pot", "rot", "top", "hop", "mop", "pop",
      "log", "dog", "bog", "fog", "jog", "sob", "job", "cob", "rob", "nod",
      "pod", "mom", "tom", "rod", "cop", "cod", "don", "got", "pox", "con"],
  u: ["cub", "tub", "rub", "hub", "sub", "bug", "dug", "mug", "rug", "jug",
      "sun", "fun", "run", "bun", "gun", "nun", "cut", "nut", "hut", "but",
      "mud", "bud", "pug", "gum", "pup", "lug", "cup", "sup", "tug", "fud"]
};

function generate3LetterWords(vowel, count) {
  const consonants = "bcdfghjklmnpqrstvwxyz";
  const words = [];
  while (words.length < count) {
    const c1 = consonants[Math.floor(Math.random() * consonants.length)];
    const c2 = consonants[Math.floor(Math.random() * consonants.length)];
    const word = c1 + vowel + c2;
    if (!words.includes(word)) words.push(word);
  }
  return words;
}

const ThreeLetterWords = () => {
  const navigate = useNavigate();
  const [wordSets, setWordSets] = useState(initialWordSets);
  const [selected, setSelected] = useState('a');
  const [page, setPage] = useState(0);
  const [rate, setRate] = useState(1);
  const [wordsPerPage, setWordsPerPage] = useState(42);

  const words = wordSets[selected] || [];
  const totalPages = Math.ceil(words.length / wordsPerPage);
  const start = page * wordsPerPage;
  const end = start + wordsPerPage;
  const visibleWords = words.slice(start, end);

  const speakWord = (word) => {
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = 'en-IN';
    utter.rate = rate;
    speechSynthesis.speak(utter);
  };

  const handleNext = () => {
    const nextPage = page + 1;
    const requiredLength = (nextPage + 1) * wordsPerPage;
    if (words.length < requiredLength) {
      const newWords = generate3LetterWords(selected, wordsPerPage);
      setWordSets((prev) => ({
        ...prev,
        [selected]: [...prev[selected], ...newWords]
      }));
    }
    setPage(nextPage);
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleSetChange = (letter) => {
    setSelected(letter);
    setPage(0);
    document.getElementById("sidebar").classList.remove("show");
    document.querySelector(".overlay")?.classList.remove("show");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const cols = 7;
    const spacing = 25;
    const radius = 10;
    const startX = 20;
    const startY = 50;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("READ & DAB", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Read and dab the words with the correct sound.", 105, 30, { align: "center" });

    doc.setFontSize(10);
    doc.setLineWidth(0.5);
    for (let i = 0; i < visibleWords.length; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = startX + col * spacing;
      const y = startY + row * spacing;

      doc.circle(x, y, radius);
      doc.text(visibleWords[i], x, y + 3.5, { align: "center" });
    }

    doc.save(`${selected}_read_and_dab.pdf`);
  };

  return (
    <div>
      <div className="navbar">
        <div className="nav-left">
          <span className="hamburger" onClick={() => document.getElementById('sidebar').classList.toggle('show')}>
            &#9776;
          </span>
          <button onClick={() => navigate("/")} style={{ marginLeft: "20px", padding: "8px 12px", borderRadius: "8px", border: "none", backgroundColor: "#f0f0f0", cursor: "pointer", fontWeight: "bold" }}>Home</button>
          </div>
        <div className="nav-center">3-Letter Blending</div>
       <div className="nav-right">
  <label>Speed:</label>
  <select value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}>
    {[0.05, 0.25, 0.5, 0.75, 1, 1.25].map(v => <option key={v} value={v}>{v}x</option>)}
  </select>
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "10px" }}>
    <label>Words:</label>
    <select value={wordsPerPage} onChange={(e) => { setWordsPerPage(parseInt(e.target.value)); setPage(0); }}>
      {[6, 12, 24, 36, 42, 60].map(n => <option key={n} value={n}>{n}</option>)}
    </select>
    <button onClick={downloadPDF} style={{ padding: "6px 12px", fontSize: "14px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
      📄 PDF
    </button>
  </div>
</div>

      </div>

      <div id="sidebar" className="sidebar">
        {Object.keys(wordSets).map(letter => (
          <button key={letter} onClick={() => handleSetChange(letter)}>{letter}</button>
        ))}
      </div>

      <div className="overlay" onClick={() => document.getElementById('sidebar').classList.remove('show')}></div>

      <div className="word-grid">
        {visibleWords.map((word, idx) => (
          <div key={idx} className="word-box" onClick={() => speakWord(word)}>{word}</div>
        ))}
      </div>

      <div className="pagination-controls">
        <button onClick={handlePrev} disabled={page === 0}>⬅ Prev</button>
        <span>Page {page + 1}</span>
        <button onClick={handleNext}>Next ➡</button>
      </div>
    </div>
  );
};

export default ThreeLetterWords;