import { useState } from "react";
import "./MatchingGame.css";

import dress from "../assets/dress.png";
import tshirt from "../assets/tshirt.png";
import sweater from "../assets/sweater.png";
import hoodie from "../assets/hoodie.png";
import scarf from "../assets/scarf.png";
import cap from "../assets/cap.png";
import gloves from "../assets/gloves.png";
import boots from "../assets/boots.png";

const clothingItems = [
  { name: "Dress", image: dress },
  { name: "T-Shirt", image: tshirt },
  { name: "Sweater", image: sweater },
  { name: "Hoodie", image: hoodie },
  { name: "Scarf", image: scarf },
  { name: "Cap", image: cap },
  { name: "Gloves", image: gloves },
  { name: "Boots", image: boots },
];

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function MatchingGame({ onBack }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [matches, setMatches] = useState({});
  const [wrongName, setWrongName] = useState(null);
  const [shuffledNames, setShuffledNames] = useState(() =>
    shuffleArray(clothingItems.map((item) => item.name))
  );

  const resetGame = () => {
    setSelectedImage(null);
    setMatches({});
    setWrongName(null);
    setShuffledNames(
      shuffleArray(clothingItems.map((item) => item.name))
    );
  };

  const handleImageClick = (name) => {
    if (matches[name]) return;

    setSelectedImage(name);
    setWrongName(null);
  };

  const handleNameClick = (name) => {
    if (!selectedImage) return;

    // Don't allow already matched words
    if (Object.values(matches).includes(name)) return;

    if (selectedImage === name) {
      setMatches((previous) => ({
        ...previous,
        [selectedImage]: name,
      }));

      setSelectedImage(null);
      setWrongName(null);
    } else {
      setWrongName(name);

      setTimeout(() => {
        setWrongName(null);
      }, 700);
    }
  };

  const allMatched = Object.keys(matches).length === clothingItems.length;

  return (
    <div className="matching-game">

      <h1>Match the Clothes</h1>

      <p className="instruction">
        Click a picture and then click its matching word.
      </p>

      {allMatched && (
        <div className="success-message">
          🎉 Excellent! You matched all the clothes!
        </div>
      )}

      <div className="worksheet">

        {/* SVG FOR MATCHING LINES */}
        <svg className="matching-lines">

          {Object.keys(matches).map((imageName) => {
            const imageIndex = clothingItems.findIndex(
              (item) => item.name === imageName
            );

            const wordIndex = shuffledNames.findIndex(
              (name) => name === matches[imageName]
            );

            const rowHeight = 170;

            const startY = 75 + imageIndex * rowHeight;
            const endY = 75 + wordIndex * rowHeight;

            return (
              <line
                key={imageName}
                x1="220"
                y1={startY}
                x2="320"
                y2={endY}
                className="match-line"
              />
            );
          })}

        </svg>

        {/* LEFT SIDE - CLOTHING IMAGES */}
        <div className="image-column">

          {clothingItems.map((item) => (
            <div
              key={item.name}
              className={`image-card
                ${selectedImage === item.name ? "selected" : ""}
                ${matches[item.name] ? "matched" : ""}
              `}
              onClick={() => handleImageClick(item.name)}
            >
              <img src={item.image} alt={item.name} />

              <span className="left-dot"></span>
            </div>
          ))}

        </div>

        {/* RIGHT SIDE - WORDS */}
        <div className="name-column">

          {shuffledNames.map((name) => {

            const alreadyMatched = Object.values(matches).includes(name);

            return (
              <div
                key={name}
                className={`name-card
                  ${alreadyMatched ? "matched" : ""}
                  ${wrongName === name ? "wrong" : ""}
                `}
                onClick={() => handleNameClick(name)}
              >
                <span className="right-dot"></span>

                {name}
              </div>
            );
          })}

        </div>

      </div>

      <div className="game-buttons">

  <button
    className="matching-back-button"
    onClick={onBack}
  >
    ← BACK
  </button>

  <button
    className="reset-button"
    onClick={resetGame}
  >
    🔄 RESET GAME
  </button>

</div>

    </div>
  );
}

export default MatchingGame;