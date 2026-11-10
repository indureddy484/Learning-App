
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import confetti from "canvas-confetti";
import "./AscendingGame.css";

const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const SOUND_PATHS = {
  success: "/sounds/success-1-6297.mp3",
  failure: "/sounds/fail-2-277575.mp3",
  veryGood: "/sounds/very-good.mp3",
  tryAgain: "/sounds/try-again.mp3",
};

export default function AscendingGame({ onBack }) {
  const [numbers, setNumbers] = useState([]);
  const [buckets, setBuckets] = useState([[], [], []]);
  const [supply, setSupply] = useState([]);
  const [pickedBiscuit, setPickedBiscuit] = useState("");
  const [orderSlots, setOrderSlots] = useState(["", "", ""]);
  const [pickedNum, setPickedNum] = useState("");
  const [msg, setMsg] = useState("");
  const [messageType, setMessageType] = useState("");

  const timeoutRef = useRef(null);

  const playSound = useCallback((path) => {
    const audio = new Audio(path);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  const playFeedback = useCallback(
    (type) => {
      if (type === "success") {
        playSound(SOUND_PATHS.success);
        window.setTimeout(
          () => playSound(SOUND_PATHS.veryGood),
          120
        );
      } else {
        playSound(SOUND_PATHS.failure);
        window.setTimeout(
          () => playSound(SOUND_PATHS.tryAgain),
          120
        );
      }
    },
    [playSound]
  );

  const showMessage = useCallback(
    (message, type = "error", duration = 2500) => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      setMsg(message);
      setMessageType(type);

      if (duration > 0) {
        timeoutRef.current = window.setTimeout(() => {
          setMsg("");
          setMessageType("");
        }, duration);
      }
    },
    []
  );

  const freshRound = useCallback(() => {
    const nums = [];

    while (nums.length < 3) {
      const value = rand(1, 9);

      if (!nums.includes(value)) {
        nums.push(value);
      }
    }

    const biscuits = Array.from({ length: 30 }, (_, index) => ({
      id: `b-${Date.now()}-${index}`,
      src: "/images/biscuit.png",
    }));

    setNumbers(nums);
    setSupply(biscuits);
    setBuckets([[], [], []]);
    setPickedBiscuit("");
    setOrderSlots(["", "", ""]);
    setPickedNum("");
    setMsg("");
    setMessageType("");

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    freshRound();

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [freshRound]);

  // Select or deselect a biscuit
  const togglePick = (id) => {
    setPickedBiscuit((previous) =>
      previous === id ? "" : id
    );
  };

  // Add selected biscuit to a bucket
  const dropIntoBucket = (index) => {
    if (!pickedBiscuit) {
      showMessage("Select a biscuit first.", "info", 1800);
      return;
    }

    if (buckets[index].length >= numbers[index]) {
      playFeedback("failure");

      showMessage(
        `This bucket needs only ${numbers[index]} biscuits.`,
        "error"
      );

      return;
    }

    const biscuit = supply.find(
      (item) => item.id === pickedBiscuit
    );

    if (!biscuit) return;

    setSupply((previous) =>
      previous.filter((item) => item.id !== pickedBiscuit)
    );

    setBuckets((previous) =>
      previous.map((bucket, bucketIndex) =>
        bucketIndex === index
          ? [...bucket, biscuit]
          : bucket
      )
    );

    setPickedBiscuit("");
    setMsg("");
    setMessageType("");
  };

  // Select a number for the answer
  const pickNum = (num) => {
    setPickedNum((previous) =>
      previous === num ? "" : num
    );
  };

  // Place selected number into an answer slot
  const dropIntoSlot = (index) => {
    if (!pickedNum) {
      showMessage("Choose a number first.", "info", 1800);
      return;
    }

    setOrderSlots((previous) => {
      const next = [...previous];
      next[index] = pickedNum;
      return next;
    });

    setPickedNum("");
    setMsg("");
    setMessageType("");
  };

  // Drag and reorder number cards with their buckets
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const from = result.source.index;
    const to = result.destination.index;

    if (from === to) return;

    setNumbers((previous) => {
      const next = [...previous];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

    setBuckets((previous) => {
      const next = [...previous];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  // Check the final ascending order
  const checkOrder = () => {
    if (orderSlots.some((value) => value === "")) {
      showMessage("Fill all three answer boxes.", "error");
      return;
    }

    const incompleteIndex = buckets.findIndex(
      (bucket, index) =>
        bucket.length !== numbers[index]
    );

    if (incompleteIndex !== -1) {
      showMessage(
        `Number ${numbers[incompleteIndex]} needs ${numbers[incompleteIndex]} biscuits.`,
        "error"
      );
      return;
    }

    const answer = orderSlots.map(Number);

    const expected = [...numbers].sort(
      (a, b) => a - b
    );

    const correct = answer.every(
      (value, index) => value === expected[index]
    );

    if (correct) {
      playFeedback("success");

      confetti({
        particleCount: 100,
        spread: 65,
        origin: { y: 0.65 },
      });

      showMessage(
        "🎉 Very good! You arranged the numbers correctly!",
        "success",
        2800
      );

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(
        freshRound,
        3000
      );
    } else {
      playFeedback("failure");

      showMessage(
        "Try again. Arrange the numbers from smallest to biggest.",
        "error",
        2800
      );
    }
  };

  return (
    <main className="ascending-page">
      <header className="ascending-header">
        <button
          className="ascending-back-button"
          type="button"
          onClick={onBack}
        >
          ← BACK
        </button>

        <div className="ascending-heading">
          <span className="ascending-eyebrow">
            MATHS ACTIVITY
          </span>

          <h1>Arrange in Ascending Order</h1>

          <p>
            Count the biscuits, then arrange the numbers
            from smallest to biggest.
          </p>
        </div>
      </header>

      <section className="ascending-card">
        <div className="ascending-workspace">

          {/* NUMBER AND ANSWER AREA */}
          <section
            className="ascending-number-area"
            aria-label="Number buckets and answer area"
          >
            <h2>1. Count the biscuits</h2>

            <p className="ascending-instruction">
              Select a biscuit and tap its bucket.
              Drag the number cards to change their positions.
            </p>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable
                droppableId="ascending-number-row"
                direction="horizontal"
              >
                {(provided) => (
                  <div
                    className="ascending-number-row"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {numbers.map((number, index) => (
                      <Draggable
                        key={number}
                        draggableId={String(number)}
                        index={index}
                      >
                        {(dragProvided, snapshot) => (
                          <article
                            className={`ascending-number-card ${
                              snapshot.isDragging
                                ? "is-dragging"
                                : ""
                            }`}
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                          >
                            <span className="ascending-big-number">
                              {number}
                            </span>

                            <button
                              type="button"
                              className="ascending-bucket"
                              onClick={() =>
                                dropIntoBucket(index)
                              }
                              aria-label={`Add selected biscuit to bucket for number ${number}`}
                            >
                              {buckets[index].map((biscuit) => (
                                <img
                                  key={biscuit.id}
                                  src={biscuit.src}
                                  alt=""
                                />
                              ))}

                              {buckets[index].length === 0 && (
                                <span className="ascending-bucket-placeholder">
                                  Tap to add
                                </span>
                              )}
                            </button>

                            <span className="ascending-bucket-count">
                              {buckets[index].length} / {number}
                            </span>
                          </article>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className="ascending-divider" />

            <h2>2. Arrange the numbers</h2>

            <p className="ascending-instruction">
              Choose a number below, then tap an answer box.
            </p>

            <div className="ascending-answer-row">
              {orderSlots.map((value, index) => (
                <button
                  key={index}
                  type="button"
                  className={`ascending-answer-slot ${
                    value !== "" ? "is-filled" : ""
                  }`}
                  onClick={() => dropIntoSlot(index)}
                  aria-label={`Answer position ${index + 1}`}
                >
                  {value || "?"}
                </button>
              ))}
            </div>

            <div className="ascending-number-buttons">
              {numbers.map((number) => (
                <button
                  key={number}
                  type="button"
                  className={`ascending-number-button ${
                    pickedNum === number ? "is-selected" : ""
                  }`}
                  onClick={() => pickNum(number)}
                  aria-pressed={pickedNum === number}
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              className="ascending-check-button"
              type="button"
              onClick={checkOrder}
            >
              ✓ Check Answer
            </button>

            {msg && (
              <div
                className={`ascending-message ${messageType}`}
                role="status"
                aria-live="polite"
              >
                {msg}
              </div>
            )}
          </section>

          {/* BISCUIT SUPPLY AREA */}
          <aside className="ascending-supply-panel">
            <div className="ascending-supply-heading">
              <h2>Biscuits</h2>
              <span>{supply.length} left</span>
            </div>

            <p>Select one biscuit to use.</p>

            <div className="ascending-supply-grid">
              {supply.map((biscuit) => (
                <button
                  key={biscuit.id}
                  type="button"
                  className={`ascending-biscuit-button ${
                    pickedBiscuit === biscuit.id
                      ? "is-selected"
                      : ""
                  }`}
                  onClick={() => togglePick(biscuit.id)}
                  aria-label="Select biscuit"
                  aria-pressed={pickedBiscuit === biscuit.id}
                >
                  <img src={biscuit.src} alt="" />
                </button>
              ))}

              {supply.length === 0 && (
                <span className="ascending-supply-empty">
                  All biscuits used
                </span>
              )}
            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}
