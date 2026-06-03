"use strict";

/* =========================================
   CLAVIER SOURETH FIX FINAL + V2 READY
========================================= */

let editorId = "editor";

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
}

/* INIT KEYBOARD (SAFE FOR FUTURE SPA) */
function initKeyboard(targetId = "editor") {
  setKeyboardTarget(targetId);
}

/* EXPORT GLOBAL */
window.insertLetter = insertLetter;
window.deleteLetter = deleteLetter;
window.initKeyboard = initKeyboard;