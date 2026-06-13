
"use strict";
/* ============================================
   CANVAS.JS — Écriture tactile
============================================ */

let canvas = document.getElementById("writingCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

let drawing = false;

if (canvas && ctx) {

    const start = (e) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    };

    const draw = (e) => {
        if (!drawing) return;
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#00eaff";
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    };

    const stop = () => {
        drawing = false;
        ctx.closePath();
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);

    // MOBILE
    canvas.addEventListener("touchstart", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(x, y);
    });

    canvas.addEventListener("touchmove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        if (!drawing) return;
        ctx.lineTo(x, y);
        ctx.stroke();
    });

    canvas.addEventListener("touchend", stop);
}