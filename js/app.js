"use strict";

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS OK ✔");

  initTheme();
  initMenu();
  initProgress();
  initEffects();
});

/* =========================
   MENU MOBILE
========================= */

function initMenu() {
  const btn = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

/* =========================
   THEME
========================= */

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

/* =========================
   AUDIO
========================= */

function playAudio(src) {
  new Audio(src).play();
}

/* =========================
   PROGRESSION
========================= */

let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;

function gainXP(val) {
  xp += val;

  if (xp >= level * 50) {
    xp -= level * 50;
    level++;
    alert("Level Up !");
  }

  save();
  updateUI();
}

function save() {
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
}

function initProgress() {
  updateUI();
}

function updateUI() {
  const xpEl = document.getElementById("xp-value");
  const levelEl = document.getElementById("level-value");

  if (xpEl) xpEl.textContent = xp;
  if (levelEl) levelEl.textContent = level;
}

/* =========================
   QUIZ
========================= */

function checkAnswer(ans) {
  const res = document.getElementById("quiz-result");
  if (!res) return;

  if (ans === "ܐ") {
    gainXP(10);
    res.textContent = "Bonne réponse";
  } else {
    res.textContent = "Mauvaise réponse";
  }
}

/* =========================
   CANVAS SAFE (IMPORTANT)
========================= */

function initCanvas() {
  const canvas = document.getElementById("draw");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let drawing = false;

  canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });

  canvas.addEventListener("pointerup", () => {
    drawing = false;
  });
}

/* =========================
   EFFECTS SAFE
========================= */

function initEffects() {
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      card.style.transform = "scale(1.02)";
      setTimeout(() => card.style.transform = "", 150);
    });
  });
}

"use strict";

import { initTheme } from "./theme.js";
import { initMenu } from "./menu.js";
import { initState } from "./state.js";
import { initUI } from "./ui.js";
import { initRouter } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  initState();
  initTheme();
  initMenu();
  initUI();
  initRouter();

  console.log("🚀 App PRO chargée");
});