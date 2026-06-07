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

const qEl = document.getElementById("question");
const aEl = document.getElementById("answers");
const fEl = document.getElementById("feedback");
const xpEl = document.getElementById("xp");
const pEl = document.getElementById("progress");

function loadQuestion() {
  const q = questions[index];

  qEl.textContent = q.q;
  aEl.innerHTML = "";
  fEl.textContent = "";

  pEl.textContent = `${index + 1} / ${questions.length}`;

  q.a.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = text;

    btn.onclick = () => checkAnswer(i);
    aEl.appendChild(btn);
  });
}

function checkAnswer(i) {
  const q = questions[index];

  if (i === q.correct) {
    xp += 10;
    fEl.textContent = "✔ Correct !";
  } else {
    fEl.textContent = "✘ Faux";
  }

  xpEl.textContent = "XP: " + xp;

  setTimeout(() => {
    index++;

    if (index < questions.length) {
      loadQuestion();
    } else {
      qEl.textContent = "🎉 Fin du quiz";
      aEl.innerHTML = "";
      pEl.textContent = `${questions.length} / ${questions.length}`;
    }
  }, 700);
}

loadQuestion();