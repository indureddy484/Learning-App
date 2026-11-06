
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

  // Available video files
  const videoFiles = {
    Story: "/videos/tenali/story.mp4",
    decorate: "/videos/tenali/decorate.mp4",
    greed: "/videos/tenali/greedy.mp4",
    cheat: "/videos/tenali/cheat.mp4",
    reward: "/videos/tenali/reward.mp4",
    grains: "/videos/tenali/grains.mp4",
    court: "/videos/tenali/court.mp4",
    roots: "/videos/tenali/roots.mp4",
    Clever: "/videos/tenali/clever.mp4",
    proud: "/videos/tenali/proud.mp4",
    plain: "/videos/tenali/plain.mp4",
  };

  const [selectedWord, setSelectedWord] = useState("Story");

  // Video loading states
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const selectedVideo = videoFiles[selectedWord];

  // Reset video states whenever another word is selected
  useEffect(() => {
    setIsVideoLoading(Boolean(selectedVideo));
    setVideoReady(false);
    setVideoError(false);
  }, [selectedWord, selectedVideo]);

  // Video is ready
  const handleVideoReady = () => {
    setIsVideoLoading(false);
    setVideoReady(true);
  };

  // Video loading error
  const handleVideoError = () => {
    setIsVideoLoading(false);
    setVideoReady(false);
    setVideoError(true);
  };

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

            {/* VIDEO AVAILABLE */}
            {selectedVideo ? (
              <>
                {/* LOADING SPINNER */}
                {isVideoLoading && !videoError && (
                  <div className="tenali-loading-overlay">
                    <div className="tenali-loading-spinner"></div>
                  </div>
                )}

                {/* VIDEO PLAYER */}
                {!videoError && (
                  <video
                    className="tenali-video-player"
                    controls
                    preload="auto"
                    autoPlay={false}
                    key={selectedVideo}
                    onLoadedData={handleVideoReady}
                    onCanPlay={handleVideoReady}
                    onError={handleVideoError}
                  >
                    <source
                      src={selectedVideo}
                      type="video/mp4"
                    />

                    Your browser does not support video playback.
                  </video>
                )}

                {/* ERROR MESSAGE */}
                {videoError && (
                  <p className="tenali-error-text">
                    Unable to load video. Please check the video file.
                  </p>
                )}
              </>
            ) : (

              /* VIDEO NOT AVAILABLE YET */
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

export default TenaliStory