import React, { useState, useEffect } from "react";
import "./TenaliStory.css";

function TenaliStory({ onBack }) {
  const words = [
    "Story",
    "court",
    "Clever",
    "proud",
    "reward",
    "decorate",
    "roots",
    "plain",
    "grains",
    "greed",
    "cheat",
  ];

  const [selectedWord, setSelectedWord] = useState("Story");

  // Video loading states
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Reset video states whenever another word is selected
  useEffect(() => {
    if (selectedWord === "Story") {
      setIsVideoLoading(true);
      setVideoReady(false);
      setVideoError(false);
    }
  }, [selectedWord]);

  return (
    <div className="tenali-story-layout">

      {/* TOP HEADER */}

      <div className="tenali-story-header">
        <button
          className="tenali-story-back"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <h1>Tenali Rama and the Greedy Farmer</h1>
      </div>

      {/* MAIN CONTENT */}

      <div className="tenali-story-main">

        {/* LEFT NAVIGATION */}

        <div className="tenali-story-sidebar">

          <h2>Story Words</h2>

          <div className="tenali-word-list">

            {words.map((word, index) => (
              <button
                key={word}
                className={`tenali-word-button ${
                  selectedWord === word ? "active" : ""
                }`}
                onClick={() => setSelectedWord(word)}
                type="button"
              >
                <span className="tenali-word-number">
                  {index + 1}.
                </span>

                <span>{word}</span>
              </button>
            ))}

          </div>
        </div>

        {/* RIGHT VIDEO AREA */}

        <div className="tenali-story-video-area">

          <h2>{selectedWord}</h2>

          <div className="tenali-video-placeholder">

            {/* STORY VIDEO */}

            {selectedWord === "Story" ? (
              <>

                {isVideoLoading && (
                  <p className="tenali-loading-text">
                    Loading video... Please wait
                  </p>
                )}

                {!videoError && (
                  <video
                    className="tenali-video-player"
                    controls
                    preload="auto"
                    autoPlay={false}
                    key={selectedWord}
                    onCanPlay={() => {
                      setIsVideoLoading(false);
                      setVideoReady(true);
                    }}
                    onError={() => {
                      setIsVideoLoading(false);
                      setVideoReady(false);
                      setVideoError(true);
                    }}
                  >
                    <source
                      src="/videos/tenali/story.mp4"
                      type="video/mp4"
                    />

                    Your browser does not support video playback.
                  </video>
                )}

                {videoError && (
                  <p className="tenali-error-text">
                    Unable to load video. Please check the video file.
                  </p>
                )}

              </>
            ) : (

              /* OTHER WORDS - VIDEO PLACEHOLDER */

              <>
                <div className="tenali-video-icon">▶</div>

                <p>Video will be added here</p>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default TenaliStory;