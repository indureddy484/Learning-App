import { useParams, useNavigate } from "react-router-dom";
import PhotoGame from "./PhotoGame";
import VideoGame from "./VideoGame";
import "./StoryMode.css";

export default function StoryMode({ playerName }) {
  const { storyId, mode } = useParams();
  const navigate = useNavigate();

  const goTo = (targetMode) => {
    navigate(`/story/${storyId}/${targetMode}`);
  };

  return (
    <div className="story-wrapper">
      <div className="story-header">
        <h2>Story {storyId} - {mode === "photo" ? "Photo Mode" : "Video Mode"}</h2>
        <div className="toggle-controls">
          <button
            className="switch-btn"
            disabled={mode === "photo"}
            onClick={() => goTo("photo")}
          >
            Photo View
          </button>
          <button
            className="switch-btn"
            disabled={mode === "video"}
            onClick={() => goTo("video")}
          >
            Video View
          </button>
        </div>
      </div>

      <div className="story-content">
        {mode === "photo" ? (
          <PhotoGame level={parseInt(storyId)} playerName={playerName} />
        ) : (
          <VideoGame level={parseInt(storyId)} playerName={playerName} />
        )}
      </div>
    </div>
  );
}
