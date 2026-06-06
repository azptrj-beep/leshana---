"use strict";

/* =========================================
   STATE GLOBAL
========================================= */
let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;

let index = 0;

/* Alphabet Soureth */
const letters = [
  "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ",
  "ܚ","ܛ","ܝ","ܟ","ܠ","ܡ","ܢ",
  "ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"
];

/* Canvas */
let canvas, ctx, drawing = false;

/* =========================================
   INIT
========================================= */
window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadProgress();
  updateUI();
  initCanvas();
  initUIEffects();
  setLetter();
});

document.addEventListener("touchstart", () => {
  document.body.focus();
}, { once: true });

/* =========================================
   THEME
========================================= */
function toggleTheme() {
  document.body.classList.toggle("light-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-mode")
  );
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "true") {
    document.body.classList.add("light-mode");
  }
}

/* =========================================
   MENU
========================================= */
function toggleMenu() {
  const nav = document.querySelector("nav");
  if (nav) nav.classList.toggle("active");
}

/* =========================================
   AUDIO
========================================= */
function playAudio(src) {
  new Audio(src).play();
}

/* =========================================
   XP SYSTEM
========================================= */
function xpNeeded(lvl) {
  return lvl * 50;
}

function gainXP(amount) {
  xp += amount;

  if (xp >= xpNeeded(level)) {
    xp -= xpNeeded(level);
    level++;
    alert("🔥 LEVEL UP ! Niveau " + level);
  }

  saveProgress();
  updateUI();
}

/* =========================================
   PROGRESS
========================================= */
function saveProgress() {
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
}

function loadProgress() {
  updateUI();
}

function updateUI() {
  const xpEl = document.getElementById("xp-value");
  const levelEl = document.getElementById("level-value");

  if (xpEl) xpEl.textContent = xp;
  if (levelEl) levelEl.textContent = level;
}

/* =========================================
   QUIZ
========================================= */
function checkAnswer(answer) {
  const result = document.getElementById("quiz-result");
  if (!result) return;

  const correct = "ܐ";

  if (answer === correct) {
    gainXP(10);
    result.textContent = "✅ Bonne réponse +10 XP";
  } else {
    result.textContent = "❌ Mauvaise réponse";
  }
}


/* =========================================
   UI EFFECTS
========================================= */
function initUIEffects() {
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      ripple.className = "ripple";

      const rect = card.getBoundingClientRect();

      ripple.style.left = (e.clientX - rect.left) + "px";
      ripple.style.top = (e.clientY - rect.top) + "px";

      card.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.05)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
    });
  });
}

/* =========================================
   GLOBAL EXPORTS
========================================= */
window.toggleTheme = toggleTheme;
window.toggleMenu = toggleMenu;
window.playAudio = playAudio;
window.checkAnswer = checkAnswer;
window.nextLetter = nextLetter;

document.addEventListener("keydown", (e) => {
  handleKey(e.key);
});

function handleKey(key) {
  console.log("Key pressed:", key);

  // Exemple : alphabet Soureth
  if (letters.includes(key)) {
    selectLetter(key);
  }

  if (key === "Backspace") {
    clearCanvas();
  }

  if (key === "Enter") {
    nextLetter();
  }
}

function pressKey(key) {
  handleKey(key);
}

const input = document.getElementById("sourethInput");