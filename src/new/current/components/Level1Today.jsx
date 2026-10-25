
import { useState, useRef, useEffect, useCallback } from "react";
import "./Level1Today.css";

const days = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

function getDay(day, offset) {
  return days[(days.indexOf(day) + offset + 7) % 7];
}

function shuffleArray(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function createQuestion() {
  const today = days[Math.floor(Math.random() * days.length)];
  const askTomorrow = Math.random() < 0.5;
  const answer = getDay(today, askTomorrow ? 1 : -1);

  return {
    question: {
      telugu: askTomorrow
        ? `Okavela ivvala ${today} aithe, repu em day avtadi?`
        : `Okavela ivvala ${today} aithe, ninna emi day padindi?`,
      english: askTomorrow
        ? `If today is ${today}, what day is tomorrow?`
        : `If today is ${today}, what day was yesterday?`,
    },
    options: shuffleArray([
      answer,
      ...shuffleArray(days.filter((day) => day !== answer)).slice(0, 3),
    ]),
    answer,
  };
}

function createPrintQuestions(count, language) {
  return Array.from({ length: count }, (_, index) => {
    const question = createQuestion();

    return {
      ...question,
      number: index + 1,
      text: question.question[language],
    };
  });
}

function printQuestions(questions) {
  const printWindow = window.open("", "_blank", "width=900,height=700");

  if (!printWindow) {
    alert("Please allow pop-ups to print the question paper.");
    return;
  }

  const questionsHTML = questions.map((question) => `
    <div class="question">
      <div class="question-text">
        ${question.number}. ${question.text}
      </div>
      <div class="options">
        ${question.options.map((option, index) => `
          <div class="option">
            ${String.fromCharCode(65 + index)}) ${option}
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Level 1 - Today</title>
      <style>
        @page { size: A4; margin: 12mm; }
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 18px; color: #111; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 14px; margin-bottom: 24px; }
        .header h1 { font-size: 26px; margin: 0 0 8px; }
        .header h2 { font-size: 21px; margin: 0; font-weight: normal; }
        .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 28px; }
        .line { border-bottom: 1px solid #222; padding-bottom: 8px; min-height: 32px; }
        .instructions { font-weight: bold; margin-bottom: 24px; }
        .question { margin-bottom: 30px; break-inside: avoid; }
        .question-text { font-size: 21px; font-weight: 600; line-height: 1.6; margin-bottom: 14px; }
        .options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-left: 22px; }
        .option { line-height: 1.6; }
        .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #999; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Day &amp; Date Quiz</h1>
        <h2>Level 1 - Today</h2>
      </div>
      <div class="student-info">
        <div class="line">Name:</div>
        <div class="line">Date:</div>
      </div>
      <div class="instructions">Choose the correct answer.</div>
      ${questionsHTML}
      <div class="footer">Level 1 - Today</div>
      <script>
        window.onload = function () {
          setTimeout(function () { window.print(); }, 300);
        };
      </script>
    </body>
    </html>
  `);

  printWindow.document.close();
}

/* =========================================================
   TIMED TEST - SAME JSX FILE
========================================================= */

function Level1TodayTest({ onBack }) {
  const [duration, setDuration] = useState(5);
  const [language, setLanguage] = useState("english");
  const [stage, setStage] = useState("setup");
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [question, setQuestion] = useState(createQuestion);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [results, setResults] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [reportPage, setReportPage] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showRecording, setShowRecording] = useState(false);
  const [recordingReady, setRecordingReady] = useState(false);

  const previewRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const resultsRef = useRef([]);
  const questionRef = useRef(question);
  const questionNumberRef = useRef(1);
  const questionStartRef = useRef(0);
  const startedAtRef = useRef(0);
  const finishedRef = useRef(false);
  const videoUrlRef = useRef("");
  const durationRef = useRef(5);
  const languageRef = useRef("english");

  useEffect(() => {
    questionRef.current = question;
  }, [question]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const finishTest = useCallback(() => {
    if (finishedRef.current) return;

    finishedRef.current = true;

    const elapsed = Math.max(
      0,
      Math.floor((Date.now() - startedAtRef.current) / 1000)
    );

    // Include the last displayed question if it was not answered.
    const answeredNumbers = new Set(
      resultsRef.current.map((item) => item.number)
    );

    if (!answeredNumbers.has(questionNumberRef.current)) {
      const current = questionRef.current;

      resultsRef.current = [
        ...resultsRef.current,
        {
          number: questionNumberRef.current,
          text: current.question[languageRef.current],
          options: current.options,
          selected: null,
          answer: current.answer,
          correct: false,
          unanswered: true,
          timeTaken: Math.max(
            0,
            Math.round((Date.now() - questionStartRef.current) / 1000)
          ),
        },
      ];
    }

    setResults([...resultsRef.current]);
    setElapsedSeconds(elapsed);
    setSecondsLeft(Math.max(0, durationRef.current * 60 - elapsed));
    setShowRecording(false);
    setStage("report");

    const recorder = recorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      stopTracks();
      setRecordingReady(true);
    }
  }, [stopTracks]);

  useEffect(() => {
    if (stage !== "quiz") return undefined;

    const timer = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - startedAtRef.current) / 1000
      );

      const remaining = Math.max(0, duration * 60 - elapsed);
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        finishTest();
      }
    }, 250);

    return () => clearInterval(timer);
  }, [stage, duration, finishTest]);

  useEffect(() => {
    if (stage === "quiz" && previewRef.current && streamRef.current) {
      previewRef.current.srcObject = streamRef.current;
      previewRef.current.play().catch(() => {});
    }
  }, [stage]);

  useEffect(() => {
    return () => {
      if (recorderRef.current?.state === "recording") {
        try {
          recorderRef.current.stop();
        } catch {}
      }

      stopTracks();

      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
      }
    };
  }, [stopTracks]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remaining
    ).padStart(2, "0")}`;
  };

  const startTest = async () => {
    setError("");
    setRecordingReady(false);
    setShowRecording(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access requires localhost or HTTPS and a supported browser.");
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setError("Your browser does not support video recording.");
      return;
    }

    let stream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];
      resultsRef.current = [];
      finishedRef.current = false;

      setResults([]);
      setReportPage(0);
      setElapsedSeconds(0);
      setSecondsLeft(duration * 60);

      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
        videoUrlRef.current = "";
      }

      setVideoUrl("");

      const recorderOptions = {};

      if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
        recorderOptions.mimeType = "video/webm;codecs=vp8,opus";
      }

      const recorder = new MediaRecorder(stream, recorderOptions);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data?.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, {
            type: recorder.mimeType || "video/webm",
          });

          const url = URL.createObjectURL(blob);
          videoUrlRef.current = url;
          setVideoUrl(url);
        }

        stopTracks();
        setRecordingReady(true);
      };

      recorder.onerror = () => {
        setError("There was a problem recording the test.");
      };

      const firstQuestion = createQuestion();

      questionRef.current = firstQuestion;
      questionNumberRef.current = 1;
      questionStartRef.current = Date.now();
      startedAtRef.current = Date.now();

      setQuestion(firstQuestion);
      setQuestionNumber(1);

      recorder.start(1000);
      setStage("quiz");
    } catch (err) {
      stream?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      setError(
        err.name === "NotAllowedError"
          ? "Please allow camera and microphone access in your browser."
          : "Unable to start camera or microphone. Check your device permissions."
      );
    }
  };

  const answerQuestion = (option) => {
    if (stage !== "quiz" || finishedRef.current) return;

    const current = questionRef.current;
    const number = questionNumberRef.current;
    const now = Date.now();

    const entry = {
      number,
      text: current.question[languageRef.current],
      options: current.options,
      selected: option,
      answer: current.answer,
      correct: option === current.answer,
      unanswered: false,
      timeTaken: Math.max(
        0,
        Math.round((now - questionStartRef.current) / 1000)
      ),
    };

    resultsRef.current = [...resultsRef.current, entry];
    setResults([...resultsRef.current]);

    const nextQuestion = createQuestion();

    questionRef.current = nextQuestion;
    questionNumberRef.current = number + 1;
    questionStartRef.current = now;

    setQuestion(nextQuestion);
    setQuestionNumber(number + 1);
  };

  const restartSetup = () => {
    setStage("setup");
    setError("");
    setQuestion(createQuestion());
    setQuestionNumber(1);
    questionNumberRef.current = 1;
    setResults([]);
    resultsRef.current = [];
    setSecondsLeft(duration * 60);
    setElapsedSeconds(0);
    setShowRecording(false);
    setRecordingReady(false);
  };

  const answeredResults = results.filter((item) => !item.unanswered);
  const correctCount = answeredResults.filter((item) => item.correct).length;
  const incorrectCount = answeredResults.filter(
    (item) => !item.correct
  ).length;
  const unansweredCount = results.filter((item) => item.unanswered).length;

  const score = answeredResults.length
    ? Math.round((correctCount / answeredResults.length) * 100)
    : 0;

  const totalPages = Math.max(1, Math.ceil(results.length / 5));
  const reportItems = results.slice(reportPage * 5, reportPage * 5 + 5);

  if (stage === "setup") {
    return (
      <div className="l1-test">
        <header className="l1-test-header">
          <div className="l1-header-title">🧠 Level 1 — Today Test</div>
          <button className="l1-home-button" onClick={onBack}>Home</button>
        </header>

        <main className="l1-test-setup">
          <h1>🧠 Select Test Duration</h1>
          <p className="l1-topic">
            Topic: <strong>Today / Days of the Week</strong>
          </p>

          <label className="l1-field-label" htmlFor="l1-duration">
            Test Duration
          </label>

          <select
            id="l1-duration"
            className="l1-duration-select"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
          >
            {[1, 2, 5, 10, 15].map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} {minutes === 1 ? "minute" : "minutes"}
              </option>
            ))}
          </select>

          <label className="l1-field-label" htmlFor="l1-language">
            Question Language
          </label>

          <select
            id="l1-language"
            className="l1-duration-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="english">English</option>
            <option value="telugu">తెలుగు</option>
          </select>

          <p className="l1-setup-note">
            Answer as many questions as possible before the timer ends.
            Your camera and microphone will record the test.
          </p>

          {error && <p className="l1-test-error">{error}</p>}

          <button className="l1-start-button" onClick={startTest}>
            ✅ Start Test
          </button>

          <button className="l1-back-learning" onClick={onBack}>
            ← Back to Learning
          </button>
        </main>
      </div>
    );
  }

  if (stage === "quiz") {
    return (
      <div className="l1-test l1-test-running">
        <header className="l1-test-header">
          <div className="l1-header-title">🧠 Level 1 — Today Test</div>
          <button className="l1-home-button" onClick={finishTest}>Home</button>
        </header>

        <main className="l1-question-screen">
          <h1>📝 Level 1 Today Test</h1>

          <div className="l1-test-status">
            <span>⏰ Time Left: <strong>{formatTime(secondsLeft)}</strong></span>
            <span>Question: <strong>{questionNumber}</strong></span>
            <span>Answered: <strong>{results.length}</strong></span>
          </div>

          <div className="l1-test-card">
            <h2>Q{questionNumber}. {question.question[language]}</h2>

            <div className="l1-test-options">
              {question.options.map((option) => (
                <button key={option} onClick={() => answerQuestion(option)}>
                  {option}
                </button>
              ))}
            </div>

            <p className="l1-question-hint">
              Select an answer to move to the next question.
            </p>
          </div>

          <button className="l1-end-test" onClick={finishTest}>
            ⛔ End Test
          </button>
        </main>

        <div className="l1-camera-preview">
          <div className="l1-camera-label"><span /> Recording</div>
          <video
            ref={previewRef}
            autoPlay
            muted
            playsInline
          />
        </div>
      </div>
    );
  }

  return (
    <div className="l1-test l1-test-report-screen">
      <header className="l1-test-header">
        <div className="l1-header-title">🧠 Level 1 — Today Test</div>
        <button className="l1-home-button" onClick={onBack}>Home</button>
      </header>

      <main className="l1-report-container">
        <h1>📊 Test Analysis Report</h1>

        <section className="l1-score-panel">
          <h2>Score: {correctCount} / {answeredResults.length}</h2>
          <p>Total Time Taken: {formatTime(elapsedSeconds)}</p>
          <p>
            Correct: {correctCount} · Incorrect: {incorrectCount} ·
            Unanswered: {unansweredCount}
          </p>
          <p>Accuracy: {score}%</p>
        </section>

        <section className="l1-report-questions">
          {reportItems.length === 0 ? (
            <p>No questions were recorded in this test.</p>
          ) : (
            reportItems.map((item) => (
              <article
                key={item.number}
                className={`l1-report-item ${
                  item.unanswered
                    ? "is-unanswered"
                    : item.correct
                      ? "is-correct"
                      : "is-wrong"
                }`}
              >
                <strong>Q{item.number}: {item.text}</strong>
                <p>
                  Your Answer: {item.unanswered ? "Not answered" : item.selected}
                </p>
                <p>Correct Answer: {item.answer}</p>
                <p>⏱ Time Taken: {item.timeTaken}s</p>
                <strong>
                  {item.unanswered
                    ? "Unanswered"
                    : item.correct
                      ? "✓ Correct"
                      : "✗ Incorrect"}
                </strong>
              </article>
            ))
          )}
        </section>

        {results.length > 0 && (
          <div className="l1-report-pagination">
            <button
              disabled={reportPage === 0}
              onClick={() => setReportPage((page) => page - 1)}
            >
              ◀ Prev
            </button>

            <span>{reportPage + 1} / {totalPages}</span>

            <button
              disabled={reportPage >= totalPages - 1}
              onClick={() => setReportPage((page) => page + 1)}
            >
              Next ▶
            </button>
          </div>
        )}

        <div className="l1-report-actions">
          <button
            className="l1-play-video-button"
            onClick={() => setShowRecording((previous) => !previous)}
            disabled={!videoUrl}
          >
            {showRecording ? "✖ Hide Test Video" : "▶ Play Test Video"}
          </button>

          <button className="l1-back-learning" onClick={onBack}>
            ← Back to Learning
          </button>

          <button className="l1-start-button" onClick={restartSetup}>
            Take Another Test
          </button>
        </div>

        {showRecording && (
          <section className="l1-playback">
            <h3>Test Recording</h3>
            {videoUrl ? (
              <video src={videoUrl} controls playsInline autoPlay />
            ) : (
              <p>
                {recordingReady
                  ? "No video data was captured."
                  : "Preparing your recording..."}
              </p>
            )}
          </section>
        )}

        {!videoUrl && !recordingReady && (
          <p className="l1-recording-status">Preparing test recording...</p>
        )}
      </main>
    </div>
  );
}

/* =========================================================
   ORIGINAL PRACTICE QUIZ
========================================================= */

function Level1Today({ onBack }) {
  const [language, setLanguage] = useState("telugu");
  const [currentQuestion, setCurrentQuestion] = useState(createQuestion);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showWrong, setShowWrong] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPrintPopup, setShowPrintPopup] = useState(false);
  const [printCount, setPrintCount] = useState("10");
  const [showTest, setShowTest] = useState(false);

  const locked = useRef(false);
  const timers = useRef([]);
  const audioRef = useRef(null);

  if (!audioRef.current) {
    audioRef.current = {
      success: new Audio("/sounds/success-1-6297.mp3"),
      fail: new Audio("/sounds/fail-2-2777575.mp3"),
      veryGood: new Audio("/sounds/very-good.mp3"),
      tryAgain: new Audio("/sounds/try-again.mp3"),
    };
  }

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);

      Object.values(audioRef.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  const schedule = (callback, delay) => {
    const id = setTimeout(callback, delay);
    timers.current.push(id);
  };

  const playAudio = (audio) => {
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const handleAnswer = (answer) => {
    if (locked.current) return;

    locked.current = true;
    setSelectedAnswer(answer);

    if (answer === currentQuestion.answer) {
      playAudio(audioRef.current.success);
      setShowSuccess(true);

      schedule(() => playAudio(audioRef.current.veryGood), 500);

      schedule(() => {
        setShowSuccess(false);
        setCurrentQuestion(createQuestion());
        setQuestionNumber((previous) => previous + 1);
        setSelectedAnswer(null);
        locked.current = false;
      }, 2500);
    } else {
      playAudio(audioRef.current.fail);
      setShowWrong(true);

      schedule(() => playAudio(audioRef.current.tryAgain), 500);

      schedule(() => {
        setShowWrong(false);
        setSelectedAnswer(null);
        locked.current = false;
      }, 2500);
    }
  };

  const handlePrint = () => {
    const count = Number(printCount);

    if (!Number.isInteger(count) || count < 1 || count > 200) {
      alert("Please enter a number between 1 and 200.");
      return;
    }

    setShowPrintPopup(false);
    printQuestions(createPrintQuestions(count, language));
  };

  if (showTest) {
    return <Level1TodayTest onBack={() => setShowTest(false)} />;
  }

  return (
    <div className="level1-quiz">
      <button className="level1-back" onClick={onBack}>← BACK</button>

      <h1>Day &amp; Date</h1>
      <h2>Level 1 - Today</h2>

      <div className="level1-language">
        <button
          className={language === "telugu" ? "active" : ""}
          onClick={() => setLanguage("telugu")}
        >
          తెలుగు
        </button>
        <button
          className={language === "english" ? "active" : ""}
          onClick={() => setLanguage("english")}
        >
          English
        </button>
      </div>

      <div className="level1-progress">Question {questionNumber}</div>

      <div className="level1-card">
        <h3>{currentQuestion.question[language]}</h3>

        <div className="level1-options">
          {currentQuestion.options.map((option) => {
            let className = "level1-option";

            if (selectedAnswer === option) {
              className += option === currentQuestion.answer
                ? " correct"
                : " wrong";
            }

            return (
              <button
                key={option}
                className={className}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <button
        className="level1-print"
        onClick={() => setShowPrintPopup(true)}
      >
        🖨️ PRINT QUESTIONS
      </button>

      <button
        className="level1-print"
        onClick={() => setShowTest(true)}
      >
        🎥 TAKE QUIZ / TEST
      </button>

      {showWrong && (
        <div className="quiz-popup">
          <div className="wrong-box">
            <div>❌</div>
            <h2>
              {language === "telugu" ? "Malli try cheyu!" : "Try again!"}
            </h2>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="quiz-popup">
          <div className="success-box">
            <div>🎉</div>
            <h2>VERY GOOD!</h2>
            <p>
              {language === "telugu"
                ? "Super! Correct answer!"
                : "Great! Correct answer!"}
            </p>
          </div>
        </div>
      )}

      {showPrintPopup && (
        <div className="print-overlay">
          <div className="print-box">
            <button
              className="print-close"
              onClick={() => setShowPrintPopup(false)}
            >
              ×
            </button>

            <div className="print-icon">🖨️</div>
            <h2>Print Questions</h2>
            <p>How many questions do you want to print?</p>

            <input
              type="number"
              min="1"
              max="200"
              value={printCount}
              onChange={(event) => setPrintCount(event.target.value)}
            />

            <p className="print-info">A4 format • No answers</p>

            <div className="print-buttons">
              <button onClick={() => setShowPrintPopup(false)}>CANCEL</button>
              <button onClick={handlePrint}>PRINT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Level1Today;
