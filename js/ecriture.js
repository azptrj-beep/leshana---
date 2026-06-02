"use strict";

const letters = [
"ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ",
"ܚ","ܛ","ܝ","ܟ","ܠ","ܡ","ܢ",
"ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"
];

let index = 0;

const canvas = document.getElementById("writingCanvas");
const ctx = canvas.getContext("2d");
const guideLetter = document.getElementById("guideLetter");

/* =========================
   CANVAS FIX MOBILE
========================= */
function resizeCanvas() {
  const size = 320;

  canvas.width = size;
  canvas.height = size;

  ctx.strokeStyle = "#0033a0";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
}

resizeCanvas();

/* =========================
   LETTRE GUIDE
========================= */
function updateLetter() {
  guideLetter.textContent = letters[index];
}

updateLetter();

/* =========================
   NAV LETTERS
========================= */
document.getElementById("nextLetter").onclick = () => {
  index = (index + 1) % letters.length;
  updateLetter();
  clearCanvas();
};

document.getElementById("prevLetter").onclick = () => {
  index = (index - 1 + letters.length) % letters.length;
  updateLetter();
  clearCanvas();
};

document.getElementById("clearCanvas").onclick = clearCanvas;

/* =========================
   CLEAR
========================= */
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* =========================
   POSITION FIX (IMPORTANT)
========================= */
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches ? e.touches[0] : e;

  return {
    x: (touch.clientX - rect.left) * (canvas.width / rect.width),
    y: (touch.clientY - rect.top) * (canvas.height / rect.height)
  };
}

/* =========================
   DRAW SYSTEM
========================= */
let drawing = false;

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

/* =========================
   EVENTS (MOUSE + TOUCH)
========================= */
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);

canvas.addEventListener("touchstart", startDraw, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDraw);