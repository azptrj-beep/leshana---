"use strict";

/* ============================================================
   CONFIG
============================================================ */
const SOURETH_LETTERS = [
  "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ",
  "ܚ","ܛ","ܝ","ܟ","ܠ","ܡ","ܢ",
  "ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"
];

/* ============================================================
   INIT AUTO
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const keyboard = document.getElementById("keyboard");
  const input = document.getElementById("keyboardInput") 
              || document.getElementById("translateInput");

  if (!keyboard || !input) return;

  // Active le mode Soureth correct
  input.classList.remove("ltr");
  input.classList.add("rtl");

  generateKeyboard(keyboard, input);
});

/* ============================================================
   GENERATION DU CLAVIER
============================================================ */
function generateKeyboard(container, targetInput) {
  container.innerHTML = "";
  container.classList.add("rtl"); // pas .soureth

  SOURETH_LETTERS.forEach(letter => {
    const btn = createKey(letter, () => insertLetter(targetInput, letter));
    container.appendChild(btn);
  });

  const space = createKey("␣ Espace", () => insertLetter(targetInput, " "));
  space.classList.add("space");
  container.appendChild(space);

  const del = createKey("⌫", () => deleteLetter(targetInput));
  del.classList.add("delete-btn");
  container.appendChild(del);
}

/* ============================================================
   CREATION D’UNE TOUCHE
============================================================ */
function createKey(label, action) {
  const btn = document.createElement("button");
  btn.className = "key-btn";
  btn.textContent = label;

  btn.addEventListener("click", action);
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    action();
  });

  return btn;
}

/* ============================================================
   INSERTION DE LETTRE
============================================================ */
function insertLetter(input, letter) {
  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;

  // Active RTL automatiquement
  input.classList.remove("ltr");
  input.classList.add("rtl");

  input.value =
    input.value.substring(0, start) +
    letter +
    input.value.substring(end);

  input.focus();
  input.selectionStart = input.selectionEnd = start + letter.length;
}

/* ============================================================
   SUPPRESSION
============================================================ */
function deleteLetter(input) {
  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;

  if (start === end && start > 0) {
    input.value =
      input.value.substring(0, start - 1) +
      input.value.substring(end);
    input.selectionStart = input.selectionEnd = start - 1;
  } else {
    input.value =
      input.value.substring(0, start) +
      input.value.substring(end);
    input.selectionStart = input.selectionEnd = start;
  }

  input.focus();

  // Si plus de lettres soureth → repasse en LTR
  if (!/[\u0700-\u074F]/.test(input.value)) {
    input.classList.remove("rtl");
    input.classList.add("ltr");
  }
}

/* ============================================================
   EXPORT GLOBAL
============================================================ */
window.insertLetter = (letter) => {
  const input = document.getElementById("keyboardInput") 
             || document.getElementById("translateInput");
  if (input) insertLetter(input, letter);
};

window.deleteLetter = () => {
  const input = document.getElementById("keyboardInput") 
             || document.getElementById("translateInput");
  if (input) deleteLetter(input);
};