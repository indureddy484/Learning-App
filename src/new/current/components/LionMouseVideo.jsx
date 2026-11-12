
import React, { useState, useEffect } from "react";
import "./LionMouseVideo.css";

function LionMouseVideo({ onBack }) {
  const words = [
    "Story",
    "forest",
    "shady",
    "snoring",
    "tiny",
    "forgive",
    "hunters",
    "net",
    "gnaw",
    "ropes",
    "brave",
  ];

  // Lion and the Mouse video files
  // Keep these filenames consistent with your public folder.
  const videoFiles = {
    Story: "/videos/lion-mouse/story.mp4",
    forest: "/videos/lion-mouse/forest.mp4",
    shady: "/videos/lion-mouse/shady.mp4",
    snoring: "/videos/lion-mouse/snoring.mp4",
    tiny: "/videos/lion-mouse/tiny.mp4",
    forgive: "/videos/lion-mouse/forgive.mp4",
    hunters: "/videos/lion-mouse/hunters.mp4",
    net: "/videos/lion-mouse/net.mp4",
    gnaw: "/videos/lion-mouse/gnaw.mp4",
    ropes: "/videos/lion-mouse/ropes.mp4",
    brave: "/videos/lion-mouse/brave.mp4",
  };

  const [selectedWord, setSelectedWord] = useState("Story");

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

  const handleVideoReady = () => {
    setIsVideoLoading(false);
    setVideoReady(true);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setIsVideoLoading(false);
    setVideoReady(false);
    setVideoError(true);
  };

  return (
    <div className="lion-mouse-story-layout">

      {/* TOP HEADER */}
      <div className="lion-mouse-story-header">
        <button
          className="lion-mouse-story-back"
          onClick={onBack}
          type="button"
        >
          ← BACK
        </button>

        <h1>Lion and the Mouse</h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="lion-mouse-story-main">

        {/* LEFT NAVIGATION */}
        <div className="lion-mouse-story-sidebar">
          <h2>Story Words</h2>

          <div className="lion-mouse-word-list">
            {words.map((word, index) => (
              <button
                key={word}
                className={`lion-mouse-word-button ${
                  selectedWord === word ? "active" : ""
                }`}
                onClick={() => setSelectedWord(word)}
                type="button"
              >
                <span className="lion-mouse-word-number">
                  {index + 1}.
                </span>

                <span>{word}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT VIDEO AREA */}
        <div className="lion-mouse-video-area">
          <h2>{selectedWord}</h2>

          <div className="lion-mouse-video-placeholder">

            {/* VIDEO AVAILABLE */}
            {selectedVideo ? (
              <>
                {/* LOADING SPINNER */}
                {isVideoLoading && !videoError && (
                  <div className="lion-mouse-loading-overlay">
                    <div className="lion-mouse-loading-spinner"></div>
                  </div>
                )}

                {/* VIDEO PLAYER */}
                {!videoError && (
                  <video
                    className="lion-mouse-video-player"
                    controls
                    muted
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
                  <p className="lion-mouse-error-text">
                    Unable to load video. Please check the video file.
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="lion-mouse-video-icon">▶</div>
                <p>Video will be added here</p>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default LionMouseVideo;
