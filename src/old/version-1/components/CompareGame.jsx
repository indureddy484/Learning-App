import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import "./CompareGame.css";
import Navbar from "./Navbar";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const play = (a) => { a.currentTime = 0; a.play().catch(() => {}); };
const twin = (a, b) => { play(a); play(b); };

const sfxRight = new Audio("/sounds/success-1-6297.mp3");
const sfxWrong = new Audio("/sounds/fail-2-277575.mp3");
const voiceRight = new Audio("/sounds/very-good.mp3");
const voiceWrong = new Audio("/sounds/try-again.mp3");
const tapSound = new Audio("/sounds/tap.mp3");

export default function CompareGame() {
  const [leftNum, setLeftNum] = useState(1);
  const [rightNum, setRightNum] = useState(1);
  const [supply, setSupply] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [pickedApple, setPickedApple] = useState("");
  const [trayOn, setTrayOn] = useState(false);
  const [pickedSym, setPickedSym] = useState("");
  const [symSlot, setSymSlot] = useState("");
  const [msg, setMsg] = useState("");
  const [itemType, setItemType] = useState("apple");

  const freshRound = () => {
    const n1 = rand(1, 9);
    const n2 = rand(1, 9);
    setLeftNum(n1);
    setRightNum(n2);
    const apples = Array.from({ length: 20 }, (_, k) => ({
      id: `a-${Date.now()}-${k}`,
      src: `/images/${itemType}.png`,
    }));
    setSupply(apples);
    setLeft([]);
    setRight([]);
    setPickedApple("");
    setPickedSym("");
    setSymSlot("");
    setTrayOn(false);
    setMsg("");
  };

  useEffect(freshRound, [itemType]);

  const togglePick = (id) => {
    play(tapSound);
    const element = document.getElementById(id);
    if (element) {
      element.classList.add("tapped");
      setTimeout(() => element.classList.remove("tapped"), 200);
    }
    setPickedApple((prev) => (prev === id ? "" : id));
  };

  const dropInto = (side) => {
    if (!pickedApple) return;
    const apple = supply.find((a) => a.id === pickedApple);
    if (!apple) return;

    if (side === "L" && left.length < leftNum) {
      setSupply((s) => s.filter((a) => a.id !== pickedApple));
      setLeft((arr) => [...arr, apple]);
    } else if (side === "R" && right.length < rightNum) {
      setSupply((s) => s.filter((a) => a.id !== pickedApple));
      setRight((arr) => [...arr, apple]);
    } else {
      return;
    }

    setPickedApple("");

    setTimeout(() => {
      setTrayOn(
        (side === "L" ? left.length + 1 : left.length) === leftNum &&
        (side === "R" ? right.length + 1 : right.length) === rightNum
      );
    }, 0);
  };

  const placeSymbol = () => {
    if (!pickedSym || symSlot) return;

    const ok =
      (pickedSym === ">" && leftNum > rightNum) ||
      (pickedSym === "<" && leftNum < rightNum) ||
      (pickedSym === "=" && leftNum === rightNum);

    if (ok) {
      twin(sfxRight, voiceRight);
      confetti({ particleCount: 120, spread: 70 });
      setSymSlot(pickedSym);
      setPickedSym("");
      setMsg("🎉 Very good Suhaas!");
      setTimeout(freshRound, 2000);
    } else {
      twin(sfxWrong, voiceWrong);
      setMsg("❌ Malli try cheyu Suhaas!");
      setPickedSym("");
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <>
      <Navbar />

      {/* ✅ Item selection bar directly below Navbar */}
      <div className="item-dropdown-bar">
        <label htmlFor="item-select"></label>
        <select
          id="item-select"
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
          className="item-type-dropdown"
        >
          <option value="apple">🍎 Apple</option>
          <option value="biscuit">🍪 Biscuit</option>
          <option value="chocolate">🍫 Chocolate</option>
          <option value="pen">🖊️ Pen</option>
          <option value="block">🧱 Block</option>
        </select>
      </div>

      <div className="cmp-container animated-bg">
        <h2 className="cmp-title">🍎 Count & Compare</h2>

        <div className="num-row">
          <span className="big-num">{leftNum}</span>
          <div
            className={`sym-slot ${symSlot ? "filled" : ""}`}
            onClick={placeSymbol}
          >
            {symSlot ? (
              <img
                src={`/images/${
                  symSlot === "<"
                    ? "less"
                    : symSlot === ">"
                    ? "greater"
                    : "equal"
                }.png`}
                alt={symSlot}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : pickedSym ? "?" : ""}
          </div>
          <span className="big-num">{rightNum}</span>
        </div>

        <div className="bucket-row">
          <div className="bucket" onClick={() => dropInto("L")}>
            <span className="apple-counter">
              {left.length} / {leftNum}
            </span>
            {left.map((a) => (
              <img key={a.id} src={a.src} alt="" className="apple" />
            ))}
          </div>

          <div className="bucket" onClick={() => dropInto("R")}>
            <span className="apple-counter">
              {right.length} / {rightNum}
            </span>
            {right.map((a) => (
              <img key={a.id} src={a.src} alt="" className="apple" />
            ))}
          </div>
        </div>

        <div className="supply">
          {supply.map((a) => (
            <img
              key={a.id}
              id={a.id}
              src={a.src}
              alt=""
              className={`apple ${pickedApple === a.id ? "picked-apple" : ""}`}
              onClick={() => togglePick(a.id)}
            />
          ))}
        </div>

        {trayOn && !symSlot && (
          <div className="sym-row">
            {["<", "=", ">"].map((sym) => (
              <div
                key={sym}
                className={`sym-box ${pickedSym === sym ? "picked" : ""}`}
                onClick={() => setPickedSym(sym)}
              >
                <img
                  src={`/images/${
                    sym === "<" ? "less" : sym === ">" ? "greater" : "equal"
                  }.png`}
                  alt={sym}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {msg && <p className="cmp-msg">{msg}</p>}
      </div>
    </>
  );
}