import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import "./VisualLengthLevel1.css";

import {
  bigSmallQuestions,
  longShortQuestions,
} from "./visualLengthQuestions";

const AUDIO = {
  success: "/sounds/success-1-6297.mp3",
  fail: "/sounds/fail-2-2777575.mp3",
  veryGood: "/sounds/very-good.mp3",
  tryAgain: "/sounds/try-again.mp3",
};

const CATEGORY_LABELS = {
  bigSmall: "Big / Small",
  longShort: "Long / Short",
};

function shuffle(items) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

// FIX: Map the category names used by the UI to the correct arrays.
function getQuestions(category) {
  if (category === "bigSmall") {
    return bigSmallQuestions || [];
  }

  if (category === "longShort") {
    return longShortQuestions || [];
  }

  return [];
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;

  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export default function VisualLengthLevel1({ onBack }) {
  const [category, setCategory] = useState("bigSmall");
  const [screen, setScreen] = useState("learn");

  const [learnQuestions, setLearnQuestions] = useState(() =>
    shuffle(getQuestions("bigSmall"))
  );
  const [learnIndex, setLearnIndex] = useState(0);

  const [feedback, setFeedback] = useState("");
  const [locked, setLocked] = useState(false);

  const [timerMinutes, setTimerMinutes] = useState(2);
  const [secondsLeft, setSecondsLeft] = useState(120);

  const [testQuestions, setTestQuestions] = useState([]);
  const [testIndex, setTestIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState([]);

  const [testStartedAt, setTestStartedAt] = useState(null);
  const [testFinishedAt, setTestFinishedAt] = useState(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [recordingAvailable, setRecordingAvailable] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const [showPrint, setShowPrint] = useState(false);
  const [printCount, setPrintCount] = useState(8);

  const audioRefs = useRef({});
  const pendingRef = useRef(null);
  const timerRef = useRef(null);
  const finishTestRef = useRef(null);

  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const previewRef = useRef(null);
  const testActiveRef = useRef(false);
  const finishedRef = useRef(false);

  const currentLearnQuestion = learnQuestions[learnIndex];
  const currentTestQuestion = testQuestions[testIndex];

  const playSound = useCallback((name) => {
    const audio = audioRefs.current[name];

    if (!audio) return;

    try {
      audio.pause();
      audio.currentTime = 0;

      const promise = audio.play();

      if (promise?.catch) {
        promise.catch(() => {});
      }
    } catch (_) {
      // Audio may be blocked until the user interacts with the page.
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch (_) {}
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setCameraOn(false);
  }, []);

  const clearRecording = useCallback(() => {
    setVideoUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return "";
    });

    setRecordingAvailable(false);
    setShowVideo(false);
  }, []);

  const finishTest = useCallback(() => {
    if (finishedRef.current) return;

    finishedRef.current = true;
    testActiveRef.current = false;

    stopTimer();
    setTestFinishedAt(Date.now());
    setScreen("analysis");
    stopRecording();
  }, [stopRecording, stopTimer]);

  useEffect(() => {
    finishTestRef.current = finishTest;
  }, [finishTest]);

  // Timer runs only while the test is active.
  useEffect(() => {
    if (screen !== "test") return undefined;

    timerRef.current = setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;

          finishTestRef.current?.();

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [screen]);

  // Release resources when the component is unmounted.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (pendingRef.current) {
        clearTimeout(pendingRef.current);
      }

      const recorder = recorderRef.current;

      if (recorder && recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch (_) {}
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  function changeCategory(nextCategory) {
    const questions = getQuestions(nextCategory);

    if (!questions.length) {
      window.alert(
        `No questions are available for ${CATEGORY_LABELS[nextCategory]}. Add questions to visualLengthQuestions.js first.`
      );

      return;
    }

    if (pendingRef.current) {
      clearTimeout(pendingRef.current);
    }

    setCategory(nextCategory);
    setLearnQuestions(shuffle(questions));
    setLearnIndex(0);
    setFeedback("");
    setLocked(false);
  }

  function handleLearningAnswer(side) {
    if (!currentLearnQuestion || locked) return;

    const isCorrect = side === currentLearnQuestion.answer;

    setLocked(true);

    if (pendingRef.current) {
      clearTimeout(pendingRef.current);
    }

    if (isCorrect) {
      setFeedback("correct");
      playSound("success");

      pendingRef.current = setTimeout(() => {
        playSound("veryGood");
      }, 250);

      pendingRef.current = setTimeout(() => {
        setFeedback("");
        setLocked(false);

        setLearnIndex((previous) => {
          const next = previous + 1;

          if (next < learnQuestions.length) {
            return next;
          }

          // Start another shuffled round after reaching the end.
          setLearnQuestions(shuffle(getQuestions(category)));

          return 0;
        });
      }, 1100);
    } else {
      setFeedback("wrong");
      playSound("fail");

      pendingRef.current = setTimeout(() => {
        playSound("tryAgain");
      }, 250);

      pendingRef.current = setTimeout(() => {
        setFeedback("");
        setLocked(false);

        // Keep the child on the same question after a wrong answer.
      }, 1000);
    }
  }

  function handleTestAnswer(side) {
    if (
      !currentTestQuestion ||
      !testActiveRef.current ||
      finishedRef.current
    ) {
      return;
    }

    const isCorrect = side === currentTestQuestion.answer;

    setTestAnswers((previous) => [
      ...previous,
      {
        question: currentTestQuestion,
        selected: side,
        correct: isCorrect,
        answeredAt: Date.now(),
      },
    ]);

    playSound(isCorrect ? "success" : "fail");

    const nextIndex = testIndex + 1;

    if (nextIndex >= testQuestions.length) {
      const bank = getQuestions(category);

      if (bank.length) {
        setTestQuestions((previous) => [
          ...previous,
          ...shuffle(bank),
        ]);
      }
    }

    setTestIndex(nextIndex);
  }

  async function startTest() {
    const bank = getQuestions(category);

    if (!bank.length) {
      window.alert("Please add at least one question to the question bank.");
      return;
    }

    clearRecording();
    setCameraError("");

    setTestAnswers([]);
    setTestQuestions(shuffle(bank));
    setTestIndex(0);

    setSecondsLeft(timerMinutes * 60);
    setTestStartedAt(Date.now());
    setTestFinishedAt(null);

    finishedRef.current = false;
    testActiveRef.current = true;

    setScreen("test");

    try {
      if (
        navigator.mediaDevices?.getUserMedia &&
        typeof MediaRecorder !== "undefined"
      ) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // If the test ended while permission was pending, release the stream.
        if (!testActiveRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setCameraOn(true);

        if (previewRef.current) {
          previewRef.current.srcObject = stream;
        }

        const recorder = new MediaRecorder(stream);

        recorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          if (chunksRef.current.length) {
            const blob = new Blob(chunksRef.current, {
              type: recorder.mimeType || "video/webm",
            });

            const url = URL.createObjectURL(blob);

            setVideoUrl((previous) => {
              if (previous) {
                URL.revokeObjectURL(previous);
              }

              return url;
            });

            setRecordingAvailable(true);
          }
        };

        recorder.start();
      } else {
        setCameraError(
          "Camera recording is not supported in this browser. You can still take the quiz."
        );
      }
    } catch (_) {
      setCameraError(
        "Camera or microphone permission was not granted. You can still take the quiz."
      );
    }
  }

  function returnToPractice() {
    testActiveRef.current = false;
    finishedRef.current = true;

    stopTimer();
    stopRecording();
    clearRecording();

    setTestAnswers([]);
    setTestQuestions([]);
    setTestIndex(0);
    setFeedback("");
    setLocked(false);
    setScreen("learn");
  }

  const correctCount = testAnswers.filter((item) => item.correct).length;
  const incorrectCount = testAnswers.filter((item) => !item.correct).length;
  const attemptedCount = testAnswers.length;

  const accuracy = attemptedCount
    ? Math.round((correctCount / attemptedCount) * 100)
    : 0;

  const bankForPrint = getQuestions(category);

  const printQuestions = shuffle(bankForPrint).slice(
    0,
    Math.min(printCount, bankForPrint.length)
  );

  return (
    <main className="visual-length-screen">
      {Object.entries(AUDIO).map(([name, src]) => (
        <audio
          key={name}
          ref={(element) => {
            audioRefs.current[name] = element;
          }}
          src={src}
          preload="auto"
        />
      ))}

      <header className="vl-toolbar">
        <button
          className="vl-button vl-button-light"
          onClick={() => {
            if (screen === "test" || screen === "analysis") {
              returnToPractice();
            } else if (screen === "setup") {
              setScreen("learn");
            } else if (onBack) {
              onBack();
            }
          }}
        >
          ← Back
        </button>

        <div className="vl-title">
          <h1>Visual Length – Level 1</h1>
          <p>Look carefully and choose the correct picture.</p>
        </div>

        <button
          className="vl-button vl-button-print"
          onClick={() => setShowPrint(true)}
        >
          🖨 Print Questions
        </button>
      </header>

      {screen === "learn" && (
        <>
          <nav className="vl-category-tabs">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`vl-tab ${category === key ? "active" : ""}`}
                onClick={() => changeCategory(key)}
              >
                {label}
              </button>
            ))}
          </nav>

          <section className="vl-card">
            <div className="vl-card-meta">
              <span className="vl-pill">Practice</span>

              <span>
                Question {learnQuestions.length ? learnIndex + 1 : 0} of{" "}
                {learnQuestions.length}
              </span>
            </div>

            <h2>
              {currentLearnQuestion?.prompt || "Add a question to begin"}
            </h2>

            <p className="vl-instruction">
              Tap the picture that answers the question.
            </p>

            {currentLearnQuestion ? (
              <PictureChoices
                question={currentLearnQuestion}
                onChoose={handleLearningAnswer}
                disabled={locked}
              />
            ) : (
              <p className="vl-empty">
                Add questions to `visualLengthQuestions.js` to begin.
              </p>
            )}

            {feedback === "correct" && (
              <div className="vl-feedback vl-feedback-correct">
                🌟 Very good! That's correct!
              </div>
            )}

            {feedback === "wrong" && (
              <div className="vl-feedback vl-feedback-wrong">
                💛 Try again. Look carefully!
              </div>
            )}
          </section>

          <div className="vl-actions">
            <button
              className="vl-button vl-button-primary"
              onClick={() => setScreen("setup")}
            >
              ▶ Start Quiz
            </button>
          </div>
        </>
      )}

      {screen === "setup" && (
        <section className="vl-card vl-setup-card">
          <h2>Quiz Setup</h2>

          <p className="vl-instruction">
            Questions will repeat in shuffled rounds until the timer ends or
            you press End Test.
          </p>

          <label htmlFor="vl-timer">Select timer</label>

          <select
            id="vl-timer"
            value={timerMinutes}
            onChange={(event) => setTimerMinutes(Number(event.target.value))}
          >
            {[1, 2, 5, 10, 15].map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} minute{minutes > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          <p className="vl-small-note">
            Camera and microphone access is optional. If permission is denied,
            you can still take the test.
          </p>

          <div className="vl-actions">
            <button
              className="vl-button vl-button-light"
              onClick={() => setScreen("learn")}
            >
              Cancel
            </button>

            <button
              className="vl-button vl-button-primary"
              onClick={startTest}
            >
              Start Test
            </button>
          </div>
        </section>
      )}

      {screen === "test" && (
        <>
          <div className="vl-test-toolbar">
            <strong>Time left: {formatTime(secondsLeft)}</strong>
            <span>Answered: {testAnswers.length}</span>

            <button
              className="vl-button vl-button-end"
              onClick={finishTest}
            >
              End Test
            </button>
          </div>

          {cameraError && (
            <p className="vl-camera-message">{cameraError}</p>
          )}

          <section className="vl-card">
            <div className="vl-card-meta">
              <span className="vl-pill">Quiz in progress</span>
              <span>Question {testIndex + 1}</span>
            </div>

            <h2>
              {currentTestQuestion?.prompt || "Loading question..."}
            </h2>

            {currentTestQuestion && (
              <PictureChoices
                question={currentTestQuestion}
                onChoose={handleTestAnswer}
              />
            )}
          </section>

          {cameraOn && (
            <div className="vl-camera-preview">
              <video
                ref={previewRef}
                autoPlay
                muted
                playsInline
              />
              <span>Recording</span>
            </div>
          )}
        </>
      )}

      {screen === "analysis" && (
        <section className="vl-card vl-analysis">
          <h2>Quiz Analysis Report</h2>

          <div className="vl-score-grid">
            <div>
              <strong>{correctCount}</strong>
              <span>Correct</span>
            </div>

            <div>
              <strong>{incorrectCount}</strong>
              <span>Incorrect</span>
            </div>

            <div>
              <strong>{attemptedCount}</strong>
              <span>Answered</span>
            </div>

            <div>
              <strong>{accuracy}%</strong>
              <span>Accuracy</span>
            </div>
          </div>

          <p className="vl-instruction">
            Time used:{" "}
            {testStartedAt && testFinishedAt
              ? formatTime(
                  Math.round((testFinishedAt - testStartedAt) / 1000)
                )
              : "—"}
          </p>

          {recordingAvailable && (
            <div className="vl-video-controls">
              <button
                className="vl-button vl-button-light"
                onClick={() => setShowVideo((previous) => !previous)}
              >
                {showVideo ? "Hide Recorded Video" : "▶ Play Recorded Video"}
              </button>

              {showVideo && (
                <video
                  className="vl-recorded-video"
                  src={videoUrl}
                  controls
                  playsInline
                />
              )}
            </div>
          )}

          <div className="vl-answer-list">
            <h3>Answer details</h3>

            {testAnswers.length === 0 ? (
              <p>No questions were answered.</p>
            ) : (
              testAnswers.map((item, index) => (
                <div
                  className="vl-answer-row"
                  key={`${item.question.id}-${index}`}
                >
                  <span>
                    {index + 1}. {item.question.prompt}
                  </span>

                  <strong className={item.correct ? "correct" : "incorrect"}>
                    {item.correct ? "Correct" : "Incorrect"}
                  </strong>
                </div>
              ))
            )}
          </div>

          <div className="vl-actions">
            <button
              className="vl-button vl-button-light"
              onClick={returnToPractice}
            >
              Return to Practice
            </button>

            <button
              className="vl-button vl-button-primary"
              onClick={() => {
                returnToPractice();
                setScreen("setup");
              }}
            >
              Take Another Test
            </button>
          </div>
        </section>
      )}

      {showPrint && (
        <div
          className="vl-modal-backdrop"
          onClick={() => setShowPrint(false)}
        >
          <section
            className="vl-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="vl-close"
              onClick={() => setShowPrint(false)}
              aria-label="Close"
            >
              ×
            </button>

            <h2>Print Questions</h2>

            <p>
              Choose the number of questions to print from the current
              category's question bank.
            </p>

            <label htmlFor="vl-print-count">Number of questions</label>

            <select
              id="vl-print-count"
              value={printCount}
              onChange={(event) => setPrintCount(Number(event.target.value))}
            >
              {[4, 8, 12, 16, 20, 30, 40, 50, 60, 100].map((count) => (
                <option key={count} value={count}>
                  {count} questions
                </option>
              ))}
            </select>

            <div className="vl-actions">
              <button
                className="vl-button vl-button-light"
                onClick={() => setShowPrint(false)}
              >
                Cancel
              </button>

              <button
                className="vl-button vl-button-primary"
                onClick={() => {
                  if (!bankForPrint.length) {
                    window.alert("There are no questions to print.");
                    return;
                  }

                  setShowPrint(false);
                  setTimeout(() => window.print(), 200);
                }}
              >
                Print
              </button>
            </div>
          </section>
        </div>
      )}

      <section className="vl-print-sheet">
        <h1>Visual Length – Level 1</h1>
        <h2>{CATEGORY_LABELS[category]}</h2>

        <div className="vl-print-grid">
          {printQuestions.map((question, index) => (
            <div
              className="vl-print-item"
              key={`${question.id}-${index}`}
            >
              <p>
                {index + 1}. {question.prompt}
              </p>

              <div className="vl-print-pictures">
                <img src={question.leftImage} alt="Left choice" />
                <img src={question.rightImage} alt="Right choice" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function PictureChoices({ question, onChoose, disabled = false }) {
  return (
    <div className="vl-picture-choices">
      <button
        type="button"
        className="vl-picture-option"
        onClick={() => onChoose("left")}
        disabled={disabled}
        aria-label="Choose left picture"
      >
        <img src={question.leftImage} alt="Left picture option" />
        <span>Left</span>
      </button>

      <button
        type="button"
        className="vl-picture-option"
        onClick={() => onChoose("right")}
        disabled={disabled}
        aria-label="Choose right picture"
      >
        <img src={question.rightImage} alt="Right picture option" />
        <span>Right</span>
      </button>
    </div>
  );
}