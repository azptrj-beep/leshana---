"use strict";

console.log("QUIZ LEVEL SYSTEM ✔");

document.addEventListener("DOMContentLoaded", () => {

  const quizLetter = document.getElementById("question");
  const quizAnswers = document.querySelector(".quiz-options");
  const result = document.getElementById("quiz-result");
  const xpEl = document.getElementById("xp-value");

  let xp = 0;
  let level = 1;
  let streak = 0;
  let current = null;

  const levels = {
    1: "🟢 Facile",
    2: "🟡 Moyen",
    3: "🔴 Expert"
  };

  const quizzes = {
    easy: [
      { q: "ܐ", a: "Alap", o: ["Alap", "Beth", "Gamal", "Dalath"] },
      { q: "ܒ", a: "Beth", o: ["Alap", "Beth", "Gamal", "Dalath"] },
      { q: "ܓ", a: "Gamal", o: ["Alap", "Beth", "Gamal", "Dalath"] }
    ],

    medium: [
      { q: "ܕ", a: "Dalath", o: ["Alap", "Beth", "Gamal", "Dalath"] },
      { q: "ܗ", a: "Heh", o: ["Heh", "Waw", "Yodh", "Kaph"] },
      { q: "ܘ", a: "Waw", o: ["Heh", "Waw", "Yodh", "Kaph"] }
    ],

    hard: [
      { q: "ܫܠܡܐ", a: "Shlama", o: ["Shlama", "Bayta", "Nura", "Maya"] },
      { q: "ܒܝܬܐ", a: "Bayta", o: ["Shlama", "Bayta", "Nura", "Maya"] },
      { q: "ܡܝܐ", a: "Maya", o: ["Shlama", "Bayta", "Nura", "Maya"] }
    ]
  };

  function getLevel() {

    if (xp < 50) return 1;
    if (xp < 120) return 2;
    return 3;
  }

  function getPool() {

    const lvl = getLevel();

    if (lvl === 1) return quizzes.easy;
    if (lvl === 2) return quizzes.medium;
    return quizzes.hard;
  }

  function loadQuestion() {

    level = getLevel();

    const pool = getPool();

    current = pool[Math.floor(Math.random() * pool.length)];

    quizLetter.textContent = current.q;

    quizAnswers.innerHTML = "";

    const shuffled = [...current.o].sort(() => Math.random() - 0.5);

    shuffled.forEach(opt => {

      const btn = document.createElement("button");
      btn.textContent = opt;

      btn.addEventListener("click", () => {

        if (opt === current.a) {

          xp += 10;
          streak++;

          result.textContent = "✔ Bonne réponse";

        } else {

          xp = Math.max(0, xp - 5);
          streak = 0;

          result.textContent = "✖ Mauvaise réponse";
        }

        xpEl.textContent = xp;

        setTimeout(loadQuestion, 600);
      });

      quizAnswers.appendChild(btn);
    });

    result.textContent = levels[level];
  }

  loadQuestion();
});