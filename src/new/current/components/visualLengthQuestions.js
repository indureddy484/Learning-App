
/* =========================================================
   VISUAL LENGTH LEVEL 1 - QUESTION BANK
   Original 2-picture questions + New 4-picture questions
========================================================= */

const bigSmallItems = [
  "ball",
  "apple",
  "house",
  "car",
  "tree",
  "bridge",
  "elephant",
  "dog",
  "lamp",
  "jar",
  "bicycle",
  "moon",
  "flower",
  "tiger",
  "backpack",
  "pot",
  "carrot",
  "bottle",
  "book",
  "chair",
  "table",
  "cup",
  "fish",
  "bird",
  "bus",
];

const longShortItems = [
  "pencil",
  "ruler",
  "ribbon",
  "toothbrush",
  "crayon",
  "wire",
  "spoon",
  "paper",
  "paintbrush",
  "key",
  "umbrella",
  "rope",
  "stick",
  "string",
  "train",
  "road",
  "river",
  "hose",
  "belt",
  "cable",
  "ladder",
  "broom",
  "necklace",
  "scarf",
];

/* =========================================================
   ORIGINAL TWO-PICTURE QUESTION GENERATOR
========================================================= */

function makeQuestion(
  item,
  index,
  category,
  prompt,
  correctImage,
  incorrectImage
) {
  const correctOnLeft = Math.random() < 0.5;

  return {
    id: `${category}-${String(index + 1).padStart(3, "0")}`,
    prompt,
    leftImage: correctOnLeft ? correctImage : incorrectImage,
    rightImage: correctOnLeft ? incorrectImage : correctImage,
    answer: correctOnLeft ? "left" : "right",
  };
}

/* =========================================================
   ORIGINAL BIG / SMALL QUESTIONS
========================================================= */

const originalBigSmallQuestions = bigSmallItems.map((item, index) => {
  const askBigger = index % 2 === 0;

  return makeQuestion(
    item,
    index,
    "bs",
    askBigger ? "Which is bigger?" : "Which is smaller?",
    askBigger
      ? `/visual-length/big-small/${item}-big.png`
      : `/visual-length/big-small/${item}-small.png`,
    askBigger
      ? `/visual-length/big-small/${item}-small.png`
      : `/visual-length/big-small/${item}-big.png`
  );
});

/* =========================================================
   ORIGINAL LONG / SHORT QUESTIONS
========================================================= */

const originalLongShortQuestions = longShortItems.map((item, index) => {
  const askLonger = index % 2 === 0;

  return makeQuestion(
    item,
    index,
    "ls",
    askLonger ? "Which is longer?" : "Which is shorter?",
    askLonger
      ? `/visual-length/long-short/${item}-long.png`
      : `/visual-length/long-short/${item}-short.png`,
    askLonger
      ? `/visual-length/long-short/${item}-short.png`
      : `/visual-length/long-short/${item}-long.png`
  );
});

/* =========================================================
   FOUR-PICTURE QUESTION GENERATOR

   Four pictures of the same object are shown at
   different sizes or lengths.

   Big / Small:
   Uses scale to change the overall size.

   Long / Short:
   Uses scaleX to change the length.
========================================================= */

function makeFourPictureQuestion(item, index, category, comparison) {
  const scales = [0.55, 0.80, 1.05, 1.30];

  const letters = ["A", "B", "C", "D"];

  const image =
    comparison === "size"
      ? `/visual-length/big-small/${item}-big.png`
      : `/visual-length/long-short/${item}-long.png`;

  let options = scales.map((scale, optionIndex) => ({
    id: letters[optionIndex],
    label: letters[optionIndex],
    image,
    scale,
    value: scale,
  }));

  // Ask biggest / longest or smallest / shortest.
  const askLargest = index % 2 === 0;

  // Shuffle the options.
  options = [...options].sort(() => Math.random() - 0.5);

  // Find the correct answer using the scale value.
  const correctOption = askLargest
    ? options.reduce((best, option) =>
        option.value > best.value ? option : best
      )
    : options.reduce((best, option) =>
        option.value < best.value ? option : best
      );

  let prompt;

  if (comparison === "size") {
    prompt = askLargest
      ? `Which ${item} is the biggest?`
      : `Which ${item} is the smallest?`;
  } else {
    prompt = askLargest
      ? `Which ${item} is the longest?`
      : `Which ${item} is the shortest?`;
  }

  return {
    id: `${category}-four-${String(index + 1).padStart(3, "0")}`,
    prompt,
    questionType: "four-picture",
    comparison,
    options,
    answer: correctOption.id,
  };
}

/* =========================================================
   FOUR-PICTURE BIG / SMALL QUESTIONS
========================================================= */

const fourPictureBigSmallQuestions = bigSmallItems.map((item, index) => {
  return makeFourPictureQuestion(
    item,
    index,
    "bs",
    "size"
  );
});

/* =========================================================
   FOUR-PICTURE LONG / SHORT QUESTIONS
========================================================= */

const fourPictureLongShortQuestions = longShortItems.map((item, index) => {
  return makeFourPictureQuestion(
    item,
    index,
    "ls",
    "length"
  );
});

/* =========================================================
   MIX ORIGINAL + FOUR-PICTURE QUESTIONS
========================================================= */

export const bigSmallQuestions = [
  ...originalBigSmallQuestions,
  ...fourPictureBigSmallQuestions,
];

export const longShortQuestions = [
  ...originalLongShortQuestions,
  ...fourPictureLongShortQuestions,
];

/* =========================================================
   QUESTION BANK EXPORT
========================================================= */

export const visualLengthQuestionBank = {
  bigSmallQuestions,
  longShortQuestions,
};
