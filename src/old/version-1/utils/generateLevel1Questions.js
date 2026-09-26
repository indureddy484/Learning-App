// Utility: Get random number between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility: Shuffle options safely with limit
function shuffleOptions(correct) {
  const options = new Set([correct]);
  let attempts = 0;
  while (options.size < 4 && attempts < 30) {
    options.add(getRandomInt(correct - 10, correct + 10));
    attempts++;
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
}

// ✅ 1. Addition/Subtraction (Vertical)
function generateAddSubQuestion() {
  const a = getRandomInt(10, 50);
  const b = getRandomInt(1, 20);
  const isAdd = Math.random() > 0.5;
  const op = isAdd ? "+" : "-";
  const question = `${a} ${op} ${b} = ?`;
  const answer = isAdd ? a + b : a - b;
  return {
    type: "addSub",
    question,
    options: shuffleOptions(answer),
    answer,
  };
}

// ✅ 2. Before / After
function generateBeforeAfterQuestion() {
  const base = getRandomInt(2, 29);
  const isBefore = Math.random() > 0.5;
  const question = isBefore
    ? `${base} mundu em number vastadi?`
    : `${base} tarvata em number vastadi?`;
  const answer = isBefore ? base - 1 : base + 1;
  return {
    type: "beforeAfter",
    question,
    options: shuffleOptions(answer),
    answer,
  };
}

// ✅ 3. Big / Small
function generateBigSmallQuestion() {
  const nums = [
    getRandomInt(1, 30),
    getRandomInt(1, 30),
    getRandomInt(1, 30),
  ];
  const type = Math.random() > 0.5 ? "big" : "small";
  const question = `Indulo ${type} number edi? ${nums.join(", ")}`;
  const answer = type === "big" ? Math.max(...nums) : Math.min(...nums);
  return {
    type: "bigSmall",
    question,
    options: shuffleOptions(answer),
    answer,
  };
}

// ✅ 4. Between Two Numbers
function generateBetweenQuestion() {
  const a = getRandomInt(1, 28);
  const b = a + 2;
  const mid = a + 1;
  const question = `${a} and ${b} madhyalo em number vastadi?`;
  return {
    type: "between",
    question,
    options: shuffleOptions(mid),
    answer: mid,
  };
}

// ✅ 5. Ascending Order
function generateAscendingOrderQuestion() {
  const nums = [
    getRandomInt(1, 30),
    getRandomInt(1, 30),
    getRandomInt(1, 30),
  ];
  const sorted = [...nums].sort((a, b) => a - b);
  const answer = sorted.join(", ");
  const question = `Ascending order lo arrange cheyyi: ${nums.join(", ")}`;

  const options = new Set([answer]);
  let attempts = 0;
  while (options.size < 4 && attempts < 30) {
    const shuffled = [...nums].sort(() => Math.random() - 0.5).join(", ");
    if (shuffled !== answer) options.add(shuffled);
    attempts++;
  }

  return {
    type: "ascending",
    question,
    options: Array.from(options).sort(() => Math.random() - 0.5),
    answer,
  };
}

// ✅ 6. Sequence Fill
function generateSequenceQuestion() {
  const start = getRandomInt(0, 25);
  const correctAnswer = `${start + 3}, ${start + 4}`;
  const options = new Set([correctAnswer]);
  let attempts = 0;
  while (options.size < 4 && attempts < 30) {
    const wrongStart = getRandomInt(0, 25);
    const option = `${wrongStart + 3}, ${wrongStart + 4}`;
    options.add(option);
    attempts++;
  }

  const question = `Number sequence fill cheyyi: ${start}, ${start + 1}, ${start + 2}, ___, ___`;
  return {
    type: "sequence",
    question,
    options: Array.from(options).sort(() => Math.random() - 0.5),
    answer: correctAnswer,
  };
}
//descending order 
function generateDescendingOrderQuestion() {
  const nums = [
    getRandomInt(1, 30),
    getRandomInt(1, 30),
    getRandomInt(1, 30),
  ];
  const sorted = [...nums].sort((a, b) => b - a);
  const answer = sorted.join(", ");
  const question = `Descending order lo arrange cheyyi: ${nums.join(", ")}`;

  const options = new Set([answer]);
  let attempts = 0;
  while (options.size < 4 && attempts < 30) {
    const shuffled = [...nums].sort(() => Math.random() - 0.5).join(", ");
    if (shuffled !== answer) options.add(shuffled);
    attempts++;
  }

  return {
    type: "descending",
    question,
    options: Array.from(options).sort(() => Math.random() - 0.5),
    answer,
  };
}

// ✅ Main generator
export function generateLevel1Questions(count = 10) {
  const generators = [
    generateAddSubQuestion,
    generateBeforeAfterQuestion,
    generateBigSmallQuestion,
    generateSequenceQuestion,
    generateBetweenQuestion,
    generateAscendingOrderQuestion,
    generateDescendingOrderQuestion,
  ];

  const questions = [];
  for (let i = 0; i < count; i++) {
    const gen = generators[i % generators.length];
    questions.push(gen());
  }

  return questions;
}
