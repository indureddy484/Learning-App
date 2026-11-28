
import React, { useMemo, useState } from "react";
import "./MoneyLevel4.css";

// Product images: src/assets/money-items
const moneyItemContext = require.context(
  "../../../assets/money-items",
  false,
  /\.(png|jpe?g|webp|avif|gif|bmp|svg|tif|tiff|ico)$/i
);

// Currency notes and coins from public folder
const denominations = [
  {
    value: 50,
    type: "note",
    label: "₹50 Note",
    image: "/money-notes/50-rupee-note.png",
  },
  {
    value: 20,
    type: "note",
    label: "₹20 Note",
    image: "/money-notes/20-rupee-note.png",
  },
  {
    value: 10,
    type: "note",
    label: "₹10 Note",
    image: "/money-notes/ten-rupee-note.png",
  },
  {
    value: 5,
    type: "coin",
    label: "₹5 Coin",
    image: "/money-coins/five-rupee-coin.png",
  },
  {
    value: 2,
    type: "coin",
    label: "₹2 Coin",
    image: "/money-coins/two-rupee-coin.png",
  },
  {
    value: 1,
    type: "coin",
    label: "₹1 Coin",
    image: "/money-coins/one-rupee-coin.png",
  },
];

// Read price and serial number from filenames such as 80_01.png
const moneyItems = moneyItemContext
  .keys()
  .map((filePath) => {
    const fileName = filePath.split("/").pop();
    const name = fileName.replace(/\.[^.]+$/, "");
    const match = name.match(/^(\d+)_(\d+)$/);

    if (!match) return null;

    return {
      id: name,
      price: Number(match[1]),
      serial: Number(match[2]),
      image: moneyItemContext(filePath),
      name: `Item ₹${match[1]}`,
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.price - b.price || a.serial - b.serial);

// Generate all possible combinations using unlimited denominations
function generateCombinations(target) {
  const results = [];

  function generate(index, remaining, current) {
    if (remaining === 0) {
      results.push([...current]);
      return;
    }

    if (index >= denominations.length) return;

    const denomination = denominations[index];
    const maxCount = Math.floor(remaining / denomination.value);

    for (let count = maxCount; count >= 0; count--) {
      const next = [...current];

      for (let i = 0; i < count; i++) {
        next.push(denomination.value);
      }

      generate(
        index + 1,
        remaining - count * denomination.value,
        next
      );
    }
  }

  generate(0, target, []);
  return results;
}

// Combination order does not matter
function getCombinationKey(values) {
  return [...values].sort((a, b) => b - a).join("-");
}

function formatCombination(values) {
  return values.map((value) => `₹${value}`).join(" + ");
}

function MoneyLevel4({ onBack }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentMoney, setCurrentMoney] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showMissedCombinations, setShowMissedCombinations] =
    useState(false);
  const [draggedValue, setDraggedValue] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const target = selectedItem?.price || 0;

  const currentTotal = currentMoney.reduce(
    (sum, value) => sum + value,
    0
  );

  const possibleCombinations = useMemo(
    () => (target > 0 ? generateCombinations(target) : []),
    [target]
  );

  const possibleKeys = useMemo(
    () =>
      new Set(
        possibleCombinations.map((item) =>
          getCombinationKey(item)
        )
      ),
    [possibleCombinations]
  );

  const recordedCorrectKeys = useMemo(
    () =>
      new Set(
        attempts
          .filter((attempt) => attempt.isCorrect)
          .map((attempt) => attempt.key)
      ),
    [attempts]
  );

  const missedCombinations = possibleCombinations.filter(
    (combination) =>
      !recordedCorrectKeys.has(getCombinationKey(combination))
  );

  // Add money to payment tray
  const addMoney = (value) => {
    setCurrentMoney((previous) => [...previous, value]);
    setShowAnalysis(false);
    setShowMissedCombinations(false);
  };

  // Remove individual money from payment tray
  const removeMoney = (index) => {
    setCurrentMoney((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  // Clear payment tray
  const resetCurrentCombination = () => {
    setCurrentMoney([]);
  };

  // Save both correct and incorrect attempts
  const saveCombination = () => {
    if (currentMoney.length === 0) {
      alert("Please add money to the payment counter first!");
      return;
    }

    const key = getCombinationKey(currentMoney);

    const isDuplicate = attempts.some(
      (attempt) => attempt.key === key
    );

    const isCorrect = currentTotal === target;

    const newAttempt = {
      id: Date.now() + Math.random(),
      values: [...currentMoney],
      total: currentTotal,
      key,
      isCorrect,
      isPossible: possibleKeys.has(key),
      isDuplicate,
    };

    setAttempts((previous) => [...previous, newAttempt]);
    setCurrentMoney([]);
    setShowAnalysis(false);
    setShowMissedCombinations(false);
  };

  // Submit and show progress without revealing missed answers
  const submitActivity = () => {
    setCurrentMoney([]);
    setShowAnalysis(true);
    setShowMissedCombinations(false);
  };

  // Continue finding combinations
  const tryAgain = () => {
    setCurrentMoney([]);
    setShowAnalysis(false);
    setShowMissedCombinations(false);
  };

  // Return to supermarket and reset current item
  const chooseAnotherItem = () => {
    setSelectedItem(null);
    setCurrentMoney([]);
    setAttempts([]);
    setShowAnalysis(false);
    setShowMissedCombinations(false);
  };

  // Drag money
  const handleDragStart = (event, value) => {
    setDraggedValue(value);
    event.dataTransfer.setData("moneyValue", String(value));
    event.dataTransfer.effectAllowed = "copy";
  };

  // Drop money into cashier tray
  const handleDrop = (event) => {
    event.preventDefault();

    const value = Number(
      event.dataTransfer.getData("moneyValue") || draggedValue
    );

    if (denominations.some((item) => item.value === value)) {
      addMoney(value);
    }

    setDraggedValue(null);
  };

  // Handle missing note/coin images
  const handleImageError = (id) => {
    setImageErrors((previous) => ({
      ...previous,
      [id]: true,
    }));
  };

  // ==========================================
  // SCREEN 1: SUPERMARKET
  // ==========================================

  if (!selectedItem) {
    return (
      <div className="money4-container money4-store-page">

        {/* BACK TO MONEY LEVELS */}
       {/* BACK TO MONEY LEVELS */}
<button
  type="button"
  className="money4-store-back-button"
  onClick={onBack}
>
  ← Back to Money Levels
</button>

        <div className="money4-store-header">
          <div className="money4-store-logo">🛒</div>

          <div>
            <h1>Happy Mart Supermarket</h1>
            <p>
              Pick your favourite item and head to the billing counter!
            </p>
          </div>
        </div>

        <div className="money4-store-sign">
          <span>🏪</span>

          <div>
            <h2>Shop Your Favourite Items</h2>
            <p>Choose an item to start shopping</p>
          </div>
        </div>

        {moneyItems.length === 0 ? (
          <div className="money4-empty">
            <h3>No product images found!</h3>
            <p>
              Check your src/assets/money-items folder and filenames.
            </p>
            <p>
              Use filenames such as 80_01.png or 100_02.jpg.
            </p>
          </div>
        ) : (
          <div className="money4-shelf">
            <div className="money4-item-grid">
              {moneyItems.map((item) => (
                <button
                  type="button"
                  className="money4-item-card"
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setCurrentMoney([]);
                    setAttempts([]);
                    setShowAnalysis(false);
                    setShowMissedCombinations(false);
                  }}
                >
                  <div className="money4-product-display">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="money4-product-image"
                    />
                  </div>

                  <span className="money4-item-select">
                    🛒 Add to Basket
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // SCREEN 2: CHECKOUT / CASHIER COUNTER
  // ==========================================

  return (
    <div className="money4-container money4-checkout-page">

      <div className="money4-checkout-header">

        {/* RETURN TO PRODUCT SELECTION */}
        <button
          type="button"
          className="money4-back-to-shop"
          onClick={chooseAnotherItem}
        >
          ← Shop
        </button>

        <div className="money4-checkout-brand">
          <span>🛒</span>

          <div>
            <h1>Happy Mart</h1>
            <p>Billing Counter</p>
          </div>
        </div>

        <span className="money4-checkout-icon">🧾</span>
      </div>

      <main className="money4-activity">

        {/* SELECTED PRODUCT AND PRICE */}
        <section className="money4-product-section">

          <div className="money4-selected-product-wrap">
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="money4-selected-product"
            />
          </div>

          <div className="money4-product-info">
            <span className="money4-bill-label">
              YOUR PURCHASE
            </span>

            <h2>Selected Item</h2>
            <p>One item</p>
          </div>

          <div className="money4-price">
            <span>AMOUNT TO PAY</span>
            <strong>₹{target}</strong>
          </div>
        </section>

        {/* ACTIVITY INSTRUCTIONS */}
        <div className="money4-task-heading">
          <span className="money4-task-icon">💰</span>

          <div>
            <h2>Pay for Your Shopping</h2>

            <p>
              Find different ways to make exactly ₹{target} using
              notes and coins.
            </p>
          </div>
        </div>

        {/* WALLET AND CASHIER */}
        <div className="money4-workspace">

          {/* WALLET */}
          <section className="money4-wallet">

            <div className="money4-panel-heading">
              <span className="money4-panel-icon">👛</span>

              <div>
                <h3>Your Wallet</h3>
                <p>Choose your money</p>
              </div>
            </div>

            {/* NOTES */}
            <div className="money4-money-group">
              <h4>💵 Currency Notes</h4>

              <div className="money4-money-grid">
                {denominations
                  .filter((item) => item.type === "note")
                  .map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      className="money4-money-button money4-note-button"
                      onClick={() => addMoney(item.value)}
                      draggable
                      onDragStart={(event) =>
                        handleDragStart(event, item.value)
                      }
                      title={`Add ${item.label}`}
                    >
                      {imageErrors[item.image] ? (
                        <span className="money4-image-fallback">
                          ₹{item.value}
                        </span>
                      ) : (
                        <img
                          src={item.image}
                          alt={item.label}
                          onError={() =>
                            handleImageError(item.image)
                          }
                        />
                      )}

                      <span>{item.label}</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* COINS */}
            <div className="money4-money-group">
              <h4>🪙 Coins</h4>

              <div className="money4-money-grid money4-coin-grid">
                {denominations
                  .filter((item) => item.type === "coin")
                  .map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      className="money4-money-button money4-coin-button"
                      onClick={() => addMoney(item.value)}
                      draggable
                      onDragStart={(event) =>
                        handleDragStart(event, item.value)
                      }
                      title={`Add ${item.label}`}
                    >
                      {imageErrors[item.image] ? (
                        <span className="money4-image-fallback">
                          ₹{item.value}
                        </span>
                      ) : (
                        <img
                          src={item.image}
                          alt={item.label}
                          onError={() =>
                            handleImageError(item.image)
                          }
                        />
                      )}

                      <span>{item.label}</span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="money4-unlimited">
              <span>∞</span>
              Unlimited notes and coins
            </div>
          </section>

          {/* CASHIER PAYMENT COUNTER */}
          <section
            className="money4-payment"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >

            <div className="money4-panel-heading">
              <span className="money4-panel-icon">🧾</span>

              <div>
                <h3>Cashier Counter</h3>
                <p>Place your money here</p>
              </div>
            </div>

            {/* PAYMENT TRAY */}
            <div className="money4-payment-box">
              {currentMoney.length === 0 ? (
                <div className="money4-drop-message">
                  <span>💵</span>
                  <h3>Payment Tray</h3>
                  <p>Place your notes and coins here</p>
                  <small>
                    Click or drag money from your wallet
                  </small>
                </div>
              ) : (
                <div className="money4-selected-money">
                  {currentMoney.map((value, index) => {
                    const money = denominations.find(
                      (item) => item.value === value
                    );

                    return (
                      <button
                        type="button"
                        className={`money4-selected-token ${
                          money.type === "note"
                            ? "money4-selected-note"
                            : "money4-selected-coin"
                        }`}
                        key={`${index}-${value}`}
                        onClick={() => removeMoney(index)}
                        title="Click to remove this money"
                      >
                        <img
                          src={money.image}
                          alt={money.label}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />

                        <span>₹{value}</span>
                        <small>✕ Remove</small>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* TOTAL */}
            <div className="money4-total">
              <span>Amount Placed</span>
              <strong>₹{currentTotal}</strong>
            </div>

            <div
              className={`money4-total-status ${
                currentTotal === target
                  ? "money4-status-correct"
                  : currentTotal > target
                  ? "money4-status-over"
                  : ""
              }`}
            >
              {currentTotal === target
                ? "🎉 Exact amount! Save this combination."
                : currentTotal > target
                ? `₹${currentTotal - target} extra. Remove some money.`
                : `₹${target - currentTotal} more needed.`}
            </div>

            {/* COUNTER BUTTONS */}
            <div className="money4-payment-actions">
              <button
                type="button"
                className="money4-reset-button"
                onClick={resetCurrentCombination}
              >
                ↺ Clear Tray
              </button>

              <button
                type="button"
                className="money4-save-button"
                onClick={saveCombination}
                disabled={currentMoney.length === 0}
              >
                ✓ Save Combination
              </button>
            </div>
          </section>
        </div>

        {/* SAVED COMBINATIONS */}
        <section className="money4-attempts">

          <div className="money4-section-heading">
            <h3>📝 Your Saved Combinations</h3>
            <span>{attempts.length} attempts</span>
          </div>

          {attempts.length === 0 ? (
            <p className="money4-no-attempts">
              Your saved combinations will appear here.
            </p>
          ) : (
            <div className="money4-attempt-list">
              {attempts.map((attempt, index) => (
                <div
                  className={`money4-attempt ${
                    attempt.isCorrect
                      ? "money4-attempt-correct"
                      : "money4-attempt-wrong"
                  }`}
                  key={attempt.id}
                >
                  <div className="money4-attempt-number">
                    {index + 1}
                  </div>

                  <div className="money4-attempt-details">
                    <strong>
                      {formatCombination(attempt.values)}
                    </strong>

                    <span>
                      Total: ₹{attempt.total} / Target: ₹{target}
                    </span>

                    {attempt.isDuplicate && (
                      <small className="money4-duplicate-label">
                        ⚠️ Duplicate combination
                      </small>
                    )}

                    {!attempt.isCorrect && (
                      <small className="money4-wrong-label">
                        ✗ Incorrect total
                      </small>
                    )}
                  </div>

                  <div className="money4-attempt-result">
                    {attempt.isCorrect ? "✓" : "✗"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SUBMIT */}
        <div className="money4-submit-section">
          <button
            type="button"
            className="money4-submit-button"
            onClick={submitActivity}
          >
            Submit & Check Progress
          </button>
        </div>

        {/* PROGRESS ANALYSIS */}
        {showAnalysis && (
          <section className="money4-analysis">

            <div className="money4-analysis-heading">
              <span>📊</span>

              <div>
                <h2>Your Shopping Progress</h2>
                <p>
                  Let's see how many ways you have discovered!
                </p>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="money4-progress-bar">
              <div
                className="money4-progress-fill"
                style={{
                  width: `${
                    possibleCombinations.length === 0
                      ? 0
                      : (recordedCorrectKeys.size /
                          possibleCombinations.length) *
                        100
                  }%`,
                }}
              />
            </div>

            {/* ANALYSIS STATS */}
            <div className="money4-analysis-stats">

              <div className="money4-stat-card">
                <span>Possible Ways</span>
                <strong>{possibleCombinations.length}</strong>
              </div>

              <div className="money4-stat-card">
                <span>Found</span>
                <strong>{recordedCorrectKeys.size}</strong>
              </div>

              <div className="money4-stat-card">
                <span>Still to Find</span>
                <strong>{missedCombinations.length}</strong>
              </div>

              <div className="money4-stat-card">
                <span>Incorrect Attempts</span>
                <strong>
                  {attempts.filter(
                    (attempt) => !attempt.isCorrect
                  ).length}
                </strong>
              </div>
            </div>

            {/* TRY AGAIN MESSAGE */}
            {missedCombinations.length > 0 ? (
              <div className="money4-try-message">
                <span>🌟</span>

                <h3>Great effort! Can you find more ways?</h3>

                <p>
                  You have discovered {recordedCorrectKeys.size} combinations.
                  There are still {missedCombinations.length} more ways to find.
                  Try finding 3 or 4 more combinations!
                </p>

                <button
                  type="button"
                  className="money4-try-again-button"
                  onClick={tryAgain}
                >
                  🔄 Try Again
                </button>
              </div>
            ) : (
              <div className="money4-success-message">
                <span>🏆</span>

                <h3>
                  Amazing! You found every possible combination!
                </h3>

                <p>You are a smart shopper!</p>

                <button
                  type="button"
                  className="money4-try-again-button"
                  onClick={chooseAnotherItem}
                >
                  🛍️ Shop Another Item
                </button>
              </div>
            )}

            {/* SEPARATE BUTTON TO REVEAL MISSED COMBINATIONS */}
            {missedCombinations.length > 0 && (
              <div className="money4-reveal-section">

                <button
                  type="button"
                  className="money4-reveal-button"
                  onClick={() =>
                    setShowMissedCombinations((previous) => !previous)
                  }
                >
                  {showMissedCombinations
                    ? "Hide Missed Combinations ▲"
                    : "📋 Show Missed Combinations"}
                </button>

                {showMissedCombinations && (
                  <div className="money4-missed-list">
                    <h3>
                      Combinations You Have Not Found Yet
                    </h3>

                    <p>
                      Use this list to check the ways you missed.
                    </p>

                    {missedCombinations.map((combination, index) => (
                      <div
                        className="money4-missed-combination"
                        key={`${getCombinationKey(combination)}-${index}`}
                      >
                        <span>{index + 1}</span>
                        <strong>
                          {formatCombination(combination)}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* INCORRECT AND DUPLICATE COUNTS */}
            <div className="money4-analysis-extra">
              <span>Incorrect attempts: </span>

              <strong>
                {attempts.filter(
                  (attempt) => !attempt.isCorrect
                ).length}
              </strong>

              <span className="money4-extra-divider">|</span>

              <span>Duplicate attempts: </span>

              <strong>
                {attempts.filter(
                  (attempt) => attempt.isDuplicate
                ).length}
              </strong>
            </div>
          </section>
        )}

        {/* BACK TO MONEY LEVELS */}
        <div className="money4-bottom-actions">
          <button
            type="button"
            className="money4-back-button"
            onClick={onBack}
          >
            ← Back to Money Levels
          </button>
        </div>

      </main>
    </div>
  );
}

export default MoneyLevel4;
