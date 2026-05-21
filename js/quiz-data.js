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

let currentIndex = 0;
let score = 0;

function getCurrentQuestion() {
  return quizData[currentIndex];
}

function checkAnswer(userAnswer) {
  const q = getCurrentQuestion();

  if (userAnswer === q.answer) {
    score++;
    nextQuestion(true);
  } else {
    nextQuestion(false);
  }
}

function nextQuestion(correct) {
  currentIndex++;

  if (currentIndex >= quizData.length) {
    endQuiz();
  } else {
    renderQuestion(correct);
  }
}

function endQuiz() {
  document.getElementById("question").innerHTML =
    `🎉 Fin du quiz<br>Score: ${score}/${quizData.length}`;
}

const quizData = [

  {
    category: "letters",
    type: "letter",
    question: "ܐ",
    answer: "Alap",
    difficulty: 1
  },

  {
    category: "letters",
    type: "letter",
    question: "ܒ",
    answer: "Beth",
    difficulty: 1
  },

  {
    category: "audio",
    type: "audio",
    src: "assets/audio/shlama.mp3",
    answer: "Shlama",
    difficulty: 2
  },

  {
    category: "image",
    type: "image",
    src: "assets/images/apple.png",
    answer: "Apple",
    difficulty: 1
  }
];