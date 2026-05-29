"use strict";

/* =========================
   LETTRES SOURETH
========================= */
const letters = [
  "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ",
  "ܚ","ܛ","ܝ","ܟ","ܠ","ܡ","ܢ",
  "ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"
];

let index = 0;

/* =========================
   CANVAS
========================= */
let canvas, ctx;
let drawing = false;

/* =========================
   INIT
========================= */
window.addEventListener("DOMContentLoaded", () => {
  initCanvas();
  setLetter();
});

/* =========================
   LETTRES
========================= */
function setLetter() {
  const display = document.getElementById("letterDisplay");
  const guide = document.getElementById("guideLetter");

  if (display) display.textContent = letters[index];
  if (guide) guide.textContent = letters[index];

  clearCanvas();
}

function nextLetter() {
  index = (index + 1) % letters.length;
  setLetter();
}

/* =========================
   CANVAS INIT (STABLE)
========================= */
function initCanvas() {
  canvas = document.getElementById("drawCanvas");
  if (!canvas) return;

  ctx = canvas.getContext("2d");

  resizeCanvas();

  window.addEventListener("resize", resizeCanvas);

  canvas.addEventListener("pointerdown", startDraw);
  canvas.addEventListener("pointermove", draw);
  canvas.addEventListener("pointerup", stopDraw);
  canvas.addEventListener("pointerleave", stopDraw);
}

/* =========================
   RESIZE
========================= */
function resizeCanvas() {
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

/* =========================
   POSITION
========================= */
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const t = e.touches?.[0] || e;

  return {
    x: t.clientX - rect.left,
    y: t.clientY - rect.top
  };
}

/* =========================
   DRAW
========================= */
function startDraw(e) {
  drawing = true;
  const p = getPos(e);

  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
}

function draw(e) {
  if (!drawing) return;

  const p = getPos(e);

  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#0033a0";

  ctx.lineTo(p.x, p.y);
  ctx.stroke();

  e.preventDefault();
}

function stopDraw() {
  drawing = false;
}

/* =========================
   CLEAR
========================= */
function clearCanvas() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* =========================
   EXPORT GLOBAL
========================= */
window.nextLetter = nextLetter;
window.clearCanvas = clearCanvas;