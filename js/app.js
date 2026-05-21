"use strict";
/* =========================================
   LESHANA-ED-SOURETH - CLEAN APP JS
========================================= */

console.log("JS chargé ✔");

/* =========================================
   THEME (LIGHT / DARK SIMPLE)
========================================= */

function toggleTheme() {

  document.body.classList.toggle("light-mode");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-mode")
  );
}

window.addEventListener("DOMContentLoaded", () => {

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "true") {
    document.body.classList.add("light-mode");
  }

  loadProgress();
});

/* =========================================
   MOBILE MENU
========================================= */

function toggleMenu() {

  const nav = document.querySelector("nav");

  if (nav) {
    nav.classList.toggle("active");
  }
}

/* =========================================
   KEYBOARD SOURETH
========================================= */

function insertLetter(letter) {

  const editor = document.getElementById("editor");

  if (!editor) return;

  editor.value += letter;
  editor.focus();
}

/* =========================================
   AUDIO (OPTIONNEL)
========================================= */

function playAudio(src) {

  const audio = new Audio(src);
  audio.play();
}

/* 
 ===========================================
   QUIZ SYSTEM - XP + LEVELS
=========================================== */

let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;

/* TABLE DE PROGRESSION */
function xpNeeded(level) {
  return level * 50; // 50 XP puis 100 puis 150...
}

/* UPDATE DISPLAY (si tu ajoutes UI plus tard) */
function updateUI() {

  console.log("XP:", xp, "Level:", level);
}

/* CHECK ANSWER */
function checkAnswer(answer) {

  const result = document.getElementById("quiz-result");

  if (!result) return;

  const correct = "ܐ"; // réponse correcte

  if (answer === correct) {

    gainXP(10);

    result.innerHTML =
      "✅ Bonne réponse ! +10 XP";

  } else {

    result.innerHTML =
      "❌ Mauvaise réponse";
  }
}

/* GAIN XP */
function gainXP(amount) {

  xp += amount;

  const needed = xpNeeded(level);

  /* LEVEL UP */
  if (xp >= needed) {

    xp -= needed;
    level++;

    showLevelUp();
  }

  saveData();
  updateUI();
}

/* LEVEL UP EFFECT */
function showLevelUp() {

  alert("🔥 LEVEL UP ! Niveau " + level);
}

/* SAVE */
function saveData() {

  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
}

/* LOAD */
window.addEventListener("DOMContentLoaded", () => {

  xp = parseInt(localStorage.getItem("xp")) || 0;
  level = parseInt(localStorage.getItem("level")) || 1;

  updateUI();
});
  

/* =========================================
   PROGRESSION BAR
========================================= */

function updateProgress(value) {

  const progress = document.querySelector(".progress");

  if (!progress) return;

  const finalValue = Math.min(value, 100);

  progress.style.width = finalValue + "%";

  localStorage.setItem("progress", finalValue);
}

function loadProgress() {

  const saved = localStorage.getItem("progress");

  if (saved) {
    updateProgress(parseInt(saved));
  }
}

/* =========================================
   FADE IN ANIMATION
========================================= */

window.addEventListener("DOMContentLoaded", () => {

  const elements = document.querySelectorAll(".card, .progress-card");

  const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }

    });

  }, { threshold: 0.15 });

  elements.forEach((el) => observer.observe(el));
});

/* =========================================
   SMOOTH SCROLL
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener("click", function (e) {

    const target = document.querySelector(this.getAttribute("href"));

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: "smooth"
    });

  });

});

/* =========================================
   BUTTON EFFECTS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll("button");

  buttons.forEach(btn => {

    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.05)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
    });

  });

});


function updateUI() {

  const xpEl = document.getElementById("xp-value");
  const levelEl = document.getElementById("level-value");

  if (xpEl) xpEl.textContent = xp;
  if (levelEl) levelEl.textContent = level;
}

function learnWord(word) {

  let learned = JSON.parse(
    localStorage.getItem("learned")
  ) || [];

  if (!learned.includes(word)) {

    learned.push(word);

    localStorage.setItem(
      "learned",
      JSON.stringify(learned)
    );
  }
}


  
/* =========================================
   ECRITURE TACTILE SOURETH
========================================= */

const letters = ["ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ","ܚ","ܛ","ܝ","ܟ","ܠ","ܡ","ܢ","ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"];

let index = 0;

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let drawing = false;

function setLetter() {
  document.getElementById("letterDisplay").innerText = letters[index];
  document.getElementById("guideLetter").innerText = letters[index];
}

function getPos(e) {
  const rect = canvas.getBoundingClientRect();

  const touch = e.touches?.[0] || e.changedTouches?.[0];

  return {
    x: (touch ? touch.clientX : e.clientX) - rect.left,
    y: (touch ? touch.clientY : e.clientY) - rect.top
  };
}

function start(e) {
  drawing = true;
  const pos = getPos(e);

  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);

  e.preventDefault();
}

function draw(e) {
  if (!drawing) return;

  const pos = getPos(e);

  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#0033a0";

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);

  e.preventDefault();
}

function stop() {
  drawing = false;
}

canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stop);
canvas.addEventListener("mouseleave", stop);

canvas.addEventListener("touchstart", start, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stop);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function nextLetter() {
  index = (index + 1) % letters.length;
  setLetter();
  clearCanvas();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

document.addEventListener("click", () => {
  speechSynthesis.resume();
});


function resizeCanvas() {
  const size = Math.min(window.innerWidth * 0.85, window.innerHeight * 0.65);

  canvas.width = size;
  canvas.height = size;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

setLetter();
  
if (window.location.pathname.includes("ecriture")) {
  document.body.classList.add("ecriture-page");
}

let currentIndex = 0;

function loadQuestion() {
  const q = quizData[currentIndex];

  if (q.type === "letter") {
    document.getElementById("question").textContent = q.value;
  }

  if (q.type === "image") {
    document.getElementById("question").innerHTML =
      `<img src="${q.src}" style="max-width:200px;">`;
  }

  if (q.type === "audio") {
    document.getElementById("question").innerHTML =
      `<button onclick="playAudio('${q.src}')">🔊 Play</button>`;
  }
}
 document.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("question")) {

    renderQuestion();

    updateXPUI();
  }

});