"use strict";

console.log("QUIZ JS CHARGÉ ✔");

document.addEventListener("DOMContentLoaded", () => {

  console.log("🟢 Quiz chargé");

  const quizzes = {
    alphabet: [
      { question: "ܐ", answers: ["Alap", "Beth", "Gamal", "Dalath"], correct: "Alap" },
      { question: "ܒ", answers: ["Alap", "Beth", "Gamal", "Dalath"], correct: "Beth" },
      { question: "ܓ", answers: ["Alap", "Beth", "Gamal", "Dalath"], correct: "Gamal" },
      { question: "ܕ", answers: ["Alap", "Beth", "Gamal", "Dalath"], correct: "Dalath" }
    ],

    vocabulaire: [
      { question: "ܫܠܡܐ signifie ?", answers: ["Bonjour", "Merci", "Maison", "Livre"], correct: "Bonjour" },
      { question: "ܒܝܬܐ signifie ?", answers: ["Maison", "Eau", "Feu", "Main"], correct: "Maison" }
    ],

    soureth: [
      { question: "ܐ", answers: ["Alap", "Beth", "Gamal", "Dalath"], correct: "Alap" },
      { question: "ܒ", answers: ["Alap", "Beth", "Gamal", "Dalath"], correct: "Beth" },
      { question: "ܓ", answers: ["Alap", "Beth", "Gamal", "Dalath"], correct: "Gamal" },
      { question: "ܕ", answers: ["Alap", "Beth", "Gamal", "Dalath"], correct: "Dalath" }
    ]
  };

  const quizLetter = document.getElementById("quiz-letter");
  const quizAnswers = document.getElementById("quiz-answers");
  const scoreEl = document.getElementById("score");
  const xpEl = document.getElementById("xp");
  const quizSelect = document.getElementById("quiz-select");

  let score = 0;
  let xp = 0;
  let currentQuiz = "alphabet";
  let current = null;

  function getData() {
    return quizzes[currentQuiz];
  }

  function loadQuestion() {

    const data = getData();

    current = data[Math.floor(Math.random() * data.length)];

    quizLetter.textContent = current.question;

    // gestion style Soureth
    if (currentQuiz === "soureth") {
      quizLetter.classList.add("soureth-mode");
    } else {
      quizLetter.classList.remove("soureth-mode");
    }

    quizAnswers.innerHTML = "";

    const shuffled = [...current.answers].sort(() => Math.random() - 0.5);

    shuffled.forEach(answer => {

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-btn";
      btn.textContent = answer;

      btn.addEventListener("click", () => {

        if (answer === current.correct) {
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

  quizSelect.addEventListener("change", (e) => {
    currentQuiz = e.target.value;
    loadQuestion();
  });

  loadQuestion();
});