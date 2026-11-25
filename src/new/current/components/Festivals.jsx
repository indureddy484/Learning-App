
import React, { useState } from "react";
import "./Festivals.css";
import FestivalsQuiz from "./FestivalsQuiz";

function Festivals({ onBack }) {
  const categories = [
    "Family Celebrations",
    "School Celebrations",
    "National Festivals",
    "Religious Festivals",
  ];

  const [selectedCategory, setSelectedCategory] = useState(
    "Family Celebrations"
  );
  const [selectedCelebration, setSelectedCelebration] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Image paths are stored WITHOUT extensions.
  // The component tries JPG first, then PNG automatically.

  const celebrationData = {
    "Family Celebrations": [
      {
        name: "Birthdays",
        imageBase: "/images/festivals/family/birthdays",
        video: "/videos/festivals/family/birthdays.mp4",
      },
      {
        name: "Weddings",
        imageBase: "/images/festivals/family/weddings",
        video: "/videos/festivals/family/weddings.mp4",
      },
      {
        name: "Naming Ceremony",
        imageBase: "/images/festivals/family/naming-ceremony",
        video: "/videos/festivals/family/naming-ceremony.mp4",
      },
    ],

    "School Celebrations": [
      {
        name: "Annual Day",
        imageBase: "/images/festivals/school/annual-day",
        video: "/videos/festivals/school/annual-day.mp4",
      },
      {
        name: "Teachers Day",
        imageBase: "/images/festivals/school/teachers-day",
        video: "/videos/festivals/school/teachers-day.mp4",
      },
      {
        name: "Sports Day",
        imageBase: "/images/festivals/school/sports-day",
        video: "/videos/festivals/school/sports-day.mp4",
      },
      {
        name: "Childrens Day",
        imageBase: "/images/festivals/school/childrens-day",
        video: "/videos/festivals/school/childrens-day.mp4",
      },
    ],

    "National Festivals": [
      {
        name: "Independence Day",
        imageBase: "/images/festivals/national/independence-day",
        video: "/videos/festivals/national/independence-day.mp4",
      },
      {
        name: "Republic Day",
        imageBase: "/images/festivals/national/republic-day",
        video: "/videos/festivals/national/republic-day.mp4",
      },
      {
        name: "Gandhi Jayanthi",
        imageBase: "/images/festivals/national/gandhi-jayanthi",
        video: "/videos/festivals/national/gandhi-jayanthi.mp4",
      },
    ],

    "Religious Festivals": [
      {
        name: "Diwali",
        imageBase: "/images/festivals/religious/diwali",
        video: "/videos/festivals/religious/diwali.mp4",
      },
      {
        name: "Holi",
        imageBase: "/images/festivals/religious/holi",
        video: "/videos/festivals/religious/holi.mp4",
      },
      {
        name: "Eid",
        imageBase: "/images/festivals/religious/eid",
        video: "/videos/festivals/religious/eid.mp4",
      },
      {
        name: "Christmas",
        imageBase: "/images/festivals/religious/christmas",
        video: "/videos/festivals/religious/christmas.mp4",
      },
      {
        name: "Guru Nanak Jayanthi",
        imageBase: "/images/festivals/religious/guru-nanak-jayanthi",
        video: "/videos/festivals/religious/guru-nanak-jayanthi.mp4",
      },
    ],
  };

  // Change selected category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedCelebration(null);
  };

  // Open selected celebration video
  const handleCelebrationClick = (celebration) => {
    setSelectedCelebration(celebration);
  };

  // Try JPG first. If unavailable, try PNG.
  // If both are unavailable, hide the image.
  const handleImageError = (event) => {
    const image = event.currentTarget;

    if (!image.dataset.pngTried) {
      image.dataset.pngTried = "true";
      image.src = `${image.dataset.imageBase}.png`;
    } else {
      image.style.display = "none";
    }
  };

  // Open Festivals Quiz
  const handleOpenQuiz = () => {
    setSelectedCelebration(null);
    setShowQuiz(true);
  };

  // Return from Quiz to Festivals
  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  // Show Festivals Quiz separately
  if (showQuiz) {
    return (
      <FestivalsQuiz onBack={handleCloseQuiz} />
    );
  }

  return (
    <div className="festivals-layout">

      {/* =========================
          HEADER
      ========================= */}
      <div className="festivals-header">

        <button
          className="festivals-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <h1>Festivals</h1>

        <div className="festivals-header-actions">

          {/* MUTE / UNMUTE BUTTON */}
          <button
            className="festivals-global-mute-button"
            onClick={() => setIsMuted((previous) => !previous)}
            type="button"
            aria-label={
              isMuted
                ? "Unmute all festival videos"
                : "Mute all festival videos"
            }
            aria-pressed={isMuted}
          >
            {isMuted ? "Unmute 🔊" : "Mute 🔇"}
          </button>

          {/* FESTIVALS QUIZ BUTTON */}
          <button
            className="festivals-quiz-button"
            onClick={handleOpenQuiz}
            type="button"
          >
            📝 Festivals Quiz
          </button>

        </div>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="festivals-main">

        {/* =========================
            LEFT SIDEBAR
        ========================= */}
        <div className="festivals-sidebar">

          <h2 className="festivals-sidebar-title">
            Festivals
          </h2>

          <div className="festivals-category-list">

            {categories.map((category, index) => (
              <button
                key={category}
                className={`festivals-category-button ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
                type="button"
                aria-pressed={selectedCategory === category}
              >
                <span>{index + 1}.</span>
                <span>{category}</span>
              </button>
            ))}

          </div>
        </div>

        {/* =========================
            RIGHT CONTENT
        ========================= */}
        <div className="festivals-content">

          <h2>{selectedCategory}</h2>

          {/* =========================
              VIDEO PLAYER
          ========================= */}
          {selectedCelebration && (
            <div className="festival-video-section">

              <button
                className="festivals-back-button"
                onClick={() => setSelectedCelebration(null)}
                type="button"
              >
                ← Back to {selectedCategory}
              </button>

              <h3>{selectedCelebration.name}</h3>

              <video
                key={selectedCelebration.video}
                className="festival-video-player"
                controls
                muted={isMuted}
                autoPlay
                playsInline
                preload="metadata"
              >
                <source
                  src={selectedCelebration.video}
                  type="video/mp4"
                />

                Your browser does not support video playback.
              </video>

            </div>
          )}

          {/* =========================
              CELEBRATION CARDS
          ========================= */}
          {!selectedCelebration && (
            <div className="festivals-grid">

              {celebrationData[selectedCategory].map(
                (celebration, index) => (
                  <div
                    className="festival-card festival-card-clickable"
                    key={`${celebration.name}-${index}`}
                    onClick={() =>
                      handleCelebrationClick(celebration)
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();
                        handleCelebrationClick(celebration);
                      }
                    }}
                  >

                    <div className="festival-thumbnail">

                      <img
                        src={`${celebration.imageBase}.jpg`}
                        data-image-base={celebration.imageBase}
                        alt={celebration.name}
                        className="festival-card-image"
                        loading="lazy"
                        onError={handleImageError}
                      />

                    </div>

                    <h3>{celebration.name}</h3>

                    <p>▶ Watch Video</p>

                  </div>
                )
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Festivals;
