"use strict";

/* =========================
   ALPHABET SOURETH
========================= */
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
const guideLetter = document.getElementById("guideLetter");

if (!canvas || !ctx || !guideLetter) {
    console.error("Éléments écriture introuvables");
}

/* =========================
   LETTRE AFFICHAGE
========================= */
function updateLetter(){
    guideLetter.textContent = letters[current];
}

/* =========================
   CANVAS SETUP
========================= */
function resizeCanvas(){
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* style dessin */
ctx.strokeStyle = "#0033a0";
ctx.lineWidth = 6;
ctx.lineCap = "round";

/* =========================
   NAVIGATION LETTRES
========================= */
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

/* =========================
   CLEAR CANVAS
========================= */
function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* =========================
   DRAW (SOURIS + TACTILE)
========================= */
let drawing = false;

function getPos(e){
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;

    return {
        x: t.clientX - rect.left,
        y: t.clientY - rect.top
    };
}

function startDraw(e){
    drawing = true;
    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function draw(e){
    if(!drawing) return;
    e.preventDefault();

    const pos = getPos(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function stopDraw(){
    drawing = false;
}

/* souris */
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);

/* tactile */
canvas.addEventListener("touchstart", startDraw, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDraw);

/* =========================
   INIT
========================= */
updateLetter();