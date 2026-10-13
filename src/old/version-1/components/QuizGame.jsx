import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./QuizGame.css";

const play = (a) => {
  a.currentTime = 0;
  a.play().catch(() => {});
};
const twin = (a, b) => {
  play(a);
  play(b);
};

const sfxRight = new Audio("/sounds/success-1-6297.mp3");
const sfxWrong = new Audio("/sounds/fail-2-277575.mp3");
const voiceRight = new Audio("/sounds/very-good.mp3");
const voiceWrong = new Audio("/sounds/try-again.mp3");
const tapSound = new Audio("/sounds/tap.mp3");

const speakText = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);

  // Detect if the text contains Telugu Unicode characters
  const isTelugu = /[\u0C00-\u0C7F]/.test(text);

  utterance.lang = isTelugu ? "te-IN" : "en-IN"; // Telugu or English
  utterance.pitch = 1.2;
  utterance.rate = 0.9;
  utterance.volume = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};


// 🧠 Quiz data
const quizData = {
  howmany: [
  {
    image: "/images/Howmany/pic1.jpg",
    questions: [
      { question: "ikkada enni items unnayi ?", options: ["2", "3", "4", "9"], answer: "9" },
      { question: "Ikkada emi unnayi?", options: ["Persons", "Items", "Animals", "Birds"], answer: "Items" },
      { question: "Ikkada enni red balls unnayi?", options: ["2", "3", "4", "5"], answer: "2" },
      { question: "Ikkada enni cars unnai?", options: ["2", "3", "4", "5"], answer: "5" },
      { question: "Ikkada enni robots unnai?", options: ["2", "3", "4", "5"], answer: "2" },
      
    ]
  },
  {
    image: "/images/Howmany/pic2.jpg",
    questions: [
      { question: "Ikkada enni animals unnayi?", options: ["2", "3", "8", "5"], answer: "8" },
      { question: "Ikkada emi unnayi?", options: ["Animals", "Birds", "Items", "Persons"], answer: "Animals" },
      { question: "Ikkada enni monkeys unnayi?", options: ["2", "3", "4", "5"], answer: "2" },
      { question: "Ikkada enni elephants unnayi?", options: ["2", "3", "4", "5"], answer: "4" },
      { question: "Ikkada enni giraffees unnayi?", options: ["2", "3", "4", "5"], answer: "2" },
      { question: "Ikkada enni snakes unnayi?", options: ["2", "3", "1", "5"], answer: "1" }
    ]
  },
  {
    image: "/images/Howmany/pic3.png",
    questions: [
      { question: "Ikkada evaru unnaru?", options: ["Persons", "Items", "Animals", "Birds"], answer: "persons" },
      { question: "Ikkada enni girls unnaru?", options: ["2", "3", "4", "5"], answer: "2" },
      { question: "Ikkada enni boys unnaru?", options: ["2", "3", "4", "5"], answer: "3" }
    ]
  },
  {
    image: "/images/Howmany/pic4.png",
    questions: [
      { question: "Ikkada enni persons unnaru?", options: ["2", "3", "4", "5"], answer: "2" },
      { question: "Ikkada enni animals unnayi?", options: ["0", "2", "1", "4"], answer: "1" },
      { question: "Ikkada enni items unnayi?", options: ["2", "3", "4", "5"], answer: "4" },
      { question: "Ikkada enni green cars unnayi?", options: ["2", "1", "4", "5"], answer: "1" }
    ]
  }
],
  prepositions: [
    {
      image: "/images/prepositions/pic1.png",
      questions: [
        { question: " CAT CHAIR ______________UNDI.", options: ["Lopala", "Paina", "Kinda"], answer: "Kinda" }
      ]
    },
    {
      image: "/images/prepositions/pic2.png",
      questions: [
        { question: "BOOK TABLE ______________UNDI.", options: ["Lopala", "Paina", "Kinda"], answer: "Paina" }
      ]
    },
    {
      image: "/images/prepositions/pic3.png",
      questions: [
        { question: "FRUITS BASKET ______________UNNAYI.", options: ["Lopala", "Paina", "Kinda"], answer: "Lopala" }
      ]
    },
    {
      image: "/images/prepositions/pic4.png",
      questions: [
        { question: "PIGEON CHETHI  ______________UNDI.", options: ["Lopala", "Paina", "Kinda"], answer: "Paina" }
      ]
    },
    {
      image: "/images/prepositions/pic5.png",
      questions: [
        { question: "APPLE TABLE ______________UNDI.", options: ["Lopala", "Paina", "Kinda"], answer: "Paina" }
      ]
    },
    {
      image: "/images/prepositions/pic6.png",
      questions: [
        { question: "BOX ______________ BALL UNDI.", options: ["Lopala", "Paina", "Kinda"], answer: "Lopala" }
      ]
    },
    {
      image: "/images/prepositions/pic7.png",
      questions: [
        { question: "DOG SOFA ______________UNDI.", options: ["Lopala", "Paina", "Kinda"], answer: "Paina" }
      ]
    },
    {
      image: "/images/prepositions/pic8.png",
      questions: [
        { question: "BALL TABLE ______________UNDI.", options: ["Lopala", "Paina", "Kinda"], answer: "Kinda" }
      ]
    },
    {
      image: "/images/prepositions/pic9.png",
      questions: [
        { question: "CAT SOFA ______________UNDI.", options: ["Lopala", "Paina", "Kinda"], answer: "Kinda" }
      ]
    },
    {
      image: "/images/prepositions/pic10.png",
      questions: [
        { question: "BAG CHAIR ______________UNDI.", options: ["Lopala", "Paina", "Kinda"], answer: "Paina" }
      ]
    }
  ],
  adjectives: [
    {
      image: "/images/adjectives/pic1.png",
      questions: [
        { question: "Apple em colour lo undi", options: ["Green", "Blue", "Red", "Yellow"], answer: "Red" }
      ],
    },
    { 
    image: "/images/adjectives/pic2.png",
      questions: [
        { question: "Dog em colour lo undi?", options: ["Green", "Blue", "Black", "Yellow"], answer: "Black" }
      ]
    },
    {
      image: "/images/adjectives/pic3.png",
      questions: [
        { question: "BOX ______ ball undi.", options: ["Lopala", "paina", "Kinda"], answer: "Lopala" },
        { question: "Ball em colour lo undi?", options: ["Green", "Blue", "Black", "Yellow"], answer: "Yellow" }
      ]
    },
    
    {
      image: "/images/adjectives/pic5.png",
      questions: [
        { question: "Elephant _________ga undi.", options: ["Big", "Small"], answer: "Big" },
        { question: "CAT _________ga undi.", options: ["Big", "Small"], answer: "Small" }
      ]
    },
    {
      image: "/images/adjectives/pic6.png",
      questions: [
        { question: "BAG _________ga undi.", options: ["Big", "Small"], answer: "Big" },
        { question: "BOTTLE _________ga undi.", options: ["Big", "Small"], answer: "Small" }
      ] 
    }
  ],
  misc: [
    {
      image: "/images/misc/pic1.png",
      questions: [
        { question: "Ikkada evaru unanru?", options: ["Riya", "Amma", "Nanna"], answer: "Riya" },
        { question: "Ikkada emi animal undi", options: ["Cat", "Rabbit", "Elephant"], answer: "Rabbit" },
        { question: "Idi eppudu?", options: ["Day", "Night"], answer: "Day" }
      ]
    },
    {
      image: "/images/misc/pic2.png",
      questions: [
        { question: "Laptop table __________undi. ", options: ["Lopala", "paina", "Kinda"], answer: "paina" }
      ]
    },
    {
      image: "/images/misc/pic3.png",
      questions: [
        { question: "Monkey _________ga undi. ", options: ["Big", "Small"], answer: "Small" },
        { question: "Girafee___gs undi. ", options: ["Big", "Small"], answer: "Big" }
      ]
    },
    {
      image: "/images/misc/pic4.png",
      questions: [
        { question: " BALL BOX _________ UNDI. ", options: ["Lopala", "paina", "Kinda"], answer: "Lopala" },
        { question: " BALL EMI COLOUR LO UNDI? ", options: ["Red", "Blue", "Black"], answer: "Red" }
      ]
    },
    {
      image: "/images/misc/pic5.png",
      questions: [
        { question: "Ikkada evaru unnaaru?", options: ["Person", "Animal"], answer: "Person" },
        { question: "BOY CHAIR __________ KURCHONI UNNADU. ", options: ["Lopala", "Kinda", "Paina"], answer: "Paina" }
      ]
    },
    {
      image: "/images/misc/pic6.png",
      questions: [
        { question: "Idi eppudu? ", options: ["Day", "Night"], answer: "Night" },
        { question: "Ikkada evaru unnaru?", options: ["Person", "Animal"], answer: "Person" }
      ]
    },
    {
      image: "/images/misc/pic7.png",
      questions: [
        { question: "DOG SOFA ________ undi. ", options: ["Lopala", "Paina", "Kinda"], answer: "Paina"},
        { question: "Ikkada emi unnai", options: ["Person", "Items", "Animal"], answer: "Animal" }
      ]
    },
    {
      image: "/images/misc/pic8.png",
      questions: [
        { question: "BALL TABLE __________UNDI. ", options: ["Lopala", "paina", "Kinda"], answer: "Kinda" }
      ]
    },
    {
      image: "/images/misc/pic9.png",
      questions: [
        { question: "Idi eppudu?", options: ["Day", "Night"], answer: "Day" }
      ]
    },
    {
      image: "/images/misc/pic10.png",
      questions: [
        { question: "Ikkada evaru unnaaru?", options: ["Surya", "Riya"], answer: "Surya" },
        { question: "Ikkada emi animal undhi?", options: ["Rabbit", "Dog"], answer: "Dog" }
      ]
    }
  ]
};

const QuizGame = ({ playerName }) => {
  const { subject, topic } = useParams();
  const navigate = useNavigate();

  const originalQuizData = quizData[topic] || [];
  const [imageIndex, setImageIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showStar, setShowStar] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const currentSet = originalQuizData[imageIndex];
  const currentQuestion = currentSet?.questions[questionIndex];

  const currentGlobalIndex = originalQuizData
    .slice(0, imageIndex)
    .reduce((sum, q) => sum + q.questions.length, 0) + questionIndex;

  const handleAnswer = (option) => {
    play(tapSound);
    setSelectedOption(option);
    const correct = option.toLowerCase() === currentQuestion.answer.toLowerCase();
    setIsCorrect(correct);

    const newHistory = [...answerHistory];

    if (correct) {
      setFeedback("✅ Correct!");
      twin(sfxRight, voiceRight);
      setShowStar(true);
      newHistory[currentGlobalIndex] =
        newHistory[currentGlobalIndex] === "wrong" ? "wrong" : "right";
      setAnswerHistory(newHistory);

      setTimeout(() => {
        setShowStar(false);
        setFeedback("");
        setSelectedOption(null);
        setIsCorrect(null);

        if (questionIndex < currentSet.questions.length - 1) {
          setQuestionIndex(questionIndex + 1);
        } else if (imageIndex < originalQuizData.length - 1) {
          setImageIndex(imageIndex + 1);
          setQuestionIndex(0);
        } else {
          setQuizFinished(true);
        }
      }, 1200);
    } else {
      setFeedback("❌ Wrong, try again!");
      twin(sfxWrong, voiceWrong);
      newHistory[currentGlobalIndex] = "wrong";
      setAnswerHistory(newHistory);
    }
  };

  const restartQuiz = () => {
    setImageIndex(0);
    setQuestionIndex(0);
    setQuizFinished(false);
    setFeedback("");
    setAnswerHistory([]);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const goBack = () => {
    navigate(`/quiz/${subject}`);
  };

  // 🔊 Auto speak on load
  useEffect(() => {
    if (currentQuestion && isSpeakerOn) {
      speakText(currentQuestion.question);
    }
  }, [currentQuestion, isSpeakerOn]);

  // 🔇 Cancel speech when toggled off
  useEffect(() => {
    if (!isSpeakerOn) {
      window.speechSynthesis.cancel();
    }
  }, [isSpeakerOn]);

  if (!currentQuestion) {
    return (
      <div className="quiz-container">
        <h2>No questions found for topic: {topic}</h2>
        <button className="restart-btn" onClick={goBack}>🔙 Back</button>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="quiz-container final-screen">
        <h2>🎉 Shabash {playerName || "Suhaas"}! You completed the quiz!</h2>
        <button className="restart-btn" onClick={restartQuiz}>🔁 Play Again</button>
        <button className="restart-btn" onClick={goBack}>🏠 Back to Topics</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <button className="back-button-top-left" onClick={goBack}>🏠</button>

      <div className="progress-bar">
        {currentSet.questions.map((_, idx) => {
          const globalIndex = originalQuizData
            .slice(0, imageIndex)
            .reduce((sum, q) => sum + q.questions.length, 0) + idx;
          const status = answerHistory[globalIndex];
          return (
            <span key={idx} className={`dot ${status || "pending"}`}>
              {status === "right" ? "🟢" : status === "wrong" ? "🔴" : "⚪"}
            </span>
          );
        })}
      </div>

      <div className="quiz-content">
        <img src={currentSet.image} alt="Quiz" className="quiz-image" />

        <div className="question-box">
          <h2>
            {currentQuestion.question}
            
          </h2>

          {/* ✅ Toggle Speaker On/Off */}
          <button
            className="speaker-toggle-btn"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          >
            {isSpeakerOn ? "🔊 Speaker On" : "🔇 Speaker Off"}
          </button>

          <div className="options">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const buttonClass = isSelected
                ? isCorrect
                  ? "option-btn correct"
                  : "option-btn wrong"
                : "option-btn";

              return (
                <button
                  key={idx}
                  className={buttonClass}
                  onClick={() => handleAnswer(opt)}
                  disabled={isCorrect === true}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <p
            className={`feedback ${
              feedback.includes("Correct") ? "correct" : feedback.includes("Wrong") ? "wrong" : ""
            }`}
          >
            {feedback}
          </p>
        </div>
      </div>

      {showStar && <div className="star-animation">🌟</div>}
    </div>
  );
};

export default QuizGame;