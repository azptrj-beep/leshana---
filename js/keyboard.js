"use strict";

/* =========================================
   CLAVIER SOURETH — VERSION SIMPLE & COMPLÈTE
========================================= */

let editorId = "input";

/* TARGET */
function setKeyboardTarget(id) {
  editorId = id;
}

function getEditor() {
  return document.getElementById(editorId);
}

/* INSERT LETTER */
function insertLetter(letter) {
  const input = getEditor();
  if (!input) return;

  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;

  input.value =
    input.value.slice(0, start) +
    letter +
    input.value.slice(end);

  const pos = start + letter.length;
  input.setSelectionRange(pos, pos);
  input.focus();

  // Active RTL si lettre syriaque
  if (/[\u0700-\u074F]/.test(letter)) {
    input.classList.add("rtl");
  }

  // 🔥 TRIGGER TRADUCTION
  input.dispatchEvent(new Event("input"));
}

/* DELETE LETTER */
function deleteLetter() {
  const input = getEditor();
  if (!input) return;

  const start = input.selectionStart;
  const end = input.selectionEnd;

  if (start === end && start > 0) {
    input.value =
      input.value.slice(0, start - 1) +
      input.value.slice(end);
    input.setSelectionRange(start - 1, start - 1);
  } else {
    input.value =
      input.value.slice(0, start) +
      input.value.slice(end);
    input.setSelectionRange(start, start);
  }

  input.focus();

  // Si plus de syriaque → repasse en LTR
  if (!/[\u0700-\u074F]/.test(input.value)) {
    input.classList.remove("rtl");
  }

  // 🔥 TRIGGER TRADUCTION
  input.dispatchEvent(new Event("input"));
}

/* INIT KEYBOARD */
function initKeyboard(targetId = "input") {
  setKeyboardTarget(targetId);
}

window.insertLetter = insertLetter;
window.deleteLetter = deleteLetter;
window.initKeyboard = initKeyboard;

/* =========================================
   LAYOUT UNIQUE : LETTRES + VOYELLES + FINALES + CHIFFRES
========================================= */

const fullLayout = [

  // Lettres
  "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ","ܚ","ܛ","ܝ",
  "ܟ","ܠ","ܡ","ܢ","ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ",

  // Voyelles
  "ܵ","ܸ","ܿ","ܲ","ܼ","ܹ","ܺ",

  // Formes finales
  "ܟ݂","ܡ̇","ܢ̇",

  // Chiffres araméens
  "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ","ܚ","ܛ","ܝ",

  // Ponctuation
  "،","؛","؟","܀","܁","܂"
];

/* =========================================
   GENERATE KEYBOARD
========================================= */

function generateKeyboard() {
  const kb = document.getElementById("keyboard");
  if (!kb) return;

  kb.innerHTML = "";

  fullLayout.forEach(letter => {
    const btn = document.createElement("button");
    btn.className = "key-btn";
    btn.innerText = letter;
    btn.addEventListener("click", () => insertLetter(letter));
    kb.appendChild(btn);
  });

  // Bouton effacer
  const del = document.createElement("button");
  del.className = "key-btn delete-btn";
  del.innerText = "⌫";
  del.addEventListener("click", deleteLetter);
  kb.appendChild(del);
}

/* =========================================
   INIT AUTO
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  initKeyboard("input");
  generateKeyboard();
});