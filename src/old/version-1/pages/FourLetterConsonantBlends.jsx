import React, { useState } from "react";
import "../components/PhonicsPage.css";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const PAGE_SIZE_OPTIONS = [6, 12, 24, 36, 42, 60];

const initialWordSets = {
      con_l_vow_c: ["clap", "clog", "club", "clam", "clip", "clad", "clop", "clot", "clue", "clay", "clew", "clag", "clan", "claw", "clef", "clop", "clog", "clum", "clim", "clib", "clen", "cled", "clit", "clun", "clab", "clep", "clom", "clux", "claz", "claf", "clup", "clow", "clid", "clor", "clat", "clex", "cled", "clag", "clix", "clav"],
      con_vow_con_s: ["bats", "cuts", "dips", "gaps", "hops", "lips", "maps", "naps", "pits", "rips", "tops", "vets", "zips", "wets", "jots", "kegs", "mops", "nuts", "wigs", "yaks", "hats", "hips", "cups", "mats", "taps", "tips", "yaps", "pats", "kips", "zaps", "laps", "sips", "wags", "buns", "bins", "rugs", "bugs", "nips", "cogs", "logs"],
      con_vow_m_t: ["bent", "mint", "pant", "rant", "sent", "tent", "went", "lent", "kent", "cent", "hint", "lint", "tint", "vent", "font", "hunt", "punt", "dent", "zest", "cost", "last", "cast", "vast", "pest", "rest", "nest", "fest", "jest", "test", "best", "mast", "bust", "must", "dust", "lust", "list", "mist", "gist", "fist", "wist"],
      con_vow_m_t_d: ["damp", "dent", "dump", "lamp", "band", "land", "send", "bend", "fund", "hand", "lend", "tend", "wind", "bond", "pond", "kind", "mind", "mend", "sand", "bind", "find", "wand", "fond", "bold", "cold", "gold", "hold", "told", "fold", "sold", "wild", "mild", "rend", "meld", "peld", "zeld", "cend", "gild", "lend"],
      s_k_vow_con: ["skit", "skip", "skid", "skin", "skan", "skun", "skat", "skop", "skud", "skep", "skib", "skot", "skeg", "skam", "skil", "skab", "skaf", "skum", "skaz", "skex", "skir", "skup", "skod", "skov", "skew", "skyl", "skor", "skon", "skap", "skag", "skad", "skub", "sket", "skil", "skax", "skav", "skas", "skew", "skox", "skur"],
      con_vow_m_k: ["bark", "bank", "bulk", "funk", "honk", "junk", "lank", "link", "pink", "rink", "sank", "tank", "wink", "yank", "zonk", "monk", "bonk", "bunk", "dunk", "punk", "gunk", "hunk", "junk", "kink", "mink", "sink", "zink", "vink", "zunk", "nunk", "runk", "cank", "rank", "lunk", "munk", "bork", "lork"],
      s_c_vow_con: ["scan", "scar", "scab", "scam", "scud", "scum", "scop", "scot", "scat", "scap", "scag", "scow", "scog", "scub", "scob", "scil", "scav", "scad", "scet", "scel", "scaf", "scod", "scok", "scul", "scux", "scer", "scir", "scit", "scep", "scut", "scis", "scek", "scuv", "scax", "scem", "scog", "scol", "scow", "scil", "scir"],
      con_r_vow_con: ["brat", "brag", "bred", "crib", "crop", "trap", "drip", "grip", "grab", "grim", "gram", "crab", "drop", "frog", "from", "trot", "trod", "trip", "tram", "drag", "drab", "drug", "drum", "trim", "prim", "pram", "brog", "brim", "grog", "grub", "grin", "brim", "brad", "trop", "tron", "trug", "braw", "grap", "trig", "brux"],
      con_vow_s_k: ["bask", "desk", "disk", "mask", "risk", "task", "tusk", "husk", "cask", "dusk", "mosk", "zask", "lusk", "pask", "nusk", "rusk", "wisk", "gask", "jusk", "vask", "kask", "fisk", "yask", "bisk", "qisk", "zusk", "vusk", "musk", "susk", "sisk", "sosk", "bosk", "fosk", "nask", "losk", "kusk"],
      con_vow_n_k: ["bank", "bonk", "bunk", "dunk", "honk", "junk", "monk", "tank", "yank", "zonk", "wink", "sank", "lank"],
      con_vow_f_t: [ "left", "loft", "gift", "waft", "haft", "lift", "rift", "soft", "daft", "tuft","heft", "pift", "nift", "cift", "bift", "toft", "deft", "zift", "kift", "wift", "mift", "yift", "xift", "sift", "gaft", "vift", "hilt", "raft", "zift", "lapt"],
      s_p_vow_con: [
  "spin", "span", "spot", "spit", "sped", "spam", "spun", "spat", "spog", "spak",
  "span", "spod", "spol", "spel", "spom", "spug", "spun", "spet", "spix", "spop",
  "spum", "spit", "spad", "spun", "spug", "spom", "spiv", "spik", "spen", "spud"
],
      p_l_vow_con: [
  "plan", "plot", "plug", "plop", "plod", "play", "plea", "plow", "plum", "plak",
  "plet", "plim", "plog", "pluf", "plas", "plop", "plak", "pliz", "plex", "plin",
  "plab", "plaz", "plam", "plen", "plax", "pleb", "plor", "pluk", "plem", "plik"
],    con_vow_m_p: [
  "jump", "lamp", "temp", "bump", "dump", "camp", "comp", "ramp", "hump", "limp",
  "damp", "gimp", "wimp", "romp", "simp", "tamp", "yomp", "zump", "nump", "kump",
  "lomp", "fump", "bamp", "vamp", "jomp", "mump", "pimp", "hamp", "bomp", "gump"
],
digraph_ch: ["chip", "chat", "chin", "chop", "chug", "chick", "check", "chess", "cham"],
  digraph_sh: ["ship", "shop", "shed", "shut", "shun", "shag", "sham", "shin"],
  digraph_th: ["thin", "that", "them", "then", "math", "path", "bath", "with"],
  digraph_wh: ["when", "whip", "whim", "whiz", "whop", "wham", "whup", "whid"],
  digraph_ph: ["phone", "photo", "phase", "graph", "phantom", "nephew", "alpha"]
}; 

const PAGE_SIZE = 42;

// Generate words based on the selected pattern
function generateBlendWords(key, count) {
  const vowels = "aeiou";
  const consonants = "bcdfghjklmnpqrstvwxyz";
  const words = [];

  while (words.length < count) {
    const V = vowels[Math.floor(Math.random() * vowels.length)];
    const C1 = consonants[Math.floor(Math.random() * consonants.length)];
    const C2 = consonants[Math.floor(Math.random() * consonants.length)];

    let word = "";

    switch (key) {
      case "con_l_vow_c":
        word = "cl" + V + C1;
        break;
      case "con_vow_con_s":
        word = C1 + V + C2 + "s";
        break;
      case "con_vow_m_t":
        word = C1 + V + "n" + "t";
        break;
      case "con_vow_m_t_d":
        word = C1 + V + "n" + "d";
        break;
      case "s_k_vow_con":
        word = "sk" + V + C1;
        break;
      case "con_vow_m_k":
        word = C1 + V + "n" + "k";
        break;
      case "s_c_vow_con":
        word = "sc" + V + C1;
        break;
      case "con_r_vow_con":
        word = "br" + V + C1;
        break;
      case "con_vow_s_k":
        word = C1 + V + "s" + "k";
        break;
      case "con_vow_n_k":
        word = C1 + V + "n" + "k";
        break;
      case "con_vow_f_t":
        word = C1 + V + "f" + "t";
        break;
      case "s_p_vow_con":
        word = "sp" + V + C1;
        break;
      case "p_l_vow_con":
        word = "pl" + V + C1;
        break;
      case "con_vow_m_p":
        word = C1 + V + "m" + "p";
        break;
      case "digraph_ch":
    word = "ch" + V + C1;
    break;
  case "digraph_sh":
    word = "sh" + V + C1;
    break;
  case "digraph_th":
    word = "th" + V + C1;
    break;
  case "digraph_wh":
    word = "wh" + V + C1;
    break;
  case "digraph_ph":
    word = "ph" + V + C1;
    break;
      default:
        word = C1 + V + C2 + "x"; // fallback
    }

    if (!words.includes(word)) words.push(word);
  }

  return words;
}

export default function FourLetterConsonantBlends() {
  const navigate = useNavigate();
  const [selectedSet, setSelectedSet] = useState("con_l_vow_c");
  const [rate, setRate] = useState(1);
  const [page, setPage] = useState(0);
  const [wordsPerPage, setWordsPerPage] = useState(42);
  const [wordSets, setWordSets] = useState(initialWordSets);

  const words = wordSets[selectedSet] || [];
  const totalPages = Math.ceil(words.length / wordsPerPage);
  const start = page * wordsPerPage;
  const end = start + wordsPerPage;
  const visibleWords = words.slice(start, end);

  const speakWord = (word) => {
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = "en-IN";
    utter.rate = rate;
    speechSynthesis.speak(utter);
  };

  const handleNext = () => {
    const nextPage = page + 1;
    const needed = (nextPage + 1) * wordsPerPage;
    if (words.length < needed) {
      const newWords = generateBlendWords(selectedSet, wordsPerPage);
      setWordSets((prev) => ({
        ...prev,
        [selectedSet]: [...(prev[selectedSet] || []), ...newWords],
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
    const cols = 7;
    const spacing = 25;
    const radius = 10;
    const startX = 20;
    const startY = 50;
    const wordsToPrint = visibleWords.slice(0, wordsPerPage);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("READ & DAB", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Read and dab the words with the correct sound.", 105, 30, { align: "center" });

    doc.setFontSize(10);
    doc.setLineWidth(0.5);
    for (let i = 0; i < wordsToPrint.length; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = startX + col * spacing;
      const y = startY + row * spacing;
      doc.circle(x, y, radius);
      doc.text(wordsToPrint[i], x, y + 3.5, { align: "center" });
    }

    doc.save(`${selectedSet}_read_and_dab.pdf`);
  };

  return (
    <div className="four-letter-page">
      <div className="navbar">
        <div className="nav-left">
          <span className="hamburger" onClick={() => document.getElementById("sidebar").classList.toggle("show")}>
            &#9776;
          </span>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#f5f0f5",
              cursor: "pointer"
            }}
          >
            Home
          </button>
        </div>

        <div className="nav-center">4-Letter Consonant Blends</div>

        <div className="nav-right">
          <label>Speed:</label>
          <select value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}>
            {[0.05, 0.25, 0.5, 0.75, 1, 1.25].map(v => <option key={v} value={v}>{v}x</option>)}
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "10px" }}>
            <label>Words:</label>
            <select value={wordsPerPage} onChange={(e) => { setWordsPerPage(parseInt(e.target.value)); setPage(0); }}>
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            <button onClick={downloadPDF} style={{ marginLeft: "10px", padding: "6px 12px", fontSize: "14px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              📄 PDF
            </button>
          </div>
        </div>
      </div>

      <div className="sidebar" id="sidebar">
        {Object.keys(wordSets).map((key) => (
          <button key={key} onClick={() => handleSetChange(key)}>{key}</button>
        ))}
      </div>

      <div className="overlay" onClick={() => document.getElementById("sidebar").classList.remove("show")}></div>

      <div className="word-grid">
        {visibleWords.map((word, index) => (
          <div className="word-box" key={index} onClick={() => speakWord(word)}>{word}</div>
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