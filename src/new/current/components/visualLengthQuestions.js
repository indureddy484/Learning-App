const bigSmallQuestions = [
  {
    id: 1,
    prompt: "Which is bigger?",
    leftImage: "/visual-length/big-small/ball-big.png",
    rightImage: "/visual-length/big-small/ball-small.png",
    answer: "left",
  },
  {
    id: 2,
    prompt: "Which is smaller?",
    leftImage: "/visual-length/big-small/apple-big.png",
    rightImage: "/visual-length/big-small/apple-small.png",
    answer: "right",
  },
];

const longShortQuestions = [
  {
    id: 1,
    prompt: "Which is longer?",
    leftImage: "/visual-length/long-short/pencil-long.png",
    rightImage: "/visual-length/long-short/pencil-short.png",
    answer: "left",
  },
  {
    id: 2,
    prompt: "Which is shorter?",
    leftImage: "/visual-length/long-short/ruler-long.png",
    rightImage: "/visual-length/long-short/ruler-short.png",
    answer: "right",
  },
];

export {
  bigSmallQuestions,
  longShortQuestions,
};

export const visualLengthQuestionBank = {
  bigSmallQuestions,
  longShortQuestions,
};