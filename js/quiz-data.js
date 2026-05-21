const quizData = [
  { type: "image", src: "assets/images/apple.png", answer: "apple" },
  { type: "audio", src: "assets/audio/word.mp3", answer: "word" },
  { type: "letter", value: "ܐ", answer: "Alap" }
];

fetch("js/quiz-data.json")
  .then(res => res.json())
  .then(data => {
    quizData = data;
    loadQuestion();
  });