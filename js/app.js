"use strict";
/* =========================================
   LESHANA-ED-SOURETH - CLEAN APP JS (FIXED)
========================================= */
console.log("JS chargé ✔");
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
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "true") {
    document.body.classList.add("light-mode");
  }
  loadProgress();
  initCanvas();
  initUIEffects();
});
/* =========================================
   MOBILE MENU
========================================= */
function toggleMenu() {
  const nav = document.querySelector("nav");
  if (nav) nav.classList.toggle("active");
}
/* =========================================
   AUDIO
========================================= */
function playAudio(src) {
  const audio = new Audio(src);
  audio.play();
}
/* =========================================
   PROGRESSION
========================================= */
let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;
function xpNeeded(level) {
  return level * 50;
}
function gainXP(amount) {
  xp += amount;
  const needed = xpNeeded(level);
  if (xp >= needed) {
    xp -= needed;
    level++;
    showLevelUp();
  }
  saveData();
  updateUI();
}
function showLevelUp() {
  alert("🔥 LEVEL UP ! Niveau " + level);
}
function saveData() {
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
}
function loadProgress() {
  const saved = localStorage.getItem("progress");
  if (saved) updateProgress(parseInt(saved));
}
function updateProgress(value) {
  const progress = document.querySelector(".progress");
  if (!progress) return;
  const finalValue = Math.min(value, 100);
  progress.style.width = finalValue + "%";
  localStorage.setItem("progress", finalValue);
}
function updateUI() {
  const xpEl = document.getElementById("xp-value");
  const levelEl = document.getElementById("level-value");
  if (xpEl) xpEl.textContent = xp;
  if (levelEl) levelEl.textContent = level;
}
/* =========================================
   QUIZ SIMPLE
========================================= */
function checkAnswer(answer) {
  const result = document.getElementById("quiz-result");
  if (!result) return;
  const correct = "ܐ";
  if (answer === correct) {
    gainXP(10);
    result.innerHTML = "✅ Bonne réponse ! +10 XP";
  } else {
    result.innerHTML = "❌ Mauvaise réponse";
  }
}
 = "rtl";
ctx.textAlign = "center";
  setLetter();
  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mouseleave", stopDraw);
  canvas.addEventListener("touchstart", startDraw, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  canvas.addEventListener("touchend", stopDraw);
}
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches?.[0] || e.changedTouches?.[0];
  return {
    x: (touch ? touch.clientX : e.clientX) - rect.left,
    y: (touch ? touch.clientY : e.clientY) - rect.top
  };
}
 =========================================
   LETTER SYSTEM
========================================= */
function setLetter() {
  const letter = letters[index];
  const display = document.getElementById("letterDisplay");
  const guide = document.getElementById("guideLetter");
  if (display) display.innerText = letter;
  if (guide) guide.innerText = letter;
  clearCanvas();
  drawing = false;
}
function nextLetter() {
  index = (index + 1) % letters.length;
  setLetter();
}
/* =========================================
   DARK MODE
========================================= */
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}
/* =========================================
   UI EFFECTS
========================================= */
function initUIEffects() {
  const buttons = document.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.05)";
    });
btn.addEventListener("mouseleave", () => {
  btn.style.transform = "scale(1)";
});

  });
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
  const rect = card.getBoundingClientRect();

  ripple.style.left = (e.clientX - rect.left) + "px";
  ripple.style.top = (e.clientY - rect.top) + "px";

  card.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
});

  });
}
/*

document.querySelectorAll(".card").forEach(card => {

  card.addEventListener("click", function(e){

    const ripple = document.createElement("span");

    ripple.classList.add("ripple");

    const rect = card.getBoundingClientRect();

    ripple.style.left =
      e.clientX - rect.left + "px";

    ripple.style.top =
      e.clientY - rect.top + "px";

    card.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);

  });

});

import { initQuiz } from "./quiz.js";
initQuiz();
 =========================================
   PROTECTION
========================================= */
document.addEventListener("click", () => {
  speechSynthesis.resume();
});