/* ================================
   ÉCRITURE TACTILE — VERSION FINALE
   Avec lettre fantôme + anti-décalage
=================================== */

const canvas = document.getElementById("writingCanvas");
const ctx = canvas.getContext("2d");

// Taille réelle du canvas
const REAL_WIDTH = 380;
const REAL_HEIGHT = 520;

canvas.width = REAL_WIDTH;
canvas.height = REAL_HEIGHT;

// Style du trait
ctx.lineWidth = 8;
ctx.lineCap = "round";
ctx.strokeStyle = "#ffffff";

// Variables
let drawing = false;
let lastX = 0;
let lastY = 0;

/* ================================
   COORDONNÉES CORRECTES (ANTI-DÉCALAGE)
=================================== */
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = REAL_WIDTH / rect.width;
    const scaleY = REAL_HEIGHT / rect.height;

    let x, y;

    if (e.touches) {
        x = (e.touches[0].clientX - rect.left) * scaleX;
        y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
        x = (e.clientX - rect.left) * scaleX;
        y = (e.clientY - rect.top) * scaleY;
    }

    return { x, y };
}

/* ================================
   DESSIN
=================================== */
function startDrawing(e) {
    drawing = true;
    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
}

function draw(e) {
    if (!drawing) return;

    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastX = pos.x;
    lastY = pos.y;
}

function stopDrawing() {
    drawing = false;
}

/* ================================
   SOURIS
=================================== */
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

/* ================================
   TOUCH
=================================== */
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startDrawing(e);
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    draw(e);
});

canvas.addEventListener("touchend", stopDrawing);

/* ================================
   LETTRE FANTÔME
=================================== */
function drawGhostLetter(letter) {
    ctx.clearRect(0, 0, REAL_WIDTH, REAL_HEIGHT);

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#ffffff";
    ctx.font = "260px 'Nohadra', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(letter, REAL_WIDTH / 2, REAL_HEIGHT / 2);
    ctx.restore();
}

function redrawGhost() {
    drawGhostLetter(letters[currentIndex]);
}

/* ================================
   LETTRES
=================================== */
let currentIndex = 0;
const letters = [
    "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ","ܚ","ܛ","ܝ",
    "ܟ","ܠ","ܡ","ܢ","ܣ","ܥ","ܦ","ܨ","ܩ","ܪ",
    "ܫ","ܬ"
];

function updateLetter() {
    const letter = letters[currentIndex];
    const title = document.querySelector(".soureth-title");
    if (title) title.textContent = letter;
    drawGhostLetter(letter);
}

document.getElementById("nextLetter").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % letters.length;
    updateLetter();
});

document.getElementById("prevLetter").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + letters.length) % letters.length;
    updateLetter();
});

/* ================================
   BOUTON EFFACER
=================================== */
document.getElementById("clearCanvas").addEventListener("click", () => {
    ctx.clearRect(0, 0, REAL_WIDTH, REAL_HEIGHT);
    redrawGhost();
});

/* ================================
   INIT
=================================== */
updateLetter();