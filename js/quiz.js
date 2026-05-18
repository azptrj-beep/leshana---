
"use strict";

document.addEventListener("DOMContentLoaded", () => {

  console.log("🟢 Quiz JS chargé");

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

  if (!quizLetter || !quizAnswers || !scoreEl || !xpEl) {
    console.error("❌ DOM manquant");
    return;
  }

  function loadQuestion() {

    const current =
      letters[Math.floor(Math.random() * letters.length)];

    quizLetter.textContent = current.letter;

    quizAnswers.innerHTML = "";

    const shuffled =
      [...letters].sort(() => Math.random() - 0.5);

    shuffled.forEach(item => {

      const btn = document.createElement("button");

      // 🔥 sécurité anti-submit + anti-navigation
      btn.type = "button";
      btn.setAttribute("type", "button");

      btn.textContent = item.answer;
      btn.className = "quiz-btn";

      btn.style.display = "block";
      btn.style.margin = "10px auto";
      btn.style.padding = "12px 20px";
      btn.style.borderRadius = "10px";
      btn.style.border = "none";
      btn.style.cursor = "pointer";

      btn.addEventListener("click", (e) => {

        e.preventDefault(); // 🔥 bloque toute action formulaire

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

document.addEventListener("click", (e) => {

  console.log("🔥 CLICK SUR :", e.target);
  console.log("TAG :", e.target.tagName);
  console.log("CLASS :", e.target.className);
  console.log("ID :", e.target.id);

});