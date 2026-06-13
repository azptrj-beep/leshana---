"use strict";
/* ============================================
   KEYBOARD.JS — Clavier Soureth Premium
============================================ */

const keyboardContainer = document.getElementById("keyboard");
const output = document.getElementById("input");

if (keyboardContainer && output) {

    keyboardContainer.addEventListener("click", (e) => {

        // INSÉRER UNE LETTRE
        if (e.target.classList.contains("key-btn")) {
            const letter = e.target.dataset.letter;
            output.value += letter;

            // TRADUCTION EN TEMPS RÉEL
            output.dispatchEvent(new Event("input"));
        }

        // SUPPRIMER
        if (e.target.classList.contains("delete-btn")) {
            output.value = output.value.slice(0, -1);
            output.dispatchEvent(new Event("input"));
        }
    });
}