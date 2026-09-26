import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UOISystemLevelPage.css";

// Sound effects
const sfxRight = new Audio("/sounds/success-1-6297.mp3");
const sfxWrong = new Audio("/sounds/fail-2-277575.mp3");
const voiceRight = new Audio("/sounds/very-good.mp3");
const voiceWrong = new Audio("/sounds/try-again.mp3");
const tapSound = new Audio("/sounds/tap.mp3");

// Set volume
[sfxRight, sfxWrong, voiceRight, voiceWrong, tapSound].forEach((sfx) => {
  sfx.volume = 1;
});

// Play helper
const play = (audio) => {
  audio.currentTime = 0;
  audio.play().catch(() => {});
};

// Twin sound helper (sound + voice)
const twin = (a, b) => {
  play(a);
  setTimeout(() => play(b), 300);
};

const quizData = {
  skeletal: {
    video: "/videos/Skeletal/Sketetal_System.mp4",
    level1: [
  {
    question: "1. Endoskeleton Ekkada Untundhi? ",
    video: "/videos/Skeletal/Sketetal_System.mp4",
    options: ["Body Meeda", "Body Lopala", "Air lo", "None"],
    answer: "Body Lopala",
  },
  {
    question: "2. Exoskeleton Ekkada Untundhi? ",
    video: "/videos/Skeletal/Sketetal_System.mp4",
    options: ["Body Meeda", "Body Lopala", "Air lo", "None"],
    answer: "Body Meeda",
  },
  {
    question: "3. Endoskeleton Evariki Untundhi? ",
    video: "/videos/Skeletal/Sketetal_System.mp4",
    options: ["Persons", "Butterfly", "Snail", "Crab"],
    answer: "Persons",
  },
  {
    question: "4. Exoskeleton Evariki Untundhi? ",
    video: "/videos/Skeletal/Sketetal_System.mp4",
    options: ["Persons", "Dogs", "Snail", "Cat"],
    answer: "Snail",
  },
  {
    question: "5. Ikkad ichina animal ki elanti skeleton untadhi? ",
    video: "/videos/Skeletal/dog.mp4",
    options: ["Exoskeleton","Endoskeleton"],
    answer: "Endoskeleton",
  },
  {
    question: "6. Ikkad ichina animal ki elanti skeleton untadhi? ",
    video: "/videos/Skeletal/snail.mp4",
    options: ["Exoskeleton","Endoskeleton"],
    answer: "Exoskeleton",
  },
  {
    question: "7. Ikkad ichina animal ki elanti skeleton untadhi? ",
    video: "/videos/Skeletal/fish.mp4",
    options: ["Exoskeleton","Endoskeleton"],
    answer: "Endoskeleton",
  } 

],

    level2: [
      {
    question: "1. Persons ki elanti skeleton untadhi? ",
    image: "/images/Skeletal/person.png",
    options: ["Exoskeleton","Endoskeleton"],
    answer: "Endoskeleton",
     },
     {
    question: "2. Ikkada ichina animal ki elanti skeleton untadhi? ",
    image: "/images/Skeletal/cockroach.png",
    options: ["Exoskeleton","Endoskeleton"],
    answer: "Exoskeleton",
     },
     {
    question: "3. Ikkada ichina animal ki elanti skeleton untadhi? ",
    image: "/images/Skeletal/horse.png",
    options: ["Exoskeleton","Endoskeleton"],
    answer: "Endoskeleton",
     },
     {
    question: "4. Ikkada ichina animal ki elanti skeleton untadhi? ",
    image: "/images/Skeletal/cat.png",
    options: ["Exoskeleton","Endoskeleton"],
    answer: "Endoskeleton",
     },
     {
    question: "5. Ikkada ichina animal ki elanti skeleton untadhi? ",
    image: "/images/Skeletal/spider.png",
    options: ["Exoskeleton","Endoskeleton"],
    answer: "Exoskeleton",
     },
     {
    question: "6. Ikkada ichina animal ki elanti skeleton untadhi? ",
    image: "/images/Skeletal/loabster.png",
    options: ["Exoskeleton","Endoskeleton"],
    answer: "Exoskeleton",
     },
      {
    question: "7. Ikkada ichina animal ki elanti skeleton untadhi? ",
    image: "/images/Skeletal/cow.png",
    options: ["Exoskeleton","Endoskeleton"],
    answer: "Endoskeleton",
     }

    ],
    level3: [
      {
        question: "1. Mana body ni support chesy structure enti?",
        options: ["Mouth", "Skeleton", "Eyes", "Skin"],
        answer: "Skeleton",
      },
      {
        question: "2. Bones anni kalipithey em  antaru?",
        options: ["Skeleton", "mouth", "Eyes", "Skin"],
        answer: "Skeleton",
      },
      {
        question: "3. Vetilo Endoskeleton edi?",
        options: ["Crab", "Snail", "Goat", "Spider"],
        answer: "Goat",
      },
      {
        question: "4. Vetilo Endoskeleton edi?",
        options: ["Crab", "Snail", "Goat", "Spider"],
        answer: "Goat",
      },
      {
        question: "5. Vetilo Exoskeleton edi?",
        options: ["Persons", "Snail", "Goat", "dog"],
        answer: "Snail",
      },
      {
        question: "6. Vetilo Endoskeleton edi?",
        options: ["Crab", "Snail", "Lion", "Spider"],
        answer: "Lion",
      },
      {
        question: "7. Vetilo Exoskeleton edi?",
        options: ["Cat", "Tiger", "Goat", "Spider"],
        answer: "Spider",
      },
      {
        question: "8. Skeleton Body lopala unte em antaru",
        options: ["Exoskeleton", "Endoskeleton"],
        answer: "Endoskeleton",
      },
      {
        question: "9. Skeleton bayataki  unte em antaru",
        options: ["Exoskeleton", "Endoskeleton"],
        answer: "Exoskeleton",
      }     

    ],
  },
  Teeth: {
    video: "/videos/teeth/Teethintro.mp4",
    level1: [
      {
        question: "Ee process ni manam en antamu?",
        video: "/videos/teeth/teething.mp4",
        options: ["teething", "growing", "increasing", "decreasing"],
        answer: "teething",
      },
      {
        question: "Teeth clean unadli ante emi cheyali?",
        video: "/videos/teeth/brushing.mp4",
        options: ["padukovali", "brush cheyali", "chocolate tinali", "brush cheyoddu"],
        answer: "brush cheyali",
      }

    ],
    level2: [
      {
        question: "1. manaki enni types of teeth untayi?",
        image:"/images/teeth/types.png",
        options: ["3","2","4","1"],
        answer: "4",

      },
      {
        question: "2. ikkada unna teeth ni em antaru?",
        image: "/images/teeth/incisor.png",
        options: ["canines","incisors","pre molars","molars"],
        answer: "incisors",
      },
      {
        question: "3. ikkada unna teeth ni em antaru?",
        image: "/images/teeth/canine.png",
        options: ["canines","incisors","pre molars","molars"],
        answer: "canines",
      },
      {
        question: "4. ikkada unna teeth ni em antaru?",
        image: "/images/teeth/molars.png",
        options: ["canines","incisors","pre molars","molars"],
        answer: "molars",
      },
      {
        question: "5. ikkada unna teeth ni em antaru?",
        image: "/images/teeth/premolars.png",
        options: ["canines","incisors","pre molars","molars"],
        answer: "pre molars",
      }

    ],
    level3: [
      {
        question: "1. children ki enni teeth unatayi? ",
        options: ["32","20","14","34"],
        answer: "20",
      },
      {
        question: "2.food ni cut cheya daninki emi teeth use chestamu ? ",
        options: ["canines","incisors","pre molars","molars"],
        answer: "incisors",
      },
      {
        question: "3. food ni tear cheya daninki emi teeth use chestamu? ",
        options: ["canines","incisors","pre molars","molars"],
        answer: "canines",
      },
      {
        question: "4.. food ni push cheya daninki emi teeth use chestamu? ",
        options: ["canines","incisors","pre molars","molars"],
        answer: "pre molars",
      },
      {
        question: "5. food ni grind cheya daninki emi teeth use chestamu? ",
        options: ["canines","incisors","pre molars","molars"],
        answer: "molars",
      },
      {
        question: "6. manaki enni wisdom teeth unatayi?",
        options: ["3","2","4","1"],
        answer: "4",
      },
      
    ],
  },
};

export default function UOISystemPage() {
  const { system } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [level, setLevel] = useState("level0");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const systems = Object.keys(quizData);
  const systemData = quizData[system] || {};
  const questions = systemData[level] || [];
  const current = questions[currentQ];

  const handleLevelChange = (e) => {
    const newLevel = e.target.value;
    setLevel(newLevel);
    setCurrentQ(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsFinished(false);
  };

  const handleOptionClick = (opt) => {
  tapSound.play();
  setSelectedOption(opt);
  setShowFeedback(true);

  if (opt === current.answer) {
    twin(sfxRight, voiceRight);
    setTimeout(() => {
      if (currentQ + 1 < questions.length) {
        setCurrentQ(currentQ + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setIsFinished(true);
      }
    }, 800);
  } else {
    twin(sfxWrong, voiceWrong);
  }
};


  return (
    <div className="uoi-layout">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="uoi-sidebar">
          <h3>🧠 Systems</h3>
          {systems.map((sys) => (
            <button
              key={sys}
              className="sidebar-btn"
              onClick={() => navigate(`/uoi/${sys}`)}
            >
              {sys.charAt(0).toUpperCase() + sys.slice(1)} System
            </button>
          ))}
          <button className="sidebar-close-btn" onClick={toggleSidebar}>
            ⬅️
          </button>
        </div>
      )}

      {/* Main Page */}
      <div className="uoi-level-page">
        <div className="top-bar">
          {!sidebarOpen && (
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              📂 Menu
            </button>
          )}
          <button className="back-btn right" onClick={() => navigate(-1)}>🔙</button>
        </div>

        <h2 className="uoi-heading">🌍 {system?.toUpperCase()} SYSTEM</h2>

        {level === "level0" && (
          <video src={systemData.video} controls className="uoi-video" />
        )}

        {/* Show video only for level1 and if current question has a video */}
{level === "level1" && current?.video && (
  <video
    src={current.video}
    controls
    className="uoi-video"
  />
)}


        <select value={level} onChange={handleLevelChange} className="level-select">
          <option value="level0">📽️ Level 0 (Intro Video)</option>
          <option value="level1">🎬 Level 1 (Video Quiz)</option>
          <option value="level2">🖼️ Level 2 (Image Quiz)</option>
          <option value="level3">📝 Level 3 (Text Quiz)</option>
        </select>

        {level !== "level0" && !isFinished && current && (
          <div className="question-block">
            <h3 className="question">{current.question}</h3>

            {level === "level2" && current.image && (
              <img
                src={current.image}
                alt="visual"
                style={{ width: "600px",height: "200px" ,borderRadius: "0px", marginBottom: "10px" }}
              />
            )}

            <div className="options">
              {current.options.map((opt, index) => (
                <button
                  key={index}
                  className={`option-btn ${
                    showFeedback
                      ? opt === current.answer
                        ? "correct"
                        : opt === selectedOption
                        ? "wrong"
                        : ""
                      : ""
                  }`}
                  onClick={() => handleOptionClick(opt)}
                  disabled={showFeedback}
                >
                  {opt}
                </button>
              ))}
            </div>

            {showFeedback && (
              <p className="feedback">
                {selectedOption === current.answer ? "✅ Correct!" : "❌ Try again!"}
              </p>
            )}
          </div>
        )}

        {isFinished && (
          <p className="completion-message">
            🎉 You completed {level.toUpperCase()}!
          </p>
        )}
      </div>
    </div>
  );
}
