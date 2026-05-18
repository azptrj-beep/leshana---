

"use strict";

keyboard.js
function insertLetter(letter) {

  const editor = document.getElementById('editor');

  editor.value += letter;

  editor.focus();
}
