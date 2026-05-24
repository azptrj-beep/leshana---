

"use strict";

export function insertLetter(letter) {
  const input = document.getElementById("editor");
  if (!input) return;

  input.value += letter;
}