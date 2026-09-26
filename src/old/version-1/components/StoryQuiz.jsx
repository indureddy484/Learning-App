import React, { useState } from "react";
import "./StoryQuiz.css";
import { useNavigate } from "react-router-dom";

// 📘 Replace this with your real data
const levelDescriptions = ["💧 Potty Story", "🍎 Field Story", "Phone Story", "Item Story"];

const quizByLevel = {
    1: [
    { question:"Rohit ekkadiki veltunnadu?", options:["Mam intiki","school ki","bath room ki", "ammamma valla intki"], answer:"Mam intiki",   video:"/videos/level1/vid1.mp4" },
    { question:"Rohit em ekkutunnadu?",      options:["Car", "Auto", "Bus","Aeroplane"],       answer:"Auto",  video:"/videos/level1/vid1.mp4" },
    { question:"Rohit and shalom m chestunaru?",  options:["Carroms aadutunaru","Cricket aadutunaru","Padukunaru","TV chustunaru"],          answer:"Carroms aadutunaru", video:"/videos/level1/vid2.mp4" },
    { question:"Rohit and shalom m chestunaru?",  options:["Carroms aadutunaru","Cricket aadutunaru","Padukunaru","TV chustunaru"],          answer:"Padukunaru",  video:"/videos/level1/vid3.mp4" },
    { question:"Rohit and shalom eppudu padukunaru?",  options:["night ayaka", "Sun vachaka"],          answer:"night ayaka", video:"/videos/level1/vid3.mp4" },
    { question:"ee scene eppudu ayindhi?",  options:["night", "morning"],          answer:"morning", video:"/videos/level1/vid4.mp4" },
    { question:"Rohit em chestunadu?",  options:["edustunadu", "navvutunadu", "aadutunadu", "padukunadu"],          answer:"edustunadu", video:"/videos/level1/vid6.mp4" },
    { question:"Rohit enduku edustunadu?",  options:["akali vestundi", "mam kottaru", "potty vastundi", "amma thittindi"],          answer:"potty vastundi", video:"/videos/level1/vid6.mp4" },
    { question:"Doctor em chestunaru?",  options:["aadtunaru",  "injection istunaru","thidutunaru", "ointment rastunaru"],          answer:"injection istunaru", video:"/videos/level1/vid7.mp4" },
    { question:"Moral of the story enti?",  options:["potty vachinapdu vellali", "potty vellakudadhu"],          answer:"potty vachinapdu vellali", video:"/videos/level1/vid9.mp4" }
    ],
  2: [
    { question:"ee scene avaru unaru?", options:["charan and amma", "only amma", "avaru leru", "charan, amma and nanna"], answer:"charan and amma", video:"/videos/level2/scene1.mp4" },
    { question:"Amma and charan akada unaru?", options:["play ground lo unaru","flowers dagara unaru","field lo unaru","shop lo unaru"], answer:"field lo unaru", video:"/videos/level2/scene2.mp4" },
    { question:"charan em cheptunadu?", options:["amma vellipodam ani cheptunadu","amma nen water postanu ani cheptunadu","silent ga unadu","aadukunatanu ani cheptunadu"], answer:"amma nen water postanu ani cheptunadu", video:"/videos/level2/scene3.mp4" },
    { question:"charan em chestunadu?", options:["chocolate vestunadu","fruit vestunadu","ice-cream vestunadu","water tho aadukuntunadu"], answer:"water tho aadukuntunadu", video:"/videos/level2/scene4.mp4" },
    { question:"charan ki amma em cheptundi?", options:["nka kasepu aaduko charan ani chptundi","water veyakudadhu charan ani chptundhi","ice-cream tinu chranu ani cheptundhi","time ayindhi chran nka intiki veldamu ani cheptundhi"], answer:"time ayindhi chran nka intiki veldamu ani cheptundhi", video:"/videos/level2/scene5.mp4" },
    { question:"ee scene eppudu ayindhi?",          options:["morning", "night"], answer:"night", video:"/videos/level2/scene7.mp4" },
    { question:"ee story moral enti?", options:["field lo aadukovali","mokkalaki water poyali","field lo ice-cream thinali","field lo fruits thinali"], answer:"mokkalaki water poyali", video:"/videos/level2/scene4.mp4" }
  ],
  3: [
    { question:"Phone story first scene nti?", options:["Balu aadutunadu","Balu bed paina nundi lechadu","Balu song padutunadu","Balu dance chestunadu"], answer:"Balu bed paina nundi lechadu", video:"/videos/level3/video1.mp4" },
    { question:"Balu phone lo em chestunadu?", options:["Subway aadutunadu","Call chestunadu","Songs vintunadu","Drawing videos chustunadu"], answer:"Subway aadutunadu", video:"/videos/level3/video2.mp4" },
    { question:"Balu eyes ala ayayi?", options:["red ayayi","emi avaledhu"], answer:"red ayayi", video:"/videos/level3/video3.mp4" },
    { question:"Balu eyes enduku red ayayi?", options:["Adukunadu kabatti","Amma thittindi kabatii","Phone chusadu kabatti","Thammu tho adukunadu kabatti"], answer:"Phone chusadu kabatti", video:"/videos/level3/video3.mp4" },
    { question:"Doctor em chestunaru ee scene lo?", options:["injection vestuanru", "ointment rastunaru", "matladutunaru", "silent ga unaru"], answer:"injection vestuanru", video:"/videos/level3/video4.mp4" },
    { question:"Balu em chptunadu?", options:["Phone battery charge chesukovali kabatti chudanu", "sorry, Phone akuva chudanu","Phone chustanu"], answer:"sorry, Phone akuva chudanu", video:"/videos/level3/video5.mp4" },
    { question:"ee story moral enti?", options:["Phone chudali","Doctor dagariki vellakudadhu","Phone akuva sepu chudakudadhu","Akuva games adukovali phone lo"], answer:"Phone akuva sepu chudakudadhu", video:"/videos/level3/video7.mp4" }
  ],
  4: [
    { question:"ee scene lo evaru unaru?", options:["Gopal and mam","Gopal and nanna","Gopal and shalom","Gopal, shalom and amma"], answer:"Gopal and mam", video:"/videos/level4/video1.mp4" },
    { question:"Mam gopal ki em chptu undhi?", options:["Aaduko ani chptundhi","Silent ga undu ani chptu undhi","Phone chudu ani chptundhi","Diary raayu ani chptundhi"], answer:"Diary raayu ani chptundhi", video:"/videos/level4/video1.mp4" },
    { question:"Compass box lo em unnayi?", options:["Pens unayi","Em levu","Pencils unayi","Eraser undhi"], answer:"Em levu", video:"/videos/level4/video2.mp4" },
    { question:"Pencil box lo pencil, sharpner evaru tisaru?", options:["Mam tisaru","Amma tisindhi","Avaru tiya ledhu","Gopal and thammu  tisaru"], answer:"Gopal and thammu  tisaru", video:"/videos/level4/video3.mp4" },
    { question:"Mam enduku punishment icharu?", options:["Gopal allari chesadu kabtti","Gopal pencils anni padesadu kabatti","Gopal silent ga unadu kabatti","Gopal crying chesadu kabatti"], answer:"Gopal pencils anni padesadu kabatti", video:"/videos/level4/video4.mp4" },
    { question:"ee scene lo mam ala unaru?", options:["Mam happy ga unnaru","Mam sad ga unaru","Mam kopam ga unaru","Mam silent ga unaru"], answer:"Mam kopam ga unaru", video:"/videos/level4/video4.mp4" },
    { question:"Gopal avariki sorry ani chptu unadu?", options:["Amma ki","Mam ki","thammu ki","Amma ki"], answer:"Mam ki", video:"/videos/level4/video5.mp4" },
    { question:"ee story moral enti?", options:["Mana items anni padeyali","Diary rayali roju","Phone lo games adukovali","Mana Items maname jagrataga chusu kovali"], answer:"Mana Items maname jagrataga chusu kovali", video:"/videos/level4/video6.mp4" }
  ]
};
const sfxRight = new Audio("/sounds/success-1-6297.mp3");
const sfxWrong = new Audio("/sounds/fail-2-277575.mp3");
const voiceRight = new Audio("/sounds/very-good.mp3");
const voiceWrong = new Audio("/sounds/try-again.mp3");
const tapSound = new Audio("/sounds/tap.mp3");

const playSound = (audio) => {
  audio.currentTime = 0;
  audio.play().catch(() => {});
};

const playPair = (a, b) => {
  playSound(a);
  playSound(b);
};

export default function StoryQuiz() {
  const [level, setLevel] = useState(1);
  const [index, setIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();

  const questions = quizByLevel[level] || [];
  const question = questions[index] || null;

  const handleAnswer = (opt) => {
    if (!question) return;

    setSelectedOpt(opt);

    if (opt === question.answer) {
  playPair(sfxRight, voiceRight);
  setFeedback("✅ Very good Suhaas!");
  setTimeout(() => {
    setSelectedOpt(null);
    setFeedback("");
    if (index + 1 === questions.length) {
      setComplete(true);
    } else {
      setIndex(index + 1);
    }
  }, 2000);
} else {
  playPair(sfxWrong, voiceWrong);
  setFeedback("❌ Malli try cheyu Suhaas!");
  setTimeout(() => {
    setSelectedOpt(null);
    setFeedback("");
  }, 3000);
}

  };

  return (
    <div className="quiz-modal">
      <button className="back-btn" onClick={() => navigate("/")}>🔙</button>
      <h2>{levelDescriptions[level - 1]}</h2>

      <select
        value={level}
        onChange={(e) => {
          setLevel(+e.target.value);
          setIndex(0);
          setSelectedOpt(null);
          setFeedback("");
          setComplete(false);
        }}
        className="level-select"
      >
        {[1, 2, 3, 4].map((l) => (
          <option key={l} value={l}>Level {l}</option>
        ))}
      </select>

      {/* ✅ Show fallback if no question found */}
      {!question ? (
        <p>No questions found for this level.</p>
      ) : complete ? (
        <h3>🎉 Quiz Completed!</h3>
      ) : (
        <>
          {question.video && (
            <video
              src={question.video}
              autoPlay
              muted
              loop
              playsInline
              className="quiz-video"
            />
          )}

          <h3>{question.question}</h3>

          <div className="quiz-options">
            {question.options.map((opt, i) => {
              const isCorrect = selectedOpt === opt && opt === question.answer;
              const isWrong = selectedOpt === opt && opt !== question.answer;
              return (
                <button
                  key={i}
                  className={`quiz-option ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                  disabled={!!selectedOpt}
                  onClick={() => {
  playSound(tapSound);
  handleAnswer(opt);
}}

                >
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && <p className="quiz-msg">{feedback}</p>}
        </>
      )}
    </div>
  );
}
