const letters = [
  "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ",
  "ܚ","ܛ","ܝ","ܟ","ܠ","ܡ","ܢ",
  "ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"
];

let current = 0;

/* =========================
   ELEMENTS
========================= */

const canvas = document.getElementById("writingCanvas");
const ctx = canvas.getContext("2d");

// Fixe la taille réelle du canvas (évite le décalage)
canvas.width = 380;   // largeur réelle
canvas.height = 520;  // hauteur réelle

const letterGrid =
document.getElementById("letterGrid");

/* =========================
   GUIDE LETTER
========================= */

function drawGuideLetter() {

  ctx.save();

  ctx.globalAlpha = 0.12;

  ctx.fillStyle = "#0033a0";

  ctx.font =
    `${canvas.width * 0.65}px Nohadra, Assyrian, sans-serif`;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    letters[current],
    canvas.width / 2,
    canvas.height / 2
  );

  ctx.restore();
}

/* =========================
   CANVAS
========================= */

function clearCanvas() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  drawGuideLetter();
}

/* =========================
   LETTERS
========================= */

function updateLetter() {

  updateGridSelection();

  clearCanvas();
}

function updateGridSelection() {

  document
    .querySelectorAll(".letter-btn")
    .forEach((btn, index) => {

      btn.classList.toggle(
        "active-letter",
        index === current
      );

    });
}

function buildGrid() {

  letterGrid.innerHTML = "";

  letters.forEach((letter, index) => {

    const btn =
      document.createElement("button");

    btn.className = "letter-btn";

    btn.textContent = letter;

    btn.addEventListener("click", () => {

      current = index;

      updateLetter();

    });

    letterGrid.appendChild(btn);

  });
}

/* =========================
   BUTTONS
========================= */

document
  .getElementById("nextLetter")
  .addEventListener("click", () => {

    current =
      (current + 1) % letters.length;

    updateLetter();

  });

document
  .getElementById("prevLetter")
  .addEventListener("click", () => {

    current =
      (current - 1 + letters.length)
      % letters.length;

    updateLetter();

  });

document
  .getElementById("clearCanvas")
  .addEventListener(
    "click",
    clearCanvas
  );

/* =========================
   DRAWING
========================= */

let drawing = false;

function getPosition(e) {

  const rect =
    canvas.getBoundingClientRect();

  const point =
    e.touches ? e.touches[0] : e;

  return {

    x: point.clientX - rect.left,
    y: point.clientY - rect.top

  };
}

function startDrawing(e) {

  drawing = true;

  const pos =
    getPosition(e);

  ctx.beginPath();

  ctx.moveTo(
    pos.x,
    pos.y
  );
}

function draw(e) {

  if (!drawing) return;

  e.preventDefault();

  const pos =
    getPosition(e);

  ctx.lineWidth = 6;

  ctx.lineCap = "round";

  ctx.lineJoin = "round";

  ctx.strokeStyle = "#0033a0";

  ctx.lineTo(
    pos.x,
    pos.y
  );

  ctx.stroke();
}

function stopDrawing() {

  drawing = false;
}

/* =========================
   EVENTS
========================= */

canvas.addEventListener(
  "mousedown",
  startDrawing
);

canvas.addEventListener(
  "mousemove",
  draw
);

canvas.addEventListener(
  "mouseup",
  stopDrawing
);

canvas.addEventListener(
  "mouseleave",
  stopDrawing
);

canvas.addEventListener(
  "touchstart",
  startDrawing,
  { passive: false }
);

canvas.addEventListener(
  "touchmove",
  draw,
  { passive: false }
);

canvas.addEventListener(
  "touchend",
  stopDrawing
);

/* =========================
   INIT
========================= */

buildGrid();

updateLetter();