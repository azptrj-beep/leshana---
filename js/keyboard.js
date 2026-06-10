"use strict";

/* =========================================
   CLAVIER SOURETH FIX FINAL + V2 READY
========================================= */

let editorId = "input";

/* TARGET DYNAMIC (SPA READY) */
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

  /* ACTIVE RTL SI LETTRE SYRIAQUE */
  if (/[\u0700-\u074F]/.test(letter)) {
    input.classList.add("rtl");
  }
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

  /* SI PLUS DE SYRIAQUE → REPASSE EN LTR */
  if (!/[\u0700-\u074F]/.test(input.value)) {
    input.classList.remove("rtl");
  }
}  // ← ACCOLADE QUI MANQUAIT

/* INIT KEYBOARD (SAFE FOR FUTURE SPA) */
function initKeyboard(targetId = "input") {
  setKeyboardTarget(targetId);
}

/* EXPORT GLOBAL */
window.insertLetter = insertLetter;
window.deleteLetter = deleteLetter;
window.initKeyboard = initKeyboard;

/* =========================
   CLAVIER SOURETH PREMIUM
========================= */

const sourethLetters = [
  "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ","ܚ","ܛ","ܝ",
  "ܟ","ܠ","ܡ","ܢ","ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"
];

function generateKeyboard() {
  const kb = document.getElementById("keyboard");
  if (!kb) return;

  kb.innerHTML = "";

  sourethLetters.forEach(letter => {
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

document.addEventListener("DOMContentLoaded", generateKeyboard);