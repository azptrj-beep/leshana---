"use strict";

/* ============================================================
   ALPHABET SOURETH
============================================================ */
const letters = [
  "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ",
  "ܚ","ܛ","ܝ","ܟ","ܠ","ܡ","ܢ",
  "ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"
];

let alphabetIndex = 0;

/* ============================================================
   INIT (sécurisé pour toutes les pages)
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initUIEffects();

  // Exécuter alphabet + canvas UNIQUEMENT si les éléments existent
  if (document.getElementById("letterDisplay")) {
    updateAlphabet();
  }

  if (document.getElementById("writingCanvas")) {
    initWritingCanvas();
  }
});

/* ============================================================
   THEME
============================================================ */
function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light") document.body.classList.add("light-mode");
}

function toggleTheme() {
  document.body.classList.toggle("light-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-mode") ? "light" : "dark"
  );
}

window.toggleTheme = toggleTheme;

/* ============================================================
   MENU
============================================================ */
function initMenu() {
  window.toggleMenu = () => {
    const nav = document.querySelector("nav");
    if (nav) nav.classList.toggle("open");
  };
}

/* ============================================================
   ALPHABET SYSTEM (sécurisé)
============================================================ */
function updateAlphabet() {
  const display = document.getElementById("letterDisplay");
  const guide = document.getElementById("guideLetter");

  if (display) display.textContent = letters[alphabetIndex];
  if (guide) guide.textContent = letters[alphabetIndex];

  clearWritingCanvas();
}

function nextLetter() {
  alphabetIndex = (alphabetIndex + 1) % letters.length;
  updateAlphabet();
}

window.nextLetter = nextLetter;

/* ============================================================
   CLAVIER ACCUEIL (homeInput)
============================================================ */
function insertHomeLetter(letter) {
  const input = document.getElementById("homeInput");
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

function deleteHomeLetter() {
  const input = document.getElementById("homeInput");
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

window.insertHomeLetter = insertHomeLetter;
window.deleteHomeLetter = deleteHomeLetter;

/* ============================================================
   ÉCRITURE TACTILE (Canvas) — sécurisé
============================================================ */
let canvas, ctx, drawing = false;

function initWritingCanvas() {
  canvas = document.getElementById("writingCanvas");
  if (!canvas) return;

  ctx = canvas.getContext("2d");
  resizeWritingCanvas();

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mouseleave", stopDraw);

  canvas.addEventListener("touchstart", startDraw, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  canvas.addEventListener("touchend", stopDraw);
}

function resizeWritingCanvas() {
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
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#0033a0";
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function stopDraw() {
  drawing = false;
}

function clearWritingCanvas() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.clearWritingCanvas = clearWritingCanvas;

/* ============================================================
   UI EFFECTS
============================================================ */
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