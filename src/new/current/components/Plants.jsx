
import React, { useState } from "react";
import "./Plants.css";

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

  const [selectedCategory, setSelectedCategory] = useState("Trees");

  // One video for each category
  const categoryVideos = {
    Trees: "/videos/plants/trees.mp4",
    Shrubs: "/videos/plants/shrubs.mp4",
    Herbs: "/videos/plants/herbs.mp4",
    Climbers: "/videos/plants/climbers.mp4",
    Creepers: "/videos/plants/creepers.mp4",
    "Water Plants": "/videos/plants/water.mp4",
    "Desert Plants": "/videos/plants/desert.mp4",
  };

  // Plant images for each category
  // Add plant names and image paths here later.
  const plantData = {
    Trees: [],
    Shrubs: [],
    Herbs: [],
    Climbers: [],
    Creepers: [],
    "Water Plants": [],
    "Desert Plants": [],
  };

  // Change category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Show emoji if image fails to load
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
      </div>

      {/* MAIN CONTENT */}
      <div className="plants-main">

        {/* LEFT SIDEBAR */}
        <div className="plants-sidebar">
          <h2>Categories</h2>

          <div className="plants-category-list">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`plants-category-button ${
                  selectedCategory === category ? "active" : ""
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

        {/* RIGHT CONTENT AREA */}
        <div className="plants-content">

          <h2>{selectedCategory}</h2>

          {/* CATEGORY VIDEO - DISPLAYED BY DEFAULT */}
          <div className="plant-video-section">
            <video
              key={categoryVideos[selectedCategory]}
              className="plant-video-player"
              controls
              playsInline
              preload="metadata"
            >
              <source
                src={categoryVideos[selectedCategory]}
                type="video/mp4"
              />

              Your browser does not support video playback.
            </video>
          </div>

          {/* PLANT GRID - DISPLAY ONLY WHEN IMAGES ARE AVAILABLE */}
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

        </div>
      </div>
    </div>
  );
}

export default Plants;
