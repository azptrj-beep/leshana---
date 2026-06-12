/* ============================================
   KEYBOARD.JS — Clavier Soureth Premium
============================================ */

const keyboardContainer = document.querySelector(".soureth-keyboard");
const output = document.querySelector(".soureth-writing");

if (keyboardContainer && output) {

    // INSÉRER UNE LETTRE
    keyboardContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("key-btn")) {
            const letter = e.target.dataset.letter;
            output.value += letter;
        }

        // SUPPRIMER
        if (e.target.classList.contains("delete-btn")) {
            output.value = output.value.slice(0, -1);
        }
    });
}