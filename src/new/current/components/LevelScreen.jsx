import "./LevelScreen.css";

function LevelScreen({ onBack, onSelectLevel }) {
  const levels = [
  {
    id: "level1",
    title: "Level 1",
    subtitle: "(Today)",
    icon: "📅",
  },
  {
    id: "level2",
    title: "Level 2",
    subtitle: "(Ninna, Today)",
    icon: "🗓️",
  },
  {
    id: "level3",
    title: "Level 3",
    subtitle: "(Days Before / After)",
    icon: "🔄",
  },
  {
    id: "level4",
    title: "Level 4",
    subtitle: "(Days & Months)",
    icon: "📆",
  },
  {
    id: "level5",
    title: "Level 5",
    subtitle: "(Birthdays / Events)",
    icon: "🎂",
  },
  {
    id: "level6",
    title: "Level 6",
    subtitle: "(Calendar)",
    icon: "📅",
  },
  {
    id: "level7",
    title: "Level 7",
    subtitle: "(Memory Book)",
    icon: "📖",
  },
];

  return (
    <div className="level-screen">

      {/* BACK BUTTON */}
      <button
        className="level-back-button"
        onClick={onBack}
      >
        ← BACK
      </button>

      {/* HEADER */}
      <div className="level-header">
        <h1>Day & Date</h1>
        <p>Choose a Level</p>
      </div>

      {/* LEVELS */}
      <div className="levels-grid">

        {levels.map((level) => (
          <div
            key={level.id}
            className="level-card"
            onClick={() =>
              onSelectLevel(level.id)
            }
          >
            <h2>{level.title}</h2>

            <h3>{level.subtitle}</h3>

            <div className="level-icon">
              {level.icon}
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default LevelScreen;