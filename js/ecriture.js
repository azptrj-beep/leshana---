const letters = [
"ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ",
"ܚ","ܛ","ܝ","ܟ","ܠ","ܡ","ܢ",
"ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"
];

let current = 0;

const guideLetter = document.getElementById("guideLetter");
const canvas = document.getElementById("writingCanvas");
const ctx = canvas.getContext("2d");

function updateLetter() {
  guideLetter.textContent = letters[current];
}

document.getElementById("nextLetter").addEventListener("click", () => {
  current = (current + 1) % letters.length;
  updateLetter();
  clearCanvas();
});

document.getElementById("prevLetter").addEventListener("click", () => {
  current = (current - 1 + letters.length) % letters.length;
  updateLetter();
  clearCanvas();
});

document.getElementById("clearCanvas").addEventListener("click", clearCanvas);

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// DRAW
let drawing = false;

function pos(e) {
  const rect = canvas.getBoundingClientRect();
  const t = e.touches ? e.touches[0] : e;

  return {
    x: t.clientX - rect.left,
    y: t.clientY - rect.top
  };
}

function start(e) {
  drawing = true;
  const p = pos(e);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
}

function move(e) {
  if (!drawing) return;
  e.preventDefault();

  const p = pos(e);
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#0033a0";

  ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

function end() {
  drawing = false;
}

canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", move);
canvas.addEventListener("mouseup", end);

canvas.addEventListener("touchstart", start, { passive: false });
canvas.addEventListener("touchmove", move, { passive: false });
canvas.addEventListener("touchend", end);

updateLetter();