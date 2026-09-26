import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import confetti from "canvas-confetti";
import Navbar from "./Navbar";
import "./AscendingGame.css";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
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

export default function AscendingGame() {
  const [numbers, setNumbers] = useState([]);
  const [buckets, setBuckets] = useState([[], [], []]);
  const [supply, setSupply] = useState([]);
  const [pickedBiscuit, setPickedBiscuit] = useState("");
  const [orderSlots, setOrderSlots] = useState(["", "", ""]);
  const [pickedNum, setPickedNum] = useState("");
  const [msg, setMsg] = useState("");

  const freshRound = () => {
    let nums = [];
    while (nums.length < 3) {
      let n = rand(1, 9);
      if (!nums.includes(n)) nums.push(n);
    }
    setNumbers(nums);

    const biscuits = Array.from({ length: 30 }, (_, k) => ({
      id: `b-${Date.now()}-${k}`,
      src: "/images/biscuit.png",
    }));
    setSupply(biscuits);

    setBuckets([[], [], []]);
    setPickedBiscuit("");
    setOrderSlots(["", "", ""]);
    setPickedNum("");
    setMsg("");
  };

  useEffect(freshRound, []);

  const togglePick = (id) => {
    setPickedBiscuit((prev) => (prev === id ? "" : id));
  };

  const dropIntoBucket = (idx) => {
    if (!pickedBiscuit) return;

    if (buckets[idx].length >= numbers[idx]) {
      setMsg(`🚫 Cannot add more than ${numbers[idx]} biscuits in bucket ${numbers[idx]}.`);
      twin(sfxWrong, voiceWrong);
      setTimeout(() => setMsg(""), 2000);
      return;
    }

    const biscuit = supply.find((b) => b.id === pickedBiscuit);
    setSupply((s) => s.filter((b) => b.id !== pickedBiscuit));
    setBuckets((prev) => {
      const copy = [...prev];
      copy[idx] = [...copy[idx], biscuit];
      return copy;
    });
    setPickedBiscuit("");
  };

  const pickNum = (num) => {
    setPickedNum((prev) => (prev === num ? "" : num));
  };

  const dropIntoSlot = (idx) => {
    if (!pickedNum) return;
    if (orderSlots[idx]) return;

    setOrderSlots((prev) => {
      const copy = [...prev];
      copy[idx] = pickedNum;
      return copy;
    });
    setPickedNum("");
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    const newNums = [...numbers];
    const newBuckets = [...buckets];

    const [removedNum] = newNums.splice(sourceIndex, 1);
    const [removedBucket] = newBuckets.splice(sourceIndex, 1);

    newNums.splice(destIndex, 0, removedNum);
    newBuckets.splice(destIndex, 0, removedBucket);

    setNumbers(newNums);
    setBuckets(newBuckets);
  };

  const checkOrder = () => {
    if (orderSlots.includes("")) {
      setMsg("🚫 Please fill all slots.");
      return;
    }

    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i].length !== numbers[i]) {
        setMsg(`🚫 Number ${numbers[i]} must have ${numbers[i]} biscuits.`);
        return;
      }
    }

    const slotNums = orderSlots.map(Number);
    const correct = [...numbers].sort((a, b) => a - b);

    const isCorrect = slotNums.every((v, i) => v === correct[i]);

    if (isCorrect) {
      twin(sfxRight, voiceRight);
      confetti({ particleCount: 120, spread: 70 });
      setMsg("🎉 Very good Suhaas!");
      setTimeout(freshRound, 3000);
    } else {
      twin(sfxWrong, voiceWrong);
      setMsg("❌ Malli try cheyu Suhaas!");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <div className="order-container animated-bg">
      <Navbar />
      <h2 className="order-title">🍪 Arrange in Ascending Order!</h2>

      <div className="main-area">
        {/* Biscuit Supply */}
        <div className="supply-vertical">
          {supply.map((b) => (
            <img
              key={b.id}
              src={b.src}
              alt=""
              className={`biscuit ${pickedBiscuit === b.id ? "picked-biscuit" : ""}`}
              onClick={() => togglePick(b.id)}
            />
          ))}
        </div>

        {/* Game Area */}
        <div className="numbers-area">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="numRow" direction="horizontal">
              {(provided) => (
                <div className="num-row" {...provided.droppableProps} ref={provided.innerRef}>
                  {numbers.map((n, i) => (
                    <Draggable key={n} draggableId={n.toString()} index={i}>
                      {(provided, snapshot) => (
                        <div
                          className={`num-block ${snapshot.isDragging ? "dragging" : ""}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span className="big-num">{n}</span>
                          <div className="bucket-wrapper">
                            <div className="bucket" onClick={() => dropIntoBucket(i)}>
                              {buckets[i].map((b) => (
                                <img key={b.id} src={b.src} alt="" className="biscuit-stack" />
                              ))}
                            </div>
                            <div className="bucket-count">
                              {buckets[i].length}/{n}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Answer Area */}
          <div className="order-row">
            {orderSlots.map((val, idx) => (
              <div
                key={idx}
                className={`order-slot ${val ? "filled" : ""}`}
                onClick={() => dropIntoSlot(idx)}
              >
                {val || ""}
              </div>
            ))}
          </div>

          {/* Number Buttons */}
          <div className="num-buttons">
            {numbers.map((n) => (
              <button
                key={n}
                className={`num-btn ${pickedNum === n ? "picked" : ""}`}
                onClick={() => pickNum(n)}
              >
                {n}
              </button>
            ))}
          </div>

          <button className="check-btn" onClick={checkOrder}>
            ✅ Check Answer
          </button>

          {msg && (
            <p className={`order-msg ${msg.includes("🚫") || msg.includes("❌") ? "error" : ""}`}>
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
