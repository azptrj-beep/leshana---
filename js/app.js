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
   LETTER SYSTEM
========================================= */
function setLetter() {
  const display = document.getElementById("letterDisplay");
  const guide = document.getElementById("guideLetter");

  if (display) display.textContent = letters[index];
  if (guide) guide.textContent = letters[index];

  clearCanvas();
  drawing = false;
}

function nextLetter() {
  index = (index + 1) % letters.length;
  setLetter();
}

/* =========================================
   CANVAS (FIX STABLE)
========================================= */
function initCanvas() {
  canvas = document.getElementById("board");
  if (!canvas) return;

  ctx = canvas.getContext("2d");

  resizeCanvas();

  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#0033a0";

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mouseleave", stopDraw);

  canvas.addEventListener("touchstart", startDraw, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  canvas.addEventListener("touchend", stopDraw);
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const t = e.touches?.[0] || e.changedTouches?.[0];

  return {
    x: (t ? t.clientX : e.clientX) - rect.left,
    y: (t ? t.clientY : e.clientY) - rect.top
  };
}

function startDraw(e) {
  drawing = true;
  const pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!drawing) return;
  e.preventDefault();

  const pos = getPos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function stopDraw() {
  drawing = false;
}

function clearCanvas() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function toggleMenu() {
  document.querySelector("nav").classList.toggle("active");
}

/* =========================
   MENU MODERNE SLIDE-IN
========================= */
function toggleMenu() {
  const nav = document.querySelector("nav");
  nav.classList.toggle("active");
}

/* =========================
   MODE CLAIR / SOMBRE
========================= */
function toggleTheme() {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
}

// Charger le thème au démarrage
(function () {
  const saved = localStorage.getItem("theme");
  if (saved === "light") document.body.classList.add("light-mode");
})();

/* =========================
   AUDIO PLAYER
========================= */
function playAudio(file) {
  const audio = new Audio(file);
  audio.play();
}

/* =========================
   CLAVIER SOURETH
========================= */
function insertLetter(letter) {
  const input = document.getElementById("input");
  if (!input) return;

  const start = input.selectionStart;
  const end = input.selectionEnd;

  input.value =
    input.value.substring(0, start) +
    letter +
    input.value.substring(end);

  input.focus();
  input.selectionStart = input.selectionEnd = start + 1;
}

function deleteLetter() {
  const input = document.getElementById("input");
  if (!input) return;

  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (start === end && start > 0) {
    input.value =
      input.value.substring(0, start - 1) +
      input.value.substring(end);
    input.selectionStart = input.selectionEnd = start - 1;
  } else {
    input.value =
      input.value.substring(0, start) +
      input.value.substring(end);
    input.selectionStart = input.selectionEnd = start;
  }
}

/* =========================
   ÉCRITURE TACTILE
========================= */
let canvas, ctx, drawing = false;

function initWritingCanvas() {
  canvas = document.getElementById("writingCanvas");
  if (!canvas) return;

  ctx = canvas.getContext("2d");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mouseleave", stopDraw);

  canvas.addEventListener("touchstart", startDraw);
  canvas.addEventListener("touchmove", draw);
  canvas.addEventListener("touchend", stopDraw);
}

function startDraw(e) {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(getX(e), getY(e));
}

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#ffffff";
  ctx.lineTo(getX(e), getY(e));
  ctx.stroke();
}

function stopDraw() {
  drawing = false;
}

function getX(e) {
  return (e.touches ? e.touches[0].clientX : e.clientX) - canvas.getBoundingClientRect().left;
}

function getY(e) {
  return (e.touches ? e.touches[0].clientY : e.clientY) - canvas.getBoundingClientRect().top;
}

function clearCanvas() {
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* =========================
   SERVICE WORKER
========================= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(() => console.log("SW enregistré ✔"))
      .catch(err => console.log("Erreur SW :", err));
  });
}

/* =========================
   INITIALISATION GLOBALE
========================= */
document.addEventListener("DOMContentLoaded", () => {
  initWritingCanvas();
});