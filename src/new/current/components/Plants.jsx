
import React, { useState } from "react";
import "./Plants.css";

// =================================
// REUSABLE VIDEO PLAYER
// =================================

function PlantVideoPlayer({ src, isMuted }) {
  return (
    <div className="plant-video-container">

      {/* VIDEO */}
      <video
        className="plant-video-player"
        controls
        muted={isMuted}
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support video playback.
      </video>

    </div>
  );
}


// =================================
// PLANTS COMPONENT
// =================================

function Plants({ onBack }) {

  const categories = [
    "Trees",
    "Shrubs",
    "Herbs",
    "Climbers",
    "Creepers",
    "Water Plants",
    "Desert Plants",
  ];

  const plantParts = [
    { name: "Root" },
    { name: "Stem" },
    { name: "Leaves" },
    { name: "Flower" },
    { name: "Fruit" },
    { name: "Seed" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("Trees");
  const [selectedPart, setSelectedPart] = useState(null);

  // GLOBAL MUTE STATE FOR ALL VIDEOS
  // Videos start unmuted
  const [isMuted, setIsMuted] = useState(false);

  // Only one sidebar section can be open at a time
  const [expandedSection, setExpandedSection] = useState("categories");

  // Accordion toggle
  const toggleSection = (section) => {
    setExpandedSection((current) =>
      current === section ? null : section
    );
  };

  // Category videos
  const categoryVideos = {
    Trees: "/videos/plants/trees.mp4",
    Shrubs: "/videos/plants/shrubs.mp4",
    Herbs: "/videos/plants/herbs.mp4",
    Climbers: "/videos/plants/climbers.mp4",
    Creepers: "/videos/plants/creepers.mp4",
    "Water Plants": "/videos/plants/water.mp4",
    "Desert Plants": "/videos/plants/desert.mp4",
  };

  // Parts of Plants videos
  const plantPartVideos = {
    Root: "/videos/plants/parts_of_plants/roots.mp4",
    Stem: "/videos/plants/parts_of_plants/stem.mp4",
    Leaves: "/videos/plants/parts_of_plants/leaf.mp4",
    Flower: "/videos/plants/parts_of_plants/flowers.mp4",
    Fruit: "/videos/plants/parts_of_plants/fruits.mp4",
    Seed: "/videos/plants/parts_of_plants/seed.mp4",
  };

  // Plant images for each category
  const plantData = {
    Trees: [],
    Shrubs: [],
    Herbs: [],
    Climbers: [],
    Creepers: [],
    "Water Plants": [],
    "Desert Plants": [],
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedPart(null);
    setExpandedSection("categories");
  };

  // Handle plant part selection
  const handlePartChange = (part) => {
    setSelectedPart(part);
    setExpandedSection("parts");
  };

  // Show fallback emoji if image fails to load
  const handleImageError = (event) => {
    event.currentTarget.style.display = "none";

    const fallback = event.currentTarget.nextElementSibling;

    if (fallback) {
      fallback.style.display = "flex";
    }
  };

  return (
    <div className="plants-layout">

      {/* HEADER */}
      <div className="plants-header">

        <button
          className="plants-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <h1>Plants</h1>

        {/* ONE GLOBAL MUTE / UNMUTE BUTTON */}
        <button
          className="plants-global-mute-button"
          onClick={() => setIsMuted((prev) => !prev)}
          type="button"
          aria-label={isMuted ? "Unmute all videos" : "Mute all videos"}
        >
          {isMuted ? "Unmute 🔊" : "Mute 🔇"}
        </button>

      </div>


      {/* MAIN CONTENT */}
      <div className="plants-main">

        {/* LEFT SIDEBAR */}
        <div className="plants-sidebar">

          {/* CATEGORIES HEADING */}
          <button
            className="plants-sidebar-heading"
            onClick={() => toggleSection("categories")}
            type="button"
            aria-expanded={expandedSection === "categories"}
          >
            <span>Categories</span>

            <span className="plants-expand-icon">
              {expandedSection === "categories" ? "−" : "+"}
            </span>
          </button>


          {/* CATEGORY LIST */}
          <div
            className={`plants-expandable-list ${
              expandedSection === "categories" ? "expanded" : ""
            }`}
          >
            <div className="plants-category-list">

              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`plants-category-button ${
                    !selectedPart && selectedCategory === category
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleCategoryChange(category)}
                  type="button"
                >
                  <span>{index + 1}.</span>
                  <span>{category}</span>
                </button>
              ))}

            </div>
          </div>


          {/* PARTS OF PLANTS HEADING */}
          <button
            className="plants-sidebar-heading parts-heading"
            onClick={() => toggleSection("parts")}
            type="button"
            aria-expanded={expandedSection === "parts"}
          >
            <span>Parts of Plants</span>

            <span className="plants-expand-icon">
              {expandedSection === "parts" ? "−" : "+"}
            </span>
          </button>


          {/* PLANT PARTS LIST */}
          <div
            className={`plants-expandable-list ${
              expandedSection === "parts" ? "expanded" : ""
            }`}
          >
            <div className="plants-category-list">

              {plantParts.map((part, index) => (
                <button
                  key={part.name}
                  className={`plants-category-button ${
                    selectedPart?.name === part.name ? "active" : ""
                  }`}
                  onClick={() => handlePartChange(part)}
                  type="button"
                >
                  <span>{index + 1}.</span>
                  <span>{part.name}</span>
                </button>
              ))}

            </div>
          </div>

        </div>


        {/* RIGHT CONTENT AREA */}
        <div className="plants-content">

          {selectedPart ? (

            /* PARTS OF PLANTS - VIDEO ONLY */
            <div className="plant-part-content">

              <div className="plant-video-section">

                <PlantVideoPlayer
                  key={plantPartVideos[selectedPart.name]}
                  src={plantPartVideos[selectedPart.name]}
                  isMuted={isMuted}
                />

              </div>

            </div>

          ) : (

            /* CATEGORY VIDEO CONTENT */
            <>

              <div className="plant-video-section">

                <PlantVideoPlayer
                  key={categoryVideos[selectedCategory]}
                  src={categoryVideos[selectedCategory]}
                  isMuted={isMuted}
                />

              </div>


              {/* PLANT GRID */}
              {plantData[selectedCategory].length > 0 && (
                <div className="plants-grid">

                  {plantData[selectedCategory].map((plant, index) => (
                    <div
                      className="plant-card"
                      key={`${plant.name}-${index}`}
                    >

                      <div className="plant-thumbnail">

                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="plant-card-image"
                          loading="lazy"
                          onError={handleImageError}
                        />

                        <span className="plant-image-fallback">
                          {plant.emoji || "🌱"}
                        </span>

                      </div>

                      <h3>{plant.name}</h3>

                    </div>
                  ))}

                </div>
              )}

            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Plants;
