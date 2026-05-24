"use strict";

const letters = [
  "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ",
  "ܚ","ܛ","ܝ","ܟ","ܠ","ܡ","ܢ",
  "ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"
];

let index = 0;

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let drawing = false;

/* =========================
   SIZE CANVAS FIX MOBILE
========================= */

function resizeCanvas() {
  const size = Math.min(window.innerWidth * 0.85, 420);
  canvas.width = size;
  canvas.height = size;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* =========================
   LETTERS
========================= */

function setLetter() {
  document.getElementById("letterDisplay").textContent = letters[index];
  document.getElementById("guideLetter").textContent = letters[index];
}

/* =========================
   POSITION UNIVERSAL
========================= */

function getPos(e) {
  const rect = canvas.getBoundingClientRect();

  const touch = e.touches?.[0] || e.changedTouches?.[0];

  return {
    x: (touch ? touch.clientX : e.clientX) - rect.left,
    y: (touch ? touch.clientY : e.clientY) - rect.top
  };
}

/* =========================
   DRAW START
========================= */

function start(e) {
  drawing = true;
  const pos = getPos(e);

  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);

  e.preventDefault();
}

/* =========================
   DRAW
========================= */

function draw(e) {
  if (!drawing) return;

  const pos = getPos(e);

  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle =
    document.body.classList.contains("dark")
      ? "white"
      : "#0033a0";

  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);

  e.preventDefault();
}

/* =========================
   STOP
========================= */

function stop() {
  drawing = false;
  ctx.beginPath();
}

/* =========================
   EVENTS
========================= */

canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stop);
canvas.addEventListener("mouseleave", stop);

canvas.addEventListener("touchstart", start, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stop);

/* =========================
   ACTIONS
========================= */

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function nextLetter() {
  index = (index + 1) % letters.length;
  setLetter();
  clearCanvas();
}

function toggleDark() {
  document.body.classList.toggle("dark");
}

/* INIT */
setLetter();