import React, { useEffect, useState } from "react";



import "./MixedOrderPicture.css";

import "./MixedOrderPicture.analysis.css";
import MixedOrderPictureWorksheet from "./MixedOrderPictureWorksheet";



// =====================================



// SOUND FILES



// =====================================



const VERY_GOOD_SOUND = "/sounds/very-good.mp3";



const TRY_AGAIN_SOUND = "/sounds/try-again.mp3";



function playSound(soundPath) {



  const audio = new Audio(soundPath);



  audio.play().catch((error) => {



    console.warn("Unable to play sound:", error);



  });



}



// =====================================



// LOAD IMAGES



// =====================================



const imageFiles = require.context(



  "../../../assets/images/ascending-order",



  false,



  /\.png$/i



);



// =====================================



// SHUFFLE HELPER



// =====================================



function shuffleItems(items) {



  const shuffled = [...items];



  for (let i = shuffled.length - 1; i > 0; i--) {



    const j = Math.floor(Math.random() * (i + 1));



    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];



  }



  return shuffled;



}



// =====================================



// GENERATE IMAGE COLLECTIONS



// =====================================



function generateImageCollections() {



  const collections = {};



  imageFiles.keys().forEach((path) => {



    const filename = path



      .replace("./", "")



      .replace(/\.png$/i, "");



    const match = filename.match(



      /^(.*)_(\d+)_(smallest|small|medium|largest)$/i



    );



    if (!match) {



      console.warn("Invalid image filename:", filename);



      return;



    }



    const category = match[1];



    const order = Number(match[2]);



    if (!collections[category]) {



      collections[category] = [];



    }



    const importedImage = imageFiles(path);



    const imageUrl = importedImage.default || importedImage;



    collections[category].push({



      id: `${category}_${order}`,



      size: 55 + (order - 1) * 30,



      order,



      image: imageUrl,



    });



  });



  return Object.entries(collections)



    .map(([category, items]) => ({



      id: category,



      items: [...items].sort((a, b) => a.order - b.order),



    }))



    .filter((collection) => {



      return (



        collection.items.length === 4 &&



        new Set(collection.items.map((item) => item.order)).size === 4



      );



    });



}



const IMAGE_COLLECTIONS = generateImageCollections();



// =====================================



// GENERATE MIXED QUESTIONS



// =====================================



function createMixedQuestions() {



  const questions = [];



  IMAGE_COLLECTIONS.forEach((collection) => {



    const items = collection.items;



    questions.push({



      id: `${collection.id}_ascending`,



      type: "ascending",



      items: shuffleItems(items),



      originalItems: items,



    });



    questions.push({



      id: `${collection.id}_descending`,



      type: "descending",



      items: shuffleItems(items),



      originalItems: items,



    });



    questions.push({



      id: `${collection.id}_biggest`,



      type: "biggest",



      items: shuffleItems(items),



      originalItems: items,



    });



    questions.push({



      id: `${collection.id}_smallest`,



      type: "smallest",



      items: shuffleItems(items),



      originalItems: items,



    });



  });



  return shuffleItems(questions);



}



// =====================================



// QUESTION HELPERS



// =====================================



function getInstruction(type) {



  if (type === "ascending") {



    return "Arrange from Smallest to Biggest";



  }



  if (type === "descending") {



    return "Arrange from Biggest to Smallest";



  }



  if (type === "biggest") {



    return "Which one is the Biggest?";



  }



  return "Which one is the Smallest?";



}



function getCorrectOrder(question) {



  if (question.type === "ascending") {



    return [...question.originalItems]



      .sort((a, b) => a.order - b.order)



      .map((item) => item.id);



  }



  if (question.type === "descending") {



    return [...question.originalItems]



      .sort((a, b) => b.order - a.order)



      .map((item) => item.id);



  }



  return [];



}



function getCorrectChoice(question) {



  if (question.type === "biggest") {



    return question.originalItems.reduce((largest, item) =>



      item.order > largest.order ? item : largest



    );



  }



  if (question.type === "smallest") {



    return question.originalItems.reduce((smallest, item) =>



      item.order < smallest.order ? item : smallest



    );



  }



  return null;



}



function getItemLabel(item) {



  if (!item) return "Not answered";



  const labels = {



    1: "Smallest",



    2: "Small",



    3: "Medium",



    4: "Largest",



  };



  return labels[item.order] || `Size ${item.order}`;



}



function formatTime(seconds) {



  const minutes = Math.floor(seconds / 60);



  const remainingSeconds = seconds % 60;



  return `${String(minutes).padStart(2, "0")}:${String(



    remainingSeconds



  ).padStart(2, "0")}`;



}



// =====================================



// PICTURE TILE



// =====================================



function PictureTile({ item, onClick, disabled = false }) {



  return (



    <button



      type="button"



      className="aop-pic"



      onClick={onClick}



      disabled={disabled}



      draggable={!disabled}



      onDragStart={(event) => {



        event.dataTransfer.setData("text/plain", item.id);



      }}



      aria-label="Select picture"



    >



      <span



        className="aop-photo-wrap"



        style={{ height: `${item.size}px` }}



      >



        <img



          src={item.image}



          alt="Object"



          draggable="false"



        />



      </span>



    </button>



  );



}



// =====================================



// MAIN COMPONENT



// =====================================



export default function MixedOrderPicture({ onBack }) {



  const [questions, setQuestions] = useState(() =>



    createMixedQuestions()



  );



  const [questionIndex, setQuestionIndex] = useState(0);



  const [answer, setAnswer] = useState([



    null,



    null,



    null,



    null,



  ]);



  const [selectedChoice, setSelectedChoice] = useState(null);



  const [feedback, setFeedback] = useState("");



  const [score, setScore] = useState(0);



  const [isChecking, setIsChecking] = useState(false);



  // =====================================



  // QUIZ STATES



  // =====================================



  const [showQuizSetup, setShowQuizSetup] = useState(false);

  const [showWorksheet, setShowWorksheet] = useState(false);



  const [quizDuration, setQuizDuration] = useState(5);



  const [quizActive, setQuizActive] = useState(false);



  const [quizCompleted, setQuizCompleted] = useState(false);



  const [timeLeft, setTimeLeft] = useState(0);



  // Responses are saved as the student answers each question.



  const [quizResponses, setQuizResponses] = useState({});



  // =====================================



  // QUIZ TIMER



  // =====================================



  useEffect(() => {



    if (!quizActive) return;



    if (timeLeft <= 0) {



      setQuizActive(false);



      setQuizCompleted(true);



      return;



    }



    const timer = window.setInterval(() => {



      setTimeLeft((current) => current - 1);



    }, 1000);



    return () => window.clearInterval(timer);



  }, [quizActive, timeLeft]);



  // =====================================



  // SAFETY CHECK



  // =====================================



  if (IMAGE_COLLECTIONS.length === 0) {



    return (



      <main className="aop-page">



        <section className="aop-result">



          <h1>No questions available</h1>



          <p>



            Please add four correctly named PNG images



            for each collection.



          </p>



          <button



            type="button"



            className="aop-clear"



            onClick={onBack}



          >



            Back



          </button>



        </section>



      </main>



    );



  }



  const question = questions[questionIndex];



  if (!question) {



    return null;



  }



  const isOrderQuestion =



    question.type === "ascending" ||



    question.type === "descending";



  const available = question.items.filter(



    (item) => !answer.includes(item.id)



  );



  const instruction = getInstruction(question.type);



  const correctOrder = getCorrectOrder(question);



  const correctChoice = getCorrectChoice(question);



  // =====================================



  // RESET CURRENT QUESTION



  // =====================================



  function resetCurrentAnswer() {



    setAnswer([null, null, null, null]);



    setSelectedChoice(null);



    setFeedback("");



    setIsChecking(false);



  }



  // =====================================



  // MOVE TO NEXT PRACTICE QUESTION



  // =====================================



  function moveToNextQuestion() {



    if (questionIndex < questions.length - 1) {



      setQuestionIndex((index) => index + 1);



    } else {



      setQuestions(createMixedQuestions());



      setQuestionIndex(0);



    }



    resetCurrentAnswer();



  }



  // =====================================



  // PRACTICE ANSWER EVALUATION



  // =====================================



  function evaluateAnswer(isCorrect, resetAfterWrong = false) {



    if (isChecking) return;



    setIsChecking(true);



    if (isCorrect) {



      setFeedback("success");



      setScore((value) => value + 1);



      playSound(VERY_GOOD_SOUND);



      window.setTimeout(() => {



        moveToNextQuestion();



      }, 1500);



    } else {



      setFeedback("wrong");



      playSound(TRY_AGAIN_SOUND);



      if (resetAfterWrong) {



        setAnswer([null, null, null, null]);



      }



      setIsChecking(false);



    }



  }



  // =====================================



  // PRACTICE ORDER CHECK



  // =====================================



  function evaluateOrder(nextAnswer) {



    const isCorrect = nextAnswer.every(



      (id, index) => id === correctOrder[index]



    );



    evaluateAnswer(isCorrect, true);



  }



  // =====================================



  // PLACE PICTURE IN ANSWER SLOT



  // =====================================



  function placeItem(itemId, slotIndex) {



    if (



      !itemId ||



      isChecking ||



      feedback === "success"



    ) {



      return;



    }



    const next = [...answer];



    const previousIndex = next.indexOf(itemId);



    const displacedId = next[slotIndex];



    if (previousIndex !== -1) {



      next[previousIndex] = displacedId || null;



    }



    next[slotIndex] = itemId;



    setAnswer(next);



    if (quizActive) {



      setQuizResponses((previous) => ({



        ...previous,



        [question.id]: {



          type: "order",



          answer: next,



        },



      }));



      return;



    }



    if (next.every(Boolean)) {



      evaluateOrder(next);



    } else {



      setFeedback("");



    }



  }



  // =====================================



  // SINGLE-CLICK ORDER PLACEMENT



  // =====================================



  function handlePictureClick(itemId) {



    if (



      isChecking ||



      feedback === "success"



    ) {



      return;



    }



    const nextEmptySlot = answer.findIndex(



      (value) => value === null



    );



    if (nextEmptySlot !== -1) {



      placeItem(itemId, nextEmptySlot);



    }



  }



  // =====================================



  // BIGGEST / SMALLEST SELECTION



  // =====================================



  function handleChoice(item) {



    if (



      isChecking ||



      feedback === "success"



    ) {



      return;



    }



    if (quizActive) {



      setSelectedChoice(item.id);



      setQuizResponses((previous) => ({



        ...previous,



        [question.id]: {



          type: "choice",



          answer: item.id,



        },



      }));



      return;



    }



    evaluateAnswer(item.id === correctChoice.id, false);



  }



  // =====================================



  // REMOVE PICTURE



  // =====================================



  function removeItem(slotIndex) {



    if (



      isChecking ||



      feedback === "success"



    ) {



      return;



    }



    const next = answer.map((value, index) =>



      index === slotIndex ? null : value



    );



    setAnswer(next);



    if (quizActive) {



      setQuizResponses((previous) => ({



        ...previous,



        [question.id]: {



          type: "order",



          answer: next,



        },



      }));



    }



    setFeedback("");



  }



  // =====================================



  // CLEAR ANSWER



  // =====================================



  function resetQuestion() {



    if (



      isChecking ||



      feedback === "success"



    ) {



      return;



    }



    setAnswer([null, null, null, null]);



    setFeedback("");



    if (quizActive) {



      setQuizResponses((previous) => ({



        ...previous,



        [question.id]: {



          type: "order",



          answer: [null, null, null, null],



        },



      }));



    }



  }



  // =====================================



  // START QUIZ



  // =====================================



  function startQuiz() {



    const newQuestions = createMixedQuestions();



    setQuestions(newQuestions);



    setQuestionIndex(0);



    setAnswer([null, null, null, null]);



    setSelectedChoice(null);



    setFeedback("");



    setScore(0);



    setIsChecking(false);



    setQuizResponses({});



    setTimeLeft(quizDuration * 60);



    setShowQuizSetup(false);



    setQuizCompleted(false);



    setQuizActive(true);



  }



  // =====================================



  // END QUIZ



  // =====================================



  function endQuiz() {



    setQuizActive(false);



    setQuizCompleted(true);



    setFeedback("");



  }



  // =====================================



  // NEXT QUIZ QUESTION



  // =====================================



  function nextQuizQuestion() {



    if (questionIndex < questions.length - 1) {



      setQuestionIndex((index) => index + 1);



      resetCurrentAnswer();



    } else {



      endQuiz();



    }



  }



  // =====================================



  // QUIZ ANALYSIS



  // =====================================



  const analysis = questions.map((currentQuestion, index) => {



    const response = quizResponses[currentQuestion.id];



    const isOrder =



      currentQuestion.type === "ascending" ||



      currentQuestion.type === "descending";



    const correct = isOrder



      ? getCorrectOrder(currentQuestion)



      : getCorrectChoice(currentQuestion)?.id;



    const submitted = response?.answer;



    let status = "unanswered";



    let isCorrect = false;



    let isIncomplete = false;



    if (isOrder) {



      const submittedOrder = Array.isArray(submitted)



        ? submitted



        : [];



      const answeredCount = submittedOrder.filter(Boolean).length;



      if (answeredCount === 0) {



        status = "unanswered";



      } else if (answeredCount < 4) {



        status = "incomplete";



        isIncomplete = true;



      } else {



        isCorrect = submittedOrder.every(



          (id, position) => id === correct[position]



        );



        status = isCorrect ? "correct" : "wrong";



      }



    } else if (!submitted) {



      status = "unanswered";



    } else {



      isCorrect = submitted === correct;



      status = isCorrect ? "correct" : "wrong";



    }



    return {



      question: currentQuestion,



      index,



      response,



      correct,



      submitted,



      status,



      isCorrect,



      isIncomplete,



    };



  });



  // Show only questions where the student submitted at least part of an answer.

  // Fully unanswered questions remain included in the summary counts, but are

  // intentionally hidden from the question-wise review cards.

  const attemptedAnalysis = analysis.filter(

    (item) => item.status !== "unanswered"

  );



  const correctCount = analysis.filter(



    (item) => item.status === "correct"



  ).length;



  const wrongCount = analysis.filter(



    (item) => item.status === "wrong"



  ).length;



  const unansweredCount = analysis.filter(



    (item) => item.status === "unanswered"



  ).length;



  const incompleteCount = analysis.filter(



    (item) => item.status === "incomplete"



  ).length;



  const accuracy =



    questions.length > 0



      ? Math.round((correctCount / questions.length) * 100)



      : 0;



  // =====================================



  // QUIZ SETUP SCREEN



  // =====================================



  if (showQuizSetup) {



    return (



      <main className="aop-page">



<header className="aop-header">

          <button

            type="button"

            className="aop-back"

            onClick={() => setShowQuizSetup(false)}

          >

            ← BACK

          </button>

          <h1>Mixed Quiz</h1>

        </header>



        <section className="mixed-quiz-setup">



          <h2>Ready for the Mixed Quiz?</h2>



          <p>



            Answer the questions before the time runs out.



          </p>



          <div className="mixed-duration-title">



            Select Test Duration



          </div>



          <div className="mixed-duration-options">



            {[1, 2, 5, 10, 20].map((duration) => (



              <button



                type="button"



                key={duration}



                className={



                  quizDuration === duration



                    ? "mixed-duration active"



                    : "mixed-duration"



                }



                onClick={() => setQuizDuration(duration)}



              >



                {duration} {duration === 1 ? "Minute" : "Minutes"}



              </button>



            ))}



          </div>



          <div className="mixed-quiz-note">



            <p>• Questions include all four mixed activities.</p>



            <p>• No hints or answer feedback during the test.</p>



            <p>• You can skip questions and return only by moving forward.</p>



            <p>• Your analysis will appear after you end the test.</p>



          </div>



          <button



            type="button"



            className="mixed-start-quiz"



            onClick={startQuiz}



          >



            Start Quiz



          </button>



        </section>



      </main>



    );



  }



  // =====================================



  // QUIZ RESULT / ANALYSIS SCREEN



  // =====================================



  if (quizCompleted) {



    return (



      <main className="aop-page mixed-analysis-page">



        <header className="aop-header">



          <button



            type="button"



            className="aop-back"



            onClick={() => {



              setQuizCompleted(false);



              setQuizActive(false);



            }}



          >



            ← BACK



          </button>



          <h1>Quiz Analysis</h1>



        </header>



        <section className="mixed-analysis-summary">



          <h2>Test Completed!</h2>



          <div className="mixed-accuracy">



            <strong>{accuracy}%</strong>



            <span>Accuracy</span>



          </div>



          <div className="mixed-analysis-stats">



            <div className="mixed-stat correct">



              <strong>{correctCount}</strong>



              <span>Correct</span>



            </div>



            <div className="mixed-stat wrong">



              <strong>{wrongCount}</strong>



              <span>Wrong</span>



            </div>



            <div className="mixed-stat unanswered">



              <strong>{unansweredCount}</strong>



              <span>Unanswered</span>



            </div>



            <div className="mixed-stat incomplete">



              <strong>{incompleteCount}</strong>



              <span>Incomplete</span>



            </div>



          </div>



          <p className="mixed-analysis-total">



            Total Questions: {questions.length}



          </p>



        </section>



        <section className="aop-review-section mixed-review-section">

          <div className="aop-review-title">

            <h2>Question-wise Analysis</h2>

            <p>Review your answer and compare it with the correct answer.</p>

          </div>



          {attemptedAnalysis.map((item) => {

            const currentQuestion = item.question;

            const orderQuestion =

              currentQuestion.type === "ascending" ||

              currentQuestion.type === "descending";



            const correctIds = orderQuestion

              ? getCorrectOrder(currentQuestion)

              : [];

            const submittedIds = Array.isArray(item.submitted)

              ? item.submitted

              : [];



            const correctChoiceItem = orderQuestion

              ? null

              : getCorrectChoice(currentQuestion);

            const submittedChoiceItem = orderQuestion

              ? null

              : currentQuestion.originalItems.find(

                  (picture) => picture.id === item.submitted

                );



            const statusClass =

              item.status === "correct"

                ? "aop-review-correct"

                : item.status === "wrong"

                ? "aop-review-wrong"

                : "aop-review-unanswered";



            const statusLabel =

              item.status === "correct"

                ? "Correct"

                : item.status === "wrong"

                ? "Wrong"

                : item.status === "incomplete"

                ? "Incomplete"

                : "Unanswered";



            const orderCaption =

              currentQuestion.type === "ascending"

                ? "Smallest → Biggest"

                : "Biggest → Smallest";



            const renderChoiceImage = (picture, altText) => (

              picture ? (

                <div className="aop-review-picture mixed-review-single-picture">

                  <span

                    className="aop-review-photo"

                    style={{ height: `${picture.size}px` }}

                  >

                    <img src={picture.image} alt={altText} />

                  </span>

                  <small>{getItemLabel(picture)}</small>

                </div>

              ) : (

                <p className="aop-review-not-answered">No answer submitted</p>

              )

            );



            return (

              <article

                className={`aop-review-item ${statusClass}`}

                key={currentQuestion.id}

              >

                <div className="aop-review-heading">

                  <strong>Question {item.index + 1}</strong>

                  <span>{statusLabel}</span>

                </div>



                <h3 className="mixed-review-question-text">

                  {getInstruction(currentQuestion.type)}

                </h3>



                {orderQuestion ? (

                  <>

                    <p className="aop-review-caption">Your Answer</p>

                    <div className="aop-review-images">

                      {submittedIds.some(Boolean) ? (

                        submittedIds.map((id, position) => {

                          const picture = currentQuestion.originalItems.find(

                            (entry) => entry.id === id

                          );

                          return (

                            <div

                              className="aop-review-picture"

                              key={`${currentQuestion.id}_submitted_${position}`}

                            >

                              {picture ? (

                                <span

                                  className="aop-review-photo"

                                  style={{ height: `${picture.size}px` }}

                                >

                                  <img

                                    src={picture.image}

                                    alt="Your selected object"

                                  />

                                </span>

                              ) : (

                                <span className="aop-review-missing">Not placed</span>

                              )}

                              <small>{position + 1}</small>

                            </div>

                          );

                        })

                      ) : (

                        <p className="aop-review-not-answered">No answer submitted</p>

                      )}

                    </div>



                    <p className="aop-review-caption">

                      Correct Answer: {orderCaption}

                    </p>

                    <div className="aop-review-images aop-correct-order-images">

                      {correctIds.map((id, position) => {

                        const picture = currentQuestion.originalItems.find(

                          (entry) => entry.id === id

                        );

                        return (

                          <div

                            className="aop-review-picture"

                            key={`${currentQuestion.id}_correct_${position}`}

                          >

                            <span

                              className="aop-review-photo"

                              style={{ height: `${picture.size}px` }}

                            >

                              <img

                                src={picture.image}

                                alt="Correctly ordered object"

                              />

                            </span>

                            <small>{position + 1}</small>

                          </div>

                        );

                      })}

                    </div>

                  </>

                ) : (

                  <>

                    <p className="aop-review-caption">Your Answer</p>

                    <div className="aop-review-images mixed-review-single-images">

                      {renderChoiceImage(

                        submittedChoiceItem,

                        "Your selected answer"

                      )}

                    </div>



                    <p className="aop-review-caption">Correct Answer</p>

                    <div className="aop-review-images mixed-review-single-images">

                      {renderChoiceImage(

                        correctChoiceItem,

                        "Correct answer"

                      )}

                    </div>

                  </>

                )}

              </article>

            );

          })}

        </section>



        <div className="mixed-analysis-actions">



          <button



            type="button"



            className="mixed-print-button"



            onClick={() => window.print()}



          >



            Print Analysis



          </button>



          <button



            type="button"



            className="mixed-restart-button"



            onClick={startQuiz}



          >



            Play Again



          </button>



          <button



            type="button"



            className="mixed-practice-button"



            onClick={() => {



              setQuizCompleted(false);



              setQuizActive(false);



              setShowQuizSetup(false);



              setQuestions(createMixedQuestions());



              setQuestionIndex(0);



              setScore(0);



              resetCurrentAnswer();



            }}



          >



            Back to Practice



          </button>



        </div>



      </main>



    );



  }



  // =====================================



  // MAIN SCREEN



  // =====================================



  return (



    <main className="aop-page">



      <header className="aop-header">

        <button

          type="button"

          className="aop-back"

          onClick={onBack}

          disabled={quizActive}

        >

          ← BACK

        </button>



        <h1>Mixed</h1>



        {!quizActive && (

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

            <button

              type="button"

              className="aop-quiz-button"

              onClick={() => setShowWorksheet(true)}

            >

              🖨️ Worksheet

            </button>



            <button

              type="button"

              className="aop-quiz-button"

              onClick={() => setShowQuizSetup(true)}

            >

              📝 Quiz

            </button>

          </div>

        )}

      </header>



      {showWorksheet && (

        <MixedOrderPictureWorksheet

          imageCollections={IMAGE_COLLECTIONS}

          onClose={() => setShowWorksheet(false)}

        />

      )}



      {quizActive && (



        <div className="mixed-quiz-topbar">



          <div>



            Question {questionIndex + 1} of {questions.length}



          </div>



          <div className="mixed-timer">



            <span>Time Left</span>



            <strong>{formatTime(timeLeft)}</strong>



          </div>



          <button



            type="button"



            className="mixed-end-quiz"



            onClick={endQuiz}



          >



            End Test



          </button>



        </div>



      )}



      <section className="aop-question">



        <div className="mixed-instruction">



          <h2>{instruction}</h2>



        </div>



        <div className="aop-pictures">



          {isOrderQuestion



            ? available.map((item) => (



                <PictureTile



                  key={item.id}



                  item={item}



                  onClick={() => handlePictureClick(item.id)}



                  disabled={isChecking || feedback === "success"}



                />



              ))



            : question.items.map((item) => (



                <PictureTile



                  key={item.id}



                  item={item}



                  onClick={() => handleChoice(item)}



                  disabled={isChecking || feedback === "success"}



                />



              ))}



        </div>



        {isOrderQuestion && (



          <>



            <div className="aop-answer-heading">



              <span>Your answer</span>



              <span>



                {question.type === "ascending"



                  ? "Smallest → Biggest"



                  : "Biggest → Smallest"}



              </span>



            </div>



            <div className="aop-slots">



              {answer.map((id, index) => {



                const item = question.items.find(



                  (entry) => entry.id === id



                );



                return (



                  <button



                    type="button"



                    key={index}



                    className={`aop-slot ${item ? "filled" : ""}`}



                    onClick={() => {



                      if (item) {



                        removeItem(index);



                      }



                    }}



                    onDragOver={(event) => event.preventDefault()}



                    onDrop={(event) => {



                      event.preventDefault();



                      const draggedItemId =



                        event.dataTransfer.getData("text/plain");



                      placeItem(draggedItemId, index);



                    }}



                  >



                    <small>{index + 1}</small>



                    {item ? (



                      <span



                        className="aop-slot-photo"



                        style={{ height: `${item.size}px` }}



                      >



                        <img



                          src={item.image}



                          alt="Object"



                          draggable="false"



                        />



                      </span>



                    ) : (



                      <span className="aop-empty">



                        Drop here



                      </span>



                    )}



                  </button>



                );



              })}



            </div>



            <div className="aop-actions">



              <button



                type="button"



                className="aop-clear"



                onClick={resetQuestion}



              >



                Clear answer



              </button>



            </div>



          </>



        )}



        {!isOrderQuestion && !quizActive && (



          <p className="mixed-choice-hint">



            Click the correct picture.



          </p>



        )}



        {!isOrderQuestion && quizActive && (



          <p className="mixed-choice-hint">



            {selectedChoice



              ? "Your answer is selected."



              : "Select one picture."}



          </p>



        )}



        {!quizActive && feedback === "wrong" && (



          <p className="aop-retry">



            Try again! 💛 Check the sizes carefully.



          </p>



        )}



        {!quizActive && feedback === "success" && (



          <p className="aop-good">



            Excellent! 🎉 Your answer is correct!



          </p>



        )}



      </section>



      {quizActive ? (



        <div className="mixed-quiz-navigation">



          <button



            type="button"



            className="mixed-next-question"



            onClick={nextQuizQuestion}



          >



            {questionIndex === questions.length - 1



              ? "Finish Test"



              : "Next Question →"}



          </button>



        </div>



      ) : (

        <p className="aop-score">

          Correct answers: {score}

        </p>

      )}



    </main>



  );



}
