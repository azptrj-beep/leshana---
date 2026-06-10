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
}

/* INIT KEYBOARD */
function initKeyboard(targetId = "input") {
  setKeyboardTarget(targetId);
}

/* EXPORT GLOBAL */
window.insertLetter = insertLetter;
window.deleteLetter = deleteLetter;
window.initKeyboard = initKeyboard;

/* =========================
   CLAVIER SOURETH PREMIUM À ONGLETES
========================= */

/* --- LAYOUTS --- */
const layoutConsonnes = [
  "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ","ܚ","ܛ","ܝ",
  "ܟ","ܠ","ܡ","ܢ","ܣ","ܥ","ܦ","ܨ","ܩ","ܪ","ܫ","ܬ"
];

const layoutVoyelles = [
  "ܵ","ܸ","ܿ","ܲ","ܼ","ܹ","ܺ"
];

const layoutFinales = [
  "ܟ݂","ܡ̇","ܢ̇"
];

const layoutChiffres = [
  "ܐ","ܒ","ܓ","ܕ","ܗ","ܘ","ܙ","ܚ","ܛ","ܝ"
];

const layoutPonctuation = [
  "،","؛","؟","܀","܁","܂"
];

let currentLayout = "consonnes";

/* --- GET LAYOUT --- */
function getLayoutLetters() {
  switch (currentLayout) {
    case "voyelles": return layoutVoyelles;
    case "finales": return layoutFinales;
    case "chiffres": return layoutChiffres;
    case "ponctuation": return layoutPonctuation;
    default: return layoutConsonnes;
  }
}

/* --- ACTIVE TAB --- */
function setActiveTab() {
  const tabs = document.querySelectorAll("#keyboard-tabs .tab-btn");
  tabs.forEach(t => {
    t.classList.toggle("active", t.dataset.layout === currentLayout);
  });
}

/* --- GENERATE KEYBOARD --- */
function generateKeyboard() {
  const kb = document.getElementById("keyboard");
  if (!kb) return;

  kb.innerHTML = "";

  const letters = getLayoutLetters();

  letters.forEach(letter => {
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

  setActiveTab();
}

/* --- INIT TABS + KEYBOARD --- */
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("#keyboard-tabs .tab-btn");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      currentLayout = tab.dataset