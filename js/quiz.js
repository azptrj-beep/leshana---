"use strict";

document.addEventListener("DOMContentLoaded", () => {

  console.log("🟢 Quiz chargé");

  const letters = [
    { letter: "ܐ", answer: "Alap" },
    { letter: "ܒ", answer: "Beith" },
    { letter: "ܓ", answer: "Gamal" },
    { letter: "ܕ", answer: "Dalath" }
  ];

  const quizLetter = document.getElementById("quiz-letter");
  const quizAnswers = document.getElementById("quiz-answers");
  const scoreEl = document.getElementById("score");
  const xpEl = document.getElementById("xp");

  let score = 0;
  let xp = 0;
  let current = null;

  if (!quizLetter || !quizAnswers || !scoreEl || !xpEl) {
    console.error("❌ éléments DOM manquants");
    return;
  }

  function loadQuestion() {

    current = letters[Math.floor(Math.random() * letters.length)];

    quizLetter.textContent = current.letter;
    quizLetter.style.fontFamily = "'Adiabene', sans-serif";

    quizAnswers.innerHTML = "";

    const shuffled = [...letters].sort(() => Math.random() - 0.5);

    shuffled.forEach(item => {

      const btn = document.createElement("button");

      btn.type = "button";
      btn.className = "quiz-btn";
      btn.textContent = item.answer;

      btn.addEventListener("click", (e) => {

        e.preventDefault();

        if (item.answer === current.answer) {
          score++;
          xp += 10;
          alert("✅ Bonne réponse");
        } else {
          alert("❌ Mauvaise réponse");
        }

        scoreEl.textContent = score;
        xpEl.textContent = xp;

        loadQuestion();
      });

      quizAnswers.appendChild(btn);
    });
  }

  loadQuestion();
});