"use strict";

const letters = [
  "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ",
  "ܚ","ܛ","ܝ","ܟ","ܠ","ܡ","ܢ",
  "ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"
];

let index = 0;

let canvas, ctx;
let drawing = false;

window.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("drawCanvas");
  if (!canvas) return;

  ctx = canvas.getContext("2d");

  resize();
  window.addEventListener("resize", resize);

  setLetter();

  canvas.addEventListener("pointerdown", start);
  canvas.addEventListener("pointermove", draw);
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointerleave", stop);
});

function resize() {

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  setLetter();

}

function setLetter() {

  const l = letters[index];

  const display =
    document.getElementById("letterDisplay");

  if (display) {
    display.textContent = l;
  }

  clear();

  ctx.save();

  ctx.font = "180px Nohadra";

  ctx.fillStyle =
    "rgba(0,51,160,0.12)";

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    l,
    canvas.width / 2,
    canvas.height / 2
  );

  ctx.restore();
}

function start(e) {
  drawing = true;
  const p = pos(e);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
}

function draw(e) {
  if (!drawing) return;

  const p = pos(e);

  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#0033a0";

  ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

function stop() {
  drawing = false;
}

function pos(e) {
  const r = canvas.getBoundingClientRect();
  const t = e.touches?.[0] || e;

  return {
    x: t.clientX - r.left,
    y: t.clientY - r.top
  };
}

function clear() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}

function nextLetter() {
  index = (index + 1) % letters.length;
  setLetter();
}

window.clearCanvas = clear;
window.nextLetter = nextLetter;