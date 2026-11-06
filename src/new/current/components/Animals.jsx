
import React, { useState } from "react";
import "./Animals.css";

function Animals({ onBack }) {
  const categories = [
    "Pet Animals",
    "Farm Animals",
    "Wild Animals",
    "Water Animals",
    "Birds",
  ];

  const [selectedCategory, setSelectedCategory] =
    useState("Pet Animals");

  const [selectedAnimal, setSelectedAnimal] = useState(null);

  // All animal data, image paths and video paths
  const animalData = {
    // PET ANIMALS
    "Pet Animals": [
      {
        name: "Fish",
        emoji: "🐟",
        image: "/images/animals/pet/fish.jpg",
        video: "/videos/animals/pet/fish.mp4",
      },
      {
        name: "Rabbit",
        emoji: "🐰",
        image: "/images/animals/pet/rabbit.jpg",
        video: "/videos/animals/pet/rabbit.mp4",
      },
      {
        name: "Pigeon",
        emoji: "🕊️",
        image: "/images/animals/pet/pigeon.jpg",
        video: "/videos/animals/pet/pigeon.mp4",
      },
      {
        name: "Parrot",
        emoji: "🦜",
        image: "/images/animals/pet/parrot.jpg",
        video: "/videos/animals/pet/parrot.mp4",
      },
    ],

    // FARM ANIMALS
    "Farm Animals": [
      {
        name: "Buffalo",
        emoji: "🐃",
        image: "/images/animals/farm/buffalo.jpg",
        video: "/videos/animals/farm/buffalo.mp4",
      },
      {
        name: "Goat",
        emoji: "🐐",
        image: "/images/animals/farm/goat.jpg",
        video: "/videos/animals/farm/goat.mp4",
      },
      {
        name: "Sheep",
        emoji: "🐑",
        image: "/images/animals/farm/sheep.jpg",
        video: "/videos/animals/farm/sheep.mp4",
      },
      {
        name: "Camel",
        emoji: "🐪",
        image: "/images/animals/farm/camel.jpg",
        video: "/videos/animals/farm/camel.mp4",
      },
      {
        name: "Horse",
        emoji: "🐎",
        image: "/images/animals/farm/horse.jpg",
        video: "/videos/animals/farm/horse.mp4",
      },
      {
        name: "Hen",
        emoji: "🐔",
        image: "/images/animals/farm/hen.jpg",
        video: "/videos/animals/farm/hen.mp4",
      },
      {
        name: "Cow",
        emoji: "🐄",
        image: "/images/animals/farm/cow.png",
        video: "/videos/animals/farm/cow.mp4",
      },
      {
        name: "Dog",
        emoji: "🐕",
        image: "/images/animals/farm/dog.jpg",
        video: "/videos/animals/farm/dog.mp4",
      },
    ],

    // WILD ANIMALS
    "Wild Animals": [
      {
        name: "Bear",
        emoji: "🐻",
        image: "/images/animals/wild/bear.jpg",
        video: "/videos/animals/wild/bear.mp4",
      },
      {
        name: "Elephant",
        emoji: "🐘",
        image: "/images/animals/wild/elephant.jpg",
        video: "/videos/animals/wild/elephant.mp4",
      },
      {
        name: "Zebra",
        emoji: "🦓",
        image: "/images/animals/wild/zebra.jpg",
        video: "/videos/animals/wild/zebra.mp4",
      },
      {
        name: "Tiger",
        emoji: "🐅",
        image: "/images/animals/wild/tiger.jpg",
        video: "/videos/animals/wild/tiger.mp4",
      },
      {
        name: "Giraffe",
        emoji: "🦒",
        image: "/images/animals/wild/giraffe.jpg",
        video: "/videos/animals/wild/giraffe.mp4",
      },
    ],

    // WATER ANIMALS
    "Water Animals": [
      {
        name: "Octopus",
        emoji: "🐙",
        image: "/images/animals/water/octopus.jpg",
        video: "/videos/animals/water/octopus.mp4",
      },
      {
        name: "Fish",
        emoji: "🐟",
        image: "/images/animals/water/fish.jpg",
        video: "/videos/animals/water/fish.mp4",
      },
      {
        name: "Crab",
        emoji: "🦀",
        image: "/images/animals/water/crab.jpg",
        video: "/videos/animals/water/crab.mp4",
      },
      {
        name: "Dolphin",
        emoji: "🐬",
        image: "/images/animals/water/dolphin.jpg",
        video: "/videos/animals/water/dolphin.mp4",
      },
      {
        name: "Jellyfish",
        emoji: "🪼",
        image: "/images/animals/water/jellyfish.jpg",
        video: "/videos/animals/water/jellyfish.mp4",
      },
      {
        name: "Oyster",
        emoji: "🦪",
        image: "/images/animals/water/oyster.jpg",
        video: "/videos/animals/water/oyster.mp4",
      },
      {
        name: "Seahorse",
        emoji: "🐠",
        image: "/images/animals/water/seahorse.jpg",
        video: "/videos/animals/water/seahorse.mp4",
      },
    ],

    // BIRDS
    Birds: [
      {
        name: "Toucans",
        emoji: "🐦",
        image: "/images/animals/birds/toucans.jpg",
        video: "/videos/animals/birds/toucans.mp4",
      },
      {
        name: "Goose",
        emoji: "🪿",
        image: "/images/animals/birds/goose.jpg",
        video: "/videos/animals/birds/goose.mp4",
      },
      {
        name: "Quail",
        emoji: "🐦",
        image: "/images/animals/birds/quail.jpg",
        video: "/videos/animals/birds/quail.mp4",
      },
      {
        name: "Kiwi",
        emoji: "🐦",
        image: "/images/animals/birds/kiwi.jpg",
        video: "/videos/animals/birds/kiwi.mp4",
      },
      {
        name: "Owl",
        emoji: "🦉",
        image: "/images/animals/birds/owl.jpg",
        video: "/videos/animals/birds/owl.mp4",
      },
    ],
  };

  // Change category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedAnimal(null);
  };

  // Open selected animal video
  const handleAnimalClick = (animal) => {
    if (animal.video) {
      setSelectedAnimal(animal);
    }
  };

  // Show emoji if image fails to load
  const handleImageError = (event) => {
    event.currentTarget.style.display = "none";

    const fallback = event.currentTarget.nextElementSibling;

    if (fallback) {
      fallback.style.display = "block";
    }
  };

  return (
    <div className="animals-layout">

      {/* HEADER */}
      <div className="animals-header">
        <button
          className="animals-back-button"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <h1>Animals</h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="animals-main">

        {/* LEFT SIDEBAR */}
        <div className="animals-sidebar">
          <h2>Categories</h2>

          <div className="animals-category-list">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`animals-category-button ${
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
        <div className="animals-content">

          <h2>{selectedCategory}</h2>

          {/* SELECTED ANIMAL VIDEO */}
          {selectedAnimal && (
            <div className="animal-video-section">

              <button
                className="animals-back-button"
                onClick={() => setSelectedAnimal(null)}
                type="button"
              >
                ← Back to {selectedCategory}
              </button>

              <h3>{selectedAnimal.name}</h3>

              <video
                key={selectedAnimal.video}
                className="animal-video-player"
                controls
                autoPlay
                playsInline
              >
                <source
                  src={selectedAnimal.video}
                  type="video/mp4"
                />

                Your browser does not support video playback.
              </video>

            </div>
          )}

          {/* ANIMAL GRID */}
          {!selectedAnimal && (
            <div className="animals-grid">

              {animalData[selectedCategory].map((animal, index) => (
                <div
                  className="animal-card animal-card-clickable"
                  key={`${animal.name}-${index}`}
                  onClick={() => handleAnimalClick(animal)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      handleAnimalClick(animal);
                    }
                  }}
                >

                  <div className="animal-thumbnail">

                    <img
                      src={animal.image}
                      alt={animal.name}
                      className="animal-card-image"
                      loading="lazy"
                      onError={handleImageError}
                    />

                    <span
                      style={{
                        display: "none",
                        fontSize: "55px",
                      }}
                    >
                      {animal.emoji}
                    </span>

                  </div>

                  <h3>{animal.name}</h3>

                  <p>▶ Watch Video</p>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Animals;
