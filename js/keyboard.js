"use strict";

/* =========================================
   CLAVIER SOURETH FIX FINAL
========================================= */

function getEditor() {
  return document.getElementById("editor");
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
}

/* DELETE */
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
}

/* EXPORT GLOBAL */
window.insertLetter = insertLetter;
window.deleteLetter = deleteLetter;