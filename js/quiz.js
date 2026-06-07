const questions = [
  {
    q: "ܐ = ?",
    a: ["A", "B", "G", "D"],
    correct: 0
  },
  {
    q: "ܒ = ?",
    a: ["R", "B", "S", "T"],
    correct: 1
  },
  {
    q: "ܓ = ?",
    a: ["G", "K", "M", "N"],
    correct: 0
  }
];

let index = 0;
let xp = 0;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const xpEl = document.getElementById("xp");
const progressEl = document.getElementById("progress");

function loadQuestion() {
  const q = questions[index];

  questionEl.textContent = q.q;
  answersEl.innerHTML = "";
  feedbackEl.textContent = "";

  q.a.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = ans;

    btn.onclick = () => checkAnswer(i);
    answersEl.appendChild(btn);
  });

  progressEl.textContent = `${index + 1} / ${questions.length}`;
}

function checkAnswer(i) {
  if (i === questions[index].correct) {
    xp += 10;
    feedbackEl.textContent = "✔ Correct !";
  } else {
    feedbackEl.textContent = "✘ Faux";
  }

  xpEl.textContent = "XP: " + xp;

  setTimeout(() => {
    index++;
    if (index < questions.length) {
      loadQuestion();
    } else {
      questionEl.textContent = "Fin du quiz 🎉";
      answersEl.innerHTML = "";
    }
  }, 800);
}

loadQuestion();