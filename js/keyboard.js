"use strict";

/* =========================================
   CLAVIER SOURETH UNIVERSEL
========================================= */

let activeInput = null;

/* 🔥 détecte automatiquement le champ actif */
document.addEventListener("focusin", (e) => {
  const el = e.target;

  if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
    activeInput = el;
  }
});

/* =========================================
   INSERTION LETTRE
========================================= */
function pressKey(letter) {
  if (!activeInput) return;

  const start = activeInput.selectionStart ?? activeInput.value.length;
  const end = activeInput.selectionEnd ?? activeInput.value.length;

  const value = activeInput.value;

  activeInput.value =
    value.substring(0, start) +
    letter +
    value.substring(end);

  const newPos = start + letter.length;

  activeInput.selectionStart = newPos;
  activeInput.selectionEnd = newPos;

  activeInput.focus();
}

/* =========================================
   BACKSPACE (option utile)
========================================= */
function deleteKey() {
  if (!activeInput) return;

  const start = activeInput.selectionStart;
  const end = activeInput.selectionEnd;

  if (start === end && start > 0) {
    activeInput.value =
      activeInput.value.slice(0, start - 1) +
      activeInput.value.slice(end);

    activeInput.selectionStart = start - 1;
    activeInput.selectionEnd = start - 1;
  } else {
    activeInput.value =
      activeInput.value.slice(0, start) +
      activeInput.value.slice(end);

    activeInput.selectionStart = start;
    activeInput.selectionEnd = start;
  }

  activeInput.focus();
}

/* =========================================
   EXPORT GLOBAL (HTML onclick)
========================================= */
window.pressKey = pressKey;
window.deleteKey = deleteKey;