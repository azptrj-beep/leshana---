
"use strict";
/* ============================================
   ALPHABET.JS — Sons + Interactions
============================================ */

document.querySelectorAll(".letter-box").forEach(box => {
    box.addEventListener("click", () => {
        const audio = box.dataset.audio;
        if (audio) {
            new Audio(audio).play();
        }
    });
});