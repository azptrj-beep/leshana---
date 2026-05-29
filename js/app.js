"use strict";

/* =========================================
   GLOBAL STATE
========================================= */

let xp =
  parseInt(localStorage.getItem("xp")) || 0;

let level =
  parseInt(localStorage.getItem("level")) || 1;

/* =========================================
   SOURETH LETTERS
========================================= */

const sourethLetters = [
  "ܐ","ܒ","ܓ","ܕ","ܗ",
  "ܘ","ܙ","ܚ","ܛ","ܝ",
  "ܟ","ܠ","ܡ","ܢ","ܣ",
  "ܥ","ܦ","ܨ","ܩ","ܪ",
  "ܫ","ܬ"
];

let currentLetterIndex = 0;

/* =========================================
   INIT
========================================= */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    initTheme();
    updateXPUI();
    initCanvas();
    updateLetter();
  }
);

/* =========================================
   THEME
========================================= */

function toggleTheme(){

  document.body.classList.toggle(
    "light-mode"
  );

  localStorage.setItem(
    "theme",
    document.body.classList.contains(
      "light-mode"
    )
  );
}

function initTheme(){

  const saved =
    localStorage.getItem("theme");

  if(saved === "true"){

    document.body.classList.add(
      "light-mode"
    );
  }
}

/* =========================================
   MENU
========================================= */

function toggleMenu(){

  const nav =
    document.querySelector("nav");

  if(nav){

    nav.classList.toggle("active");
  }
}

/* =========================================
   XP SYSTEM
========================================= */

function updateXPUI(){

  const xpEl =
    document.getElementById("xp-value");

  const levelEl =
    document.getElementById("level-value");

  if(xpEl){
    xpEl.textContent = xp;
  }

  if(levelEl){
    levelEl.textContent = level;
  }
}

/* =========================================
   SOURETH WRITING SYSTEM
========================================= */

let canvas;
let ctx;
let drawing = false;
function initCanvas() {
  const canvas = document.getElementById("drawCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  let drawing = false;

  function pos(e) {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches?.[0] || e;

    return {
      x: t.clientX - rect.left,
      y: t.clientY - rect.top
    };
  }

  canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;

    const p = pos(e);
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0033a0";

    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  });

  canvas.addEventListener("pointerup", () => drawing = false);
  canvas.addEventListener("pointercancel", () => drawing = false);

  window.clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

/* =========================================
   RESIZE
========================================= */

function resizeCanvas(){

  if(!canvas) return;

  canvas.width =
    canvas.offsetWidth;

  canvas.height =
    canvas.offsetHeight;
}

/* =========================================
   LETTER DISPLAY
========================================= */

function updateLetter(){

  const letter =
    sourethLetters[currentLetterIndex];

  const display =
    document.getElementById(
      "letterDisplay"
    );

  const guide =
    document.getElementById(
      "guideLetter"
    );

  if(display){
    display.innerText = letter;
  }

  if(guide){
    guide.innerText = letter;
  }
}

/* =========================================
   POSITION
========================================= */

function getPosition(e){

  const rect =
    canvas.getBoundingClientRect();

  return {

    x:
      e.clientX - rect.left,

    y:
      e.clientY - rect.top
  };
}

/* =========================================
   DRAW START
========================================= */

function startDraw(e){

  drawing = true;

  const pos =
    getPosition(e);

  ctx.beginPath();

  ctx.moveTo(
    pos.x,
    pos.y
  );
}

/* =========================================
   DRAW MOVE
========================================= */

function draw(e){

  if(!drawing) return;

  const pos =
    getPosition(e);

  ctx.lineWidth = 7;

  ctx.lineCap = "round";

  ctx.strokeStyle =
    "#0033a0";

  ctx.lineTo(
    pos.x,
    pos.y
  );

  ctx.stroke();
}

/* =========================================
   STOP DRAW
========================================= */

function stopDraw(){

  drawing = false;

  ctx.beginPath();
}

/* =========================================
   CLEAR CANVAS
========================================= */

function clearCanvas(){

  if(!ctx || !canvas) return;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
}

/* =========================================
   NEXT LETTER
========================================= */

function nextLetter(){

  currentLetterIndex++;

  if(
    currentLetterIndex >=
    sourethLetters.length
  ){
    currentLetterIndex = 0;
  }

  updateLetter();

  clearCanvas();
}

/* =========================================
   GLOBAL EXPORTS
========================================= */

window.toggleTheme = toggleTheme;
window.toggleMenu = toggleMenu;
window.clearCanvas = clearCanvas;
window.nextLetter = nextLetter;