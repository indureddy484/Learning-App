
import { useState, useRef, useEffect, useCallback } from "react";
import "./MoneyLevel2.css";

const MONEY = [
  { value: 10, kind: "note", image: "/money-notes/ten-rupee-note.png" },
  { value: 20, kind: "note", image: "/money-notes/20-rupee-note.png" },
  { value: 50, kind: "note", image: "/money-notes/50-rupee-note.png" },
  { value: 100, kind: "note", image: "/money-notes/100-rupee-note.png" },
  { value: 1, kind: "coin", image: "/money-coins/one-rupee-coin.png" },
  { value: 2, kind: "coin", image: "/money-coins/two-rupee-coin.png" },
];

const TOPICS = [
  { value: "10", label: "Rs. 10 Notes" },
  { value: "20", label: "Rs. 20 Notes" },
  { value: "50", label: "Rs. 50 Notes" },
  { value: "100", label: "Rs. 100 Notes" },
  { value: "1", label: "Rs. 1 Coins" },
  { value: "2", label: "Rs. 2 Coins" },
];

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getMoney(value) {
  return MONEY.find((item) => item.value === value);
}

function createOptions(answer) {
  const choices = new Set([answer]);
  let offset = 1;

  while (choices.size < 4 && offset <= 100) {
    const candidate =
      answer + (offset % 2 === 1 ? offset : -offset);

    if (candidate > 0) choices.add(candidate);
    offset++;
  }

  while (choices.size < 4) {
    choices.add(answer + choices.size + 10);
  }

  return shuffle([...choices]);
}

function makeSingleQuestion(denomination, total) {
  const money = getMoney(denomination);

  return {
    denomination,
    total,
    answer: total / denomination,
    kind: money.kind,
    options: createOptions(total / denomination),
  };
}

function createQuestions(topic) {
  const denomination = Number(topic);
  const totals = [];

  for (
    let total = denomination;
    total <= 100;
    total += denomination
  ) {
    totals.push(total);
  }

  return shuffle(totals).map((total) =>
    makeSingleQuestion(denomination, total)
  );
}

function createPrintQuestions(count, topic) {
  const denomination = Number(topic);
  const totals = [];

  for (
    let total = denomination;
    total <= 100;
    total += denomination
  ) {
    totals.push(total);
  }

  const questions = [];

  while (questions.length < count) {
    for (const total of shuffle(totals)) {
      if (questions.length >= count) break;

      questions.push({
        ...makeSingleQuestion(denomination, total),
        number: questions.length + 1,
      });
    }
  }

  return questions;
}

function printQuestions(questions, topic) {
  const topicLabel =
    TOPICS.find((item) => item.value === topic)?.label || topic;

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=700"
  );

  if (!printWindow) {
    alert("Please allow pop-ups to print the question paper.");
    return;
  }

  const questionsHTML = questions
    .map((question) => {
      const money = getMoney(question.denomination);
      const imageUrl = new URL(
        money.image,
        window.location.origin
      ).href;

      const optionsHTML = question.options
        .map(
          (option, index) => `
            <div class="option">
              ${String.fromCharCode(65 + index)}) ${option}
            </div>
          `
        )
        .join("");

      return `
        <div class="question">
          <div class="question-text">
            <span>${question.number}. Rs. ${question.total} lo enni Rs. ${question.denomination} untayi?</span>
            <img
              class="question-money-image"
              src="${imageUrl}"
              alt="Rs. ${question.denomination} ${money.kind}"
            />
          </div>
          <div class="options">${optionsHTML}</div>
        </div>
      `;
    })
    .join("");

  printWindow.document.open();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Money Level 2 - Question Paper</title>
        <style>
          @page { size: A4; margin: 12mm; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #111;
            font-size: 14px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #222;
            padding-bottom: 12px;
            margin-bottom: 22px;
          }
          .header h1 { margin: 0 0 8px; font-size: 25px; }
          .header h2 { margin: 0; font-size: 18px; font-weight: normal; }
          .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 24px;
          }
          .line { min-height: 30px; border-bottom: 1px solid #222; }
          .instructions { font-weight: bold; margin-bottom: 22px; }
          .question {
            margin-bottom: 24px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .question-text {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            font-size: 18px;
            line-height: 1.5;
            font-weight: bold;
            margin-bottom: 12px;
          }
          .question-money-image {
            width: 180px;
            height: 90px;
            object-fit: contain;
            object-position: center;
            display: block;
            flex-shrink: 0;
            margin: 8px 0;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 18px;
            margin-left: 20px;
            font-size: 16px;
          }
          .option { line-height: 1.5; }
          .footer {
            margin-top: 25px;
            padding-top: 10px;
            border-top: 1px solid #999;
            text-align: center;
            font-size: 11px;
            color: #666;
          }
          img {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Money Learning App</h1>
          <h2>Level 2 - Money Practice</h2>
        </div>
        <div class="student-info">
          <div class="line">Name:</div>
          <div class="line">Date:</div>
        </div>
        <div class="instructions">
          Instructions: Choose the correct answer.<br />
          Topic: ${topicLabel}
        </div>
        ${questionsHTML}
        <div class="footer">Money Level 2 - Practice Question Paper</div>
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = async () => {
    await Promise.all(
      Array.from(printWindow.document.images).map((img) => {
        if (img.complete) return Promise.resolve();

        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    printWindow.focus();
    printWindow.print();
  };
}

/* =====================================================
   MONEY LEVEL 2 LEARNING GAME
===================================================== */

export default function MoneyLevel2({ onBack }) {
  const [topic, setTopic] = useState("10");
  const [questions, setQuestions] = useState(() =>
    createQuestions("10")
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showPrintPopup, setShowPrintPopup] = useState(false);
  const [printCount, setPrintCount] = useState("10");
  const [screenMode, setScreenMode] = useState("learn");

  const successAudio = useRef(null);
  const failAudio = useRef(null);
  const veryGoodAudio = useRef(null);
  const tryAgainAudio = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const question = questions[questionIndex];
  const money = question ? getMoney(question.denomination) : null;

  function playAudio(audioRef) {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  function schedule(callback, delay) {
    const timer = setTimeout(callback, delay);
    timers.current.push(timer);
  }

  function resetForTopic(newTopic) {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setTopic(newTopic);
    setQuestions(createQuestions(newTopic));
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setIsCorrect(false);
    setFinished(false);
  }

  function moveToNextQuestion() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      setSelectedAnswer(null);
      setFeedback("");
      setIsCorrect(false);
    } else {
      setFinished(true);
    }
  }

  function handleAnswer(answer) {
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
  }

  function handlePrint() {
    const count = Number(printCount);

    if (!Number.isInteger(count) || count < 1 || count > 200) {
      alert("Please enter a number between 1 and 200.");
      return;
    }

    setShowPrintPopup(false);
    printQuestions(createPrintQuestions(count, topic), topic);
  }

  if (screenMode === "test") {
    return (
      <MoneyLevel2Test
        topic={topic}
        onBack={() => setScreenMode("learn")}
      />
    );
  }

  return (
    <div className="money-level-screen">
      <audio
        ref={successAudio}
        src="/sounds/success-1-6297.mp3"
        preload="auto"
      />
      <audio
        ref={failAudio}
        src="/sounds/fail-2-2777575.mp3"
        preload="auto"
      />
      <audio
        ref={veryGoodAudio}
        src="/sounds/very-good.mp3"
        preload="auto"
      />
      <audio
        ref={tryAgainAudio}
        src="/sounds/try-again.mp3"
        preload="auto"
      />

      <button
        className="money-back-button"
        onClick={onBack}
        type="button"
      >
        ← BACK
      </button>

      <div className="money-toolbar">
        <label htmlFor="money-level2-topic">Select Money:</label>

        <select
          id="money-level2-topic"
          className="money-denomination-select"
          value={topic}
          onChange={(event) => resetForTopic(event.target.value)}
        >
          {TOPICS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="money-question-card">
        {finished ? (
          <div className="money-complete-card">
            <div className="money-complete-icon">🏆</div>
            <h2>Level Completed!</h2>
            <p>
              Excellent work! You completed this Money Level 2 practice.
            </p>
            <button
              className="money-action-button"
              onClick={() => resetForTopic(topic)}
              type="button"
            >
              Play Again
            </button>
          </div>
        ) : question ? (
          <>
            <div className="money-progress">
              Question {questionIndex + 1} of {questions.length}
            </div>

            <h2 className="money-question-heading">
              <span>
                Rs. {question.total} lo enni Rs. {question.denomination}
              </span>
              <img
                src={money.image}
                alt={`Rs. ${question.denomination} ${money.kind}`}
                className="money-question-note-image"
              />
              <span>untayi?</span>
            </h2>

            <div className="money-options">
              {question.options.map((option) => {
                const buttonClass =
                  "money-option-button" +
                  (selectedAnswer === option
                    ? option === question.answer
                      ? " money-correct"
                      : " money-wrong"
                    : "");

                return (
                  <button
                    key={option}
                    type="button"
                    className={buttonClass}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div
                className={`money-feedback ${
                  isCorrect
                    ? "money-feedback-correct"
                    : "money-feedback-wrong"
                }`}
              >
                {feedback}
              </div>
            )}
          </>
        ) : null}
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
          <div
            className="money-print-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="money-level2-print-title"
          >
            <button
              className="money-print-close"
              type="button"
              onClick={() => setShowPrintPopup(false)}
              aria-label="Close print dialog"
            >
              ×
            </button>

            <div className="money-print-icon">🖨️</div>
            <h2 id="money-level2-print-title">Print Questions</h2>
            <p>How many questions do you want to print?</p>

            <input
              type="number"
              min="1"
              max="200"
              value={printCount}
              onChange={(event) => setPrintCount(event.target.value)}
            />

            <p className="money-print-info">
              A4 format · Multiple choice · No answers
            </p>

            <p className="money-print-info">
              Selected: {TOPICS.find((item) => item.value === topic)?.label}
            </p>

            <div className="money-print-buttons">
              <button
                type="button"
                onClick={() => setShowPrintPopup(false)}
              >
                CANCEL
              </button>
              <button type="button" onClick={handlePrint}>
                PRINT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   MONEY LEVEL 2 TEST — TIMER, CAMERA, REPORT
===================================================== */

function MoneyLevel2Test({ topic, onBack }) {
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
  const answersRef = useRef([]);
  const currentQuestionRef = useRef(null);
  const questionNumberRef = useRef(1);
  const questionStartRef = useRef(0);
  const timeLeftRef = useRef(300);
  const finishingRef = useRef(false);

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

    if (cameraRef.current) cameraRef.current.srcObject = null;
    if (previewRef.current) previewRef.current.srcObject = null;
  }, []);

  const discardRecording = useCallback(() => {
    if (playbackRef.current) {
      playbackRef.current.pause();
      playbackRef.current.removeAttribute("src");
      playbackRef.current.load();
    }

    if (recordingUrl) URL.revokeObjectURL(recordingUrl);

    blobRef.current = null;
    chunksRef.current = [];
    setRecordingUrl("");
    setRecordingReady(false);
  }, [recordingUrl]);

  const makeTestQuestion = useCallback(() => {
    const denomination = Number(topic);

    // Level 2 asks how many selected notes/coins make a total.
    // Repeating totals allows unlimited test questions.
    const possibleCounts = Array.from(
      { length: Math.floor(100 / denomination) },
      (_, index) => index + 1
    );

    const count =
      possibleCounts[Math.floor(Math.random() * possibleCounts.length)];

    const total = denomination * count;

    return {
      denomination,
      total,
      answer: count,
      kind: getMoney(denomination).kind,
      options: createOptions(count),
    };
  }, [topic]);

  const newQuestion = useCallback(() => {
    const next = makeTestQuestion();

    currentQuestionRef.current = next;
    setCurrentQuestion(next);
    questionNumberRef.current += 1;
    setQuestionNumber(questionNumberRef.current);
    questionStartRef.current = Date.now();
  }, [makeTestQuestion]);

  const finishTest = useCallback(() => {
    if (finishRef.current) return;
    finishRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const current = currentQuestionRef.current;
    const currentAlreadyRecorded =
      current &&
      answersRef.current.some(
        (item) => item.number === questionNumberRef.current
      );

    if (current && !currentAlreadyRecorded) {
      answersRef.current = [
        ...answersRef.current,
        {
          number: questionNumberRef.current,
          denomination: current.denomination,
          total: current.total,
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

    setAnswers([]);
    setPage(0);
    setRecordingReady(false);

    if (recordingUrl) URL.revokeObjectURL(recordingUrl);

    setRecordingUrl("");
    blobRef.current = null;

    const first = makeTestQuestion();

    currentQuestionRef.current = first;
    setCurrentQuestion(first);
    setQuestionNumber(1);
    setTimeLeft(duration * 60);
    timeLeftRef.current = duration * 60;
    questionStartRef.current = Date.now();

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

  // Attach the stream after the visible preview has mounted.
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

    answersRef.current = [
      ...answersRef.current,
      {
        number: questionNumberRef.current,
        denomination: current.denomination,
        total: current.total,
        correctAnswer: current.answer,
        selectedAnswer,
        timeTaken: Math.max(
          0,
          Math.round((Date.now() - questionStartRef.current) / 1000)
        ),
      },
    ];

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

      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }

      if (blobRef.current) blobRef.current = null;
    };
  }, []);

  const money = getMoney(Number(topic));

  return (
    <div className="money-test-screen">
      <div className="money-test-header">
        <strong>🧠 Money Level 2 — Test</strong>
        <button
          type="button"
          onClick={() => {
            if (stage === "quiz") finishTest();
            else if (stage === "analysis") leaveAnalysis();
            else onBack();
          }}
        >
          Home
        </button>
      </div>

      {stage === "setup" && (
        <div className="money-test-setup">
          <h1>🧠 Select Test Duration</h1>

          <p>
            Topic:{" "}
            <strong>
              {TOPICS.find((item) => item.value === topic)?.label}
            </strong>
          </p>

          <p>Maximum total: <strong>₹100</strong></p>

          <label htmlFor="money-level2-test-duration">
            Test Duration
          </label>

          <select
            id="money-level2-test-duration"
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
          <h1 className="money-test-title">📝 Money Level 2 Test</h1>

          <div className="money-test-status">
            <span>
              ⏰ Time Left: <strong>{formatTime(timeLeft)}</strong>
            </span>
            <span>Question: {questionNumber}</span>
            <span>Answered: {answers.length}</span>
          </div>

          <div className="money-test-single-question">
            <h2>
              Q{questionNumber}. Rs. {currentQuestion.total} lo enni Rs.{" "}
              {currentQuestion.denomination} untayi?
            </h2>

            <div className="money-test-items">
              <span className="money-test-item">
                <img
                  src={money.image}
                  alt={`Rs. ${currentQuestion.denomination} ${money.kind}`}
                />
              </span>
            </div>

            <div className="money-test-options">
              {currentQuestion.options.map((option) => (
                <button
                  type="button"
                  className="money-test-option"
                  key={option}
                  onClick={() => chooseAnswer(option)}
                >
                  {option}
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
                      Q{item.number}. Rs. {item.total} lo enni Rs.{" "}
                      {item.denomination} untayi?
                    </h3>

                    <p>
                      Your Answer:{" "}
                      {item.selectedAnswer === null
                        ? "Not answered"
                        : item.selectedAnswer}
                    </p>

                    <p>Correct Answer: {item.correctAnswer}</p>
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
