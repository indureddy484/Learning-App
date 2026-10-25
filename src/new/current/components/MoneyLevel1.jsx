import { useState, useRef, useEffect, useCallback } from "react";
import "./MoneyLevel1.css";

const NOTE_IMAGES = {
  10: "/money-notes/ten-rupee-note.png",
  20: "/money-notes/20-rupee-note.png",
  50: "/money-notes/50-rupee-note.png",
};

const COIN_IMAGES = {
  1: "/money-coins/one-rupee-coin.png",
  2: "/money-coins/two-rupee-coin.png",
  5: "/money-coins/five-rupee-coin.png",
};

const TOPIC_OPTIONS = [
  { value: "note-10", label: "₹10 Note" },
  { value: "note-20", label: "₹20 Note" },
  { value: "note-50", label: "₹50 Note" },
  { value: "notes-10-20", label: "₹10 + ₹20 Notes" },
  { value: "notes-10-50", label: "₹10 + ₹50 Notes" },
  { value: "notes-20-50", label: "₹20 + ₹50 Notes" },
  { value: "notes-10-20-50", label: "₹10 + ₹20 + ₹50 Notes" },
  { value: "coin-1", label: "₹1 Coins" },
  { value: "coin-2", label: "₹2 Coins" },
  { value: "coin-5", label: "₹5 Coins" },
  { value: "coins-1-2", label: "₹1 + ₹2 Coins" },
  { value: "coins-1-5", label: "₹1 + ₹5 Coins" },
  { value: "coins-2-5", label: "₹2 + ₹5 Coins" },
  { value: "coins-1-2-5", label: "₹1 + ₹2 + ₹5 Coins" },
];

function getTopic(topic) {
  const isCoin =
    topic.startsWith("coin-") || topic.startsWith("coins-");

  const isSingle =
    topic.startsWith("note-") || topic.startsWith("coin-");

  const values = topic
    .replace(/^(notes|coins|note|coin)-/, "")
    .split("-")
    .map(Number);

  return {
    values,
    kind: isCoin ? "coin" : "note",
    type: isSingle ? "single" : "combo",
    label:
      values.map((value) => `₹${value}`).join(" + ") +
      (isCoin ? " Coins" : " Notes"),
  };
}

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function makeQuestion(topic, maxAmount = 100) {
  const config = getTopic(topic);

  if (topic === "note-50") {
    const maxNotes = Math.max(
      1,
      Math.floor((maxAmount - 1) / 50)
    );

    const count = Math.floor(Math.random() * maxNotes) + 1;

    return {
      items: Array.from({ length: count }, () => ({
        value: 50,
        kind: "note",
      })),
      answer: count * 50,
    };
  }

  const items = [];
  let answer = 0;
  const desiredCount = Math.floor(Math.random() * 5) + 2;

  for (let i = 0; i < desiredCount; i++) {
    const available = config.values.filter(
      (value) => answer + value < maxAmount
    );

    if (!available.length) break;

    const value =
      config.type === "single"
        ? config.values[0]
        : available[Math.floor(Math.random() * available.length)];

    if (answer + value >= maxAmount) break;

    items.push({ value, kind: config.kind });
    answer += value;
  }

  if (!items.length) {
    const value = config.values[0];
    items.push({ value, kind: config.kind });
    answer = value;
  }

  return { items: shuffle(items), answer };
}

function createOptions(answer, maxAmount = 100, topic = "") {
  const choices = new Set([answer]);
  const possible = [];

  if (topic === "note-50") {
    for (let amount = 50; amount < maxAmount; amount += 50) {
      if (amount !== answer) possible.push(amount);
    }
  } else {
    for (let amount = 1; amount < maxAmount; amount++) {
      if (amount !== answer) possible.push(amount);
    }
  }

  for (const option of shuffle(possible)) {
    choices.add(option);
    if (choices.size === 4) break;
  }

  let fallback = Math.max(1, answer + 1);

  while (choices.size < 4) {
    if (!choices.has(fallback)) choices.add(fallback);
    fallback++;
  }

  return shuffle([...choices]);
}

// A question is identified by its money items, regardless of their order.
function getQuestionKey(question) {
  return question.items
    .map((item) => `${item.kind}-${item.value}`)
    .sort()
    .join("|");
}

// Try to find a question that has not appeared in this question set.
function makeUniqueQuestion(topic, maxAmount, seenQuestions) {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const question = makeQuestion(topic, maxAmount);
    const key = getQuestionKey(question);

    if (!seenQuestions.has(key)) {
      seenQuestions.add(key);
      return question;
    }
  }

  return null;
}

function createQuestions(topic, maxAmount = 100, count = 9) {
  const seenQuestions = new Set();
  const questions = [];

  for (let i = 0; i < count; i++) {
    const question = makeUniqueQuestion(topic, maxAmount, seenQuestions);
    if (!question) break; // Don't add duplicates if this topic has few combinations.

    questions.push({
      ...question,
      options: createOptions(question.answer, maxAmount, topic),
    });
  }

  return questions;
}

function imageFor(item) {
  return item.kind === "coin"
    ? COIN_IMAGES[item.value]
    : NOTE_IMAGES[item.value];
}

function createPrintQuestions(count, topic, maxAmount) {
  return Array.from({ length: count }, (_, index) => {
    const question = makeQuestion(topic, maxAmount);

    return {
      number: index + 1,
      ...question,
      options: createOptions(question.answer, maxAmount, topic),
    };
  });
}

function printQuestions(questions, topic, maxAmount) {
  const printWindow = window.open("", "_blank", "width=1000,height=800");

  if (!printWindow) {
    alert("Please allow pop-ups to print the worksheet.");
    return;
  }

  const html = questions.map((question) => {
    const images = question.items.map((item) => `
      <img
        src="${new URL(imageFor(item), window.location.origin).href}"
        alt="₹${item.value}"
      />
    `).join("");

    const options = question.options.map((option, index) => `
      <div>${String.fromCharCode(65 + index)}) ₹${option}</div>
    `).join("");

    return `
      <section class="question">
        <h3>${question.number}. Find the total value.</h3>
        <div class="notes">${images}<strong>= ?</strong></div>
        <div class="options">${options}</div>
      </section>
    `;
  }).join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Money Level 1 Worksheet</title>
        <style>
          @page { size: A4; margin: 10mm; }
          body { font-family: Arial, sans-serif; color: #222; }
          h1, h2 { text-align: center; }
          .student { display:flex; justify-content:space-between; margin:20px 0; }
          .question { padding:10px; margin-bottom:18px; border-bottom:1px dashed #aaa; break-inside:avoid; }
          .notes { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin:15px 0; }
          .notes img { width:300px; height:145px; object-fit:contain; }
          .options { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        </style>
      </head>
      <body>
        <h1>Money Learning App</h1>
        <h2>Level 1 — Practice Worksheet</h2>
        <div class="student">
          <span>Name: __________________</span>
          <span>Date: __________</span>
        </div>
        <p><strong>Topic:</strong> ${getTopic(topic).label}</p>
        <p><strong>Amount limit:</strong> Less than ₹${maxAmount}</p>
        <p>Choose the correct answer.</p>
        ${html}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

/* =====================================================
   MAIN MONEY LEVEL 1
===================================================== */

function MoneyLevel1({ onBack }) {
  const [topic, setTopic] = useState("note-10");
  const [maxAmount, setMaxAmount] = useState(100);
  const [fiftyNoteLimit, setFiftyNoteLimit] = useState(300);
  const [screenMode, setScreenMode] = useState("learn");

  const [questions, setQuestions] = useState(() =>
    createQuestions("note-10", 100)
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(false);

  const [showPrintPopup, setShowPrintPopup] = useState(false);
  const [printCount, setPrintCount] = useState("10");

  const timers = useRef([]);
  const successAudio = useRef(null);
  const failAudio = useRef(null);
  const veryGoodAudio = useRef(null);
  const tryAgainAudio = useRef(null);

  const isFiftyNoteOnly = topic === "note-50";
  const currentLimit = isFiftyNoteOnly ? fiftyNoteLimit : maxAmount;
  const question = questions[questionIndex];

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const playAudio = (audioRef) => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  const schedule = (callback, delay) => {
    timers.current.push(setTimeout(callback, delay));
  };

  const resetForTopic = (newTopic, newLimit) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setTopic(newTopic);
    setMaxAmount(newLimit);

    if (newTopic === "note-50") setFiftyNoteLimit(newLimit);

    setQuestions(createQuestions(newTopic, newLimit));
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setIsCorrect(false);
    setFinished(false);
  };

  const restartGame = () => resetForTopic(topic, currentLimit);

  const moveToNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      setSelectedAnswer(null);
      setFeedback("");
      setIsCorrect(false);
    } else {
      setFinished(true);
    }
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null || finished || !question) return;

    setSelectedAnswer(answer);

    if (answer === question.answer) {
      setIsCorrect(true);
      setFeedback("Very Good! 🎉");
      playAudio(successAudio);

      schedule(() => {
        playAudio(veryGoodAudio);
        schedule(moveToNextQuestion, 900);
      }, 700);
    } else {
      setIsCorrect(false);
      setFeedback("Try Again!");
      playAudio(failAudio);

      schedule(() => {
        playAudio(tryAgainAudio);
        schedule(() => {
          setSelectedAnswer(null);
          setFeedback("");
        }, 900);
      }, 700);
    }
  };

  const handlePrint = () => {
    const count = Number(printCount);

    if (!Number.isInteger(count) || count < 1 || count > 200) {
      alert("Enter a number between 1 and 200.");
      return;
    }

    setShowPrintPopup(false);
    printQuestions(
      createPrintQuestions(count, topic, currentLimit),
      topic,
      currentLimit
    );
  };

  if (screenMode === "test") {
    return (
      <MoneyLevel1Test
        topic={topic}
        maxAmount={currentLimit}
        onBack={() => setScreenMode("learn")}
      />
    );
  }

  if (!question && !finished) return null;

  return (
    <div className="money-level-screen">
      <audio ref={successAudio} src="/sounds/success-1-6297.mp3" preload="auto" />
      <audio ref={failAudio} src="/sounds/fail-2-2777575.mp3" preload="auto" />
      <audio ref={veryGoodAudio} src="/sounds/very-good.mp3" preload="auto" />
      <audio ref={tryAgainAudio} src="/sounds/try-again.mp3" preload="auto" />

      <button className="money-back-button" type="button" onClick={onBack}>
        ← BACK
      </button>

      <div className="money-toolbar">
        <label htmlFor="money-denomination">Select Money:</label>
        <select
          id="money-denomination"
          className="money-denomination-select"
          value={topic}
          onChange={(event) => {
            const nextTopic = event.target.value;
            const limit =
              nextTopic === "note-50" ? fiftyNoteLimit : maxAmount;
            resetForTopic(nextTopic, limit);
          }}
        >
          {TOPIC_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="money-max-amount">Maximum Amount:</label>
        <select
          id="money-max-amount"
          className="money-denomination-select"
          value={currentLimit}
          onChange={(event) => {
            const limit = Number(event.target.value);
            if (isFiftyNoteOnly) setFiftyNoteLimit(limit);
            else setMaxAmount(limit);
            resetForTopic(topic, limit);
          }}
        >
          {isFiftyNoteOnly ? (
            <>
              <option value={300}>Less than ₹300</option>
              <option value={500}>Less than ₹500</option>
              <option value={1000}>Less than ₹1000</option>
            </>
          ) : (
            <>
              <option value={100}>Less than ₹100</option>
              <option value={200}>Less than ₹200</option>
              <option value={300}>Less than ₹300</option>
            </>
          )}
        </select>
      </div>

      <div className="money-question-card">
        {finished ? (
          <div className="money-complete-card">
            <div className="money-complete-icon">🏆</div>
            <h2>Level Completed!</h2>
            <p>You completed the {getTopic(topic).label} game.</p>
            <button className="money-action-button" onClick={restartGame}>
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div className="money-addition">
              {question.items.map((item, index) => (
                <span className="money-note-item" key={`${index}-${item.value}`}>
                  <img
                    src={imageFor(item)}
                    alt={`₹${item.value} ${item.kind}`}
                    className="money-note-inline"
                  />
                  {index < question.items.length - 1 && (
                    <span className="money-plus-sign">+</span>
                  )}
                </span>
              ))}
              <span className="money-equals">= ______</span>
            </div>

            <div className="money-options">
              {question.options.map((option) => {
                let className = "money-option-button";

                if (selectedAnswer === option) {
                  className += option === question.answer
                    ? " money-correct"
                    : " money-wrong";
                }

                return (
                  <button
                    key={option}
                    type="button"
                    className={className}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    ₹{option}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div
                className={`money-feedback ${
                  isCorrect ? "money-feedback-correct" : "money-feedback-wrong"
                }`}
              >
                {feedback}
              </div>
            )}
          </>
        )}
      </div>

      <button
        className="money-print-button"
        type="button"
        onClick={() => setShowPrintPopup(true)}
      >
        🖨️ PRINT QUESTIONS
      </button>

      <button
        className="money-test-button"
        type="button"
        onClick={() => setScreenMode("test")}
      >
        📝 TAKE QUIZ / TEST
      </button>

      {showPrintPopup && (
        <div
          className="money-print-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowPrintPopup(false);
            }
          }}
        >
          <div className="money-print-box" role="dialog" aria-modal="true">
            <button
              className="money-print-close"
              type="button"
              onClick={() => setShowPrintPopup(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="money-print-icon">🖨️</div>
            <h2>Print Questions</h2>
            <p>How many questions do you want to print?</p>
            <input
              type="number"
              min="1"
              max="200"
              value={printCount}
              onChange={(event) => setPrintCount(event.target.value)}
            />
            <p className="money-print-info">A4 format · Multiple choice · No answers</p>
            <p className="money-print-info">Selected: {getTopic(topic).label}</p>
            <p className="money-print-info">Less than ₹{currentLimit}</p>
            <div className="money-print-buttons">
              <button type="button" onClick={() => setShowPrintPopup(false)}>
                CANCEL
              </button>
              <button type="button" onClick={handlePrint}>PRINT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   QUIZ COMPONENT — ONE QUESTION AT A TIME, UNLIMITED
===================================================== */

function MoneyLevel1Test({ topic, maxAmount, onBack }) {
  const [stage, setStage] = useState("setup");
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(300);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [page, setPage] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [recordingReady, setRecordingReady] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const cameraRef = useRef(null);
  const previewRef = useRef(null);
  const playbackRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const blobRef = useRef(null);
  const timerRef = useRef(null);
  const finishRef = useRef(false);
  const finishingRef = useRef(false);
  const answersRef = useRef([]);
  const seenTestQuestionsRef = useRef(new Set());
  const lastQuestionKeyRef = useRef("");
  const currentQuestionRef = useRef(null);
  const questionNumberRef = useRef(1);
  const questionStartRef = useRef(0);
  const timeLeftRef = useRef(300);
  const startedRef = useRef(0);

  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(answers.length / pageSize));
  const score = answers.filter(
    (item) => item.selectedAnswer === item.correctAnswer
  ).length;
  const elapsedSeconds = Math.max(0, duration * 60 - timeLeft);

  const formatTime = (seconds) =>
    `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, "0")}:${String(
      Math.max(0, seconds) % 60
    ).padStart(2, "0")}`;

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (cameraRef.current) {
      cameraRef.current.srcObject = null;
    }

    if (previewRef.current) {
      previewRef.current.srcObject = null;
    }
  }, []);

  const discardRecording = useCallback(() => {
    if (playbackRef.current) {
      playbackRef.current.pause();
      playbackRef.current.removeAttribute("src");
      playbackRef.current.load();
    }

    if (blobRef.current) blobRef.current = null;
    if (recordingUrl) URL.revokeObjectURL(recordingUrl);

    setRecordingUrl("");
    setRecordingReady(false);
    chunksRef.current = [];
  }, [recordingUrl]);

  const newQuestion = useCallback(() => {
    let generated = makeUniqueQuestion(
      topic,
      maxAmount,
      seenTestQuestionsRef.current
    );

    // If all combinations have been used, begin a new cycle but keep the
    // immediately previous question reserved so it cannot repeat straight away.
    if (!generated) {
      const previousKey = lastQuestionKeyRef.current;
      seenTestQuestionsRef.current = new Set(previousKey ? [previousKey] : []);
      generated = makeUniqueQuestion(
        topic,
        maxAmount,
        seenTestQuestionsRef.current
      );
    }

    // Defensive fallback for a topic with only one possible combination.
    if (!generated) generated = makeQuestion(topic, maxAmount);

    const next = {
      ...generated,
      options: createOptions(generated.answer, maxAmount, topic),
    };

    currentQuestionRef.current = next;
    lastQuestionKeyRef.current = getQuestionKey(next);
    setCurrentQuestion(next);
    questionNumberRef.current += 1;
    setQuestionNumber(questionNumberRef.current);
    questionStartRef.current = Date.now();
  }, [topic, maxAmount]);

  const finishTest = useCallback(() => {
    if (finishRef.current || finishingRef.current) return;

    finishingRef.current = true;
    finishRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const current = currentQuestionRef.current;
    const alreadyRecorded =
      current &&
      answersRef.current.some(
        (item) => item.number === questionNumberRef.current
      );

    if (current && !alreadyRecorded) {
      answersRef.current = [
        ...answersRef.current,
        {
          number: questionNumberRef.current,
          items: current.items,
          correctAnswer: current.answer,
          selectedAnswer: null,
          timeTaken: Math.max(
            0,
            Math.round((Date.now() - questionStartRef.current) / 1000)
          ),
        },
      ];
    }

    stopCamera();

    const showReport = () => {
      setAnswers([...answersRef.current]);
      setStage("analysis");
      finishingRef.current = false;
    };

    const recorder = recorderRef.current;

    if (recorder && recorder.state === "recording") {
      recorder.onstop = () => {
        if (chunksRef.current.length) {
          const blob = new Blob(chunksRef.current, {
            type: recorder.mimeType || "video/webm",
          });

          blobRef.current = blob;
          setRecordingUrl(URL.createObjectURL(blob));
          setRecordingReady(true);
        }

        showReport();
      };

      recorder.stop();
    } else {
      showReport();
    }
  }, [stopCamera]);

  const startTest = async () => {
    setCameraError("");
    finishRef.current = false;
    finishingRef.current = false;
    answersRef.current = [];
    chunksRef.current = [];
    questionNumberRef.current = 1;
    seenTestQuestionsRef.current = new Set();
    lastQuestionKeyRef.current = "";

    setAnswers([]);
    setPage(0);
    setRecordingReady(false);

    if (recordingUrl) URL.revokeObjectURL(recordingUrl);

    setRecordingUrl("");
    blobRef.current = null;

    const first = makeUniqueQuestion(
      topic,
      maxAmount,
      seenTestQuestionsRef.current
    );
    const preparedQuestion = first || makeQuestion(topic, maxAmount);
    const prepared = {
      ...preparedQuestion,
      options: createOptions(preparedQuestion.answer, maxAmount, topic),
    };

    lastQuestionKeyRef.current = getQuestionKey(prepared);
    currentQuestionRef.current = prepared;
    setCurrentQuestion(prepared);
    setQuestionNumber(1);
    setTimeLeft(duration * 60);
    timeLeftRef.current = duration * 60;
    questionStartRef.current = Date.now();
    startedRef.current = Date.now();

    try {
      if (
        !navigator.mediaDevices?.getUserMedia ||
        typeof MediaRecorder === "undefined"
      ) {
        throw new Error("Video recording is not supported by this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (finishRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
        cameraRef.current.muted = true;
        await cameraRef.current.play().catch(() => {});
      }

      const mimeType = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
      ].find((type) => MediaRecorder.isTypeSupported(type));

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data?.size > 0) chunksRef.current.push(event.data);
      };

      recorder.start(1000);
      setStage("quiz");

      timerRef.current = setInterval(() => {
        const next = Math.max(0, timeLeftRef.current - 1);
        timeLeftRef.current = next;
        setTimeLeft(next);

        if (next <= 0) finishTest();
      }, 1000);
    } catch (error) {
      stopCamera();

      setCameraError(
        `Could not start recording: ${error.message}. Allow camera and microphone access and try again.`
      );
    }
  };

  // FIX: The visible quiz video mounts after stage changes.
  // Attach the active camera stream to it after it is mounted.
  useEffect(() => {
    if (stage === "quiz" && previewRef.current && streamRef.current) {
      previewRef.current.srcObject = streamRef.current;
      previewRef.current.muted = true;

      previewRef.current.play().catch((error) => {
        console.error("Unable to play camera preview:", error);
      });
    }
  }, [stage]);

  const chooseAnswer = (selectedAnswer) => {
    if (
      stage !== "quiz" ||
      finishRef.current ||
      !currentQuestionRef.current
    ) {
      return;
    }

    const current = currentQuestionRef.current;

    const entry = {
      number: questionNumberRef.current,
      items: current.items,
      correctAnswer: current.answer,
      selectedAnswer,
      timeTaken: Math.max(
        0,
        Math.round((Date.now() - questionStartRef.current) / 1000)
      ),
    };

    answersRef.current = [...answersRef.current, entry];
    setAnswers([...answersRef.current]);
    newQuestion();
  };

  const playRecording = () => {
    if (!recordingUrl || !playbackRef.current) return;

    playbackRef.current.src = recordingUrl;

    playbackRef.current.play().catch(() => {
      alert("Unable to play the recording.");
    });
  };

  const leaveAnalysis = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;

    stopCamera();
    discardRecording();

    answersRef.current = [];
    setAnswers([]);
    setCurrentQuestion(null);

    onBack();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (blobRef.current) blobRef.current = null;
    };
  }, []);

  const config = getTopic(topic);

  return (
    <div className="money-test-screen">
      <div className="money-test-header">
        <strong>🧠 Money Level 1 — Test</strong>
        <button type="button" onClick={onBack}>Home</button>
      </div>

      {stage === "setup" && (
        <div className="money-test-setup">
          <h1>🧠 Select Test Duration</h1>
          <p>Topic: <strong>{config.label}</strong></p>
          <p>Amount limit: <strong>Less than ₹{maxAmount}</strong></p>

          <label htmlFor="money-test-duration">Test Duration</label>
          <select
            id="money-test-duration"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
          >
            <option value={1}>1 minute</option>
            <option value={2}>2 minutes</option>
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
          </select>

         
          {cameraError && (
            <p className="money-test-error">{cameraError}</p>
          )}

          <button
            className="money-test-primary"
            type="button"
            onClick={startTest}
          >
            ✅ Start Test
          </button>

          <button type="button" onClick={onBack}>
            ← Back to Learning
          </button>

          <video
            ref={cameraRef}
            className="money-test-hidden-video"
            muted
            autoPlay
            playsInline
          />
        </div>
      )}

      {stage === "quiz" && currentQuestion && (
        <>
          <h1 className="money-test-title">📝 Money Level 1 Test</h1>

          <div className="money-test-status">
            <span>⏰ Time Left: <strong>{formatTime(timeLeft)}</strong></span>
            <span>Question: {questionNumber}</span>
            <span>Answered: {answers.length}</span>
          </div>

          <div className="money-test-single-question">
            <h2>Q{questionNumber}. Find the total value.</h2>

            <div className="money-test-items">
              {currentQuestion.items.map((item, index) => (
                <span
                  className="money-test-item"
                  key={`${questionNumber}-${index}`}
                >
                  <img src={imageFor(item)} alt={`₹${item.value}`} />
                  {index < currentQuestion.items.length - 1 && (
                    <span>+</span>
                  )}
                </span>
              ))}

              <strong className="money-test-equals">= ?</strong>
            </div>

            <div className="money-test-options">
              {currentQuestion.options.map((option) => (
                <button
                  type="button"
                  className="money-test-option"
                  key={option}
                  onClick={() => chooseAnswer(option)}
                >
                  ₹{option}
                </button>
              ))}
            </div>

            <p className="money-test-question-hint">
              Select an answer to move to the next question.
            </p>
          </div>

          <button
            className="money-test-end"
            type="button"
            onClick={finishTest}
          >
            ⛔ End Test
          </button>

          <div className="money-test-camera">
            <span>🔴 Recording</span>
            <video ref={previewRef} muted autoPlay playsInline />
          </div>
        </>
      )}

      {stage === "analysis" && (
        <div className="money-test-analysis">
          <h1>📊 Test Analysis Report</h1>

          <div className="money-test-score">
            <h2>Score: {score} / {answers.length}</h2>
            <p>Total Time Taken: {formatTime(elapsedSeconds)}</p>
            <p>
              Correct: {score} · Incorrect:{" "}
              {answers.filter(
                (item) =>
                  item.selectedAnswer !== null &&
                  item.selectedAnswer !== item.correctAnswer
              ).length}
              {" "}· Unanswered:{" "}
              {answers.filter(
                (item) => item.selectedAnswer === null
              ).length}
            </p>
          </div>

          <div className="money-test-report-list">
            {answers
              .slice(page * pageSize, (page + 1) * pageSize)
              .map((item) => {
                const correct =
                  item.selectedAnswer === item.correctAnswer;

                return (
                  <div
                    key={item.number}
                    className={`money-report-question ${
                      correct ? "correct" : "incorrect"
                    }`}
                  >
                    <h3>
                      Q{item.number}:{" "}
                      {item.items.map((money, index) => (
                        <span key={index}>
                          ₹{money.value}
                          {index < item.items.length - 1 ? " + " : ""}
                        </span>
                      ))} = ₹{item.correctAnswer}
                    </h3>

                    <p>
                      Your Answer:{" "}
                      {item.selectedAnswer === null
                        ? "Not answered"
                        : `₹${item.selectedAnswer}`}
                    </p>

                    <p>Correct Answer: ₹{item.correctAnswer}</p>
                    <p>⏱ Time Taken: {item.timeTaken}s</p>
                  </div>
                );
              })}
          </div>

          <div className="money-test-pagination">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ◀ Prev
            </button>

            <span>{page + 1} / {pageCount}</span>

            <button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next ▶
            </button>
          </div>

          <div className="money-test-report-actions">
            <button
              type="button"
              disabled={!recordingReady}
              onClick={playRecording}
            >
              ▶ Play Test Video
            </button>

            <button type="button" onClick={leaveAnalysis}>
              ← Back to Learning
            </button>
          </div>

          {!recordingReady && (
            <p className="money-test-note">
              Video recording was unavailable or could not be finalized.
              Your report is still available.
            </p>
          )}

          <video
            ref={playbackRef}
            className="money-test-playback"
            controls
            playsInline
            hidden={!recordingReady}
          />
        </div>
      )}
    </div>
  );
}

export default MoneyLevel1;